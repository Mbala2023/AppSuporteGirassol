package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.ChatDTO;
import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;
import reactor.core.publisher.Sinks;

@RequiredArgsConstructor
@BrowserCallable
@Service
public class ChatService {
  private final ChatRepositorio chatRepositorio;
  private final UsuarioRepositorio usuarioRepositorio;
  private final AIAssistentService aiAssistentService;
  private final UsuarioService usuarioService;
  private final Map<Long, FluxSink<ServerSentEvent<MensagemDTO>>> chatSinks =
      new ConcurrentHashMap<>();

  @RolesAllowed("ROLE_USER")
  public ChatDTO getChat(Long chatId) {
    return chatRepositorio.findById(chatId).map(ChatDTO::converter).orElse(null);
  }

  public Flux<ServerSentEvent<MensagemDTO>> getMessagesStream(Long chatId) {
    return Flux.create(sink -> {
      chatSinks.put(chatId, sink);
      sink.onDispose(() -> chatSinks.remove(chatId));
    });
  }

  @RolesAllowed("ROLE_USER")
  public @NonNull Flux<@NonNull MensagemDTO> getMensagens(Long chatId) {
    return chatRepositorio.findById(chatId)
        .map(Chat::getMensagens)
        .map(Flux::fromIterable)
        .orElse(Flux.empty())
        .map(MensagemDTO::converte);
  }

  @Transactional
  @RolesAllowed("ROLE_USER")
  public void processIncomingMessage(Long chatId, MensagemDTO messageDTO) {
    var chatModel = chatRepositorio.findById(chatId).orElse(null);
    if (chatModel == null) {
      // Create a system error message and push it to the sink
      var errorMessage = new MensagemDTO(null,
          "system",
          chatId,
          null,
          "Ocorreu um erro",
          "Sistema",
          LocalDateTime.now());
      pushMessageToSink(chatId, errorMessage);
      return;
    }
    var usuario = usuarioService.logado();

    if (chatModel.getTecnico() == null && usuario.getPapel() == Papel.TECNICO) {
      chatModel.setTecnico(usuario);
    }

    var messageModel = messageDTO.toModel();
    messageModel.setChat(chatModel);
    messageModel.setUsuario(usuario); // Set the logged-in user as the sender

    // Save the incoming message
    chatModel.getMensagens().add(messageModel);
    chatRepositorio.save(chatModel);

    // Push the new message to the stream
    pushMessageToSink(chatId, MensagemDTO.converte(messageModel));

    // If chat is active and no technician is assigned, get AI response
    if (chatModel.isActive() && chatModel.getTecnico() == null) {
      var aiResponse = aiAssistentService.respondUser(messageModel);

      // Save AI response message
      var aiMessageModel = aiResponse.toModel();
      aiMessageModel.setChat(chatModel);
      aiMessageModel.setUsuario(
          usuarioRepositorio.findByUsername("bot")); // Assuming a 'bot' user
      chatModel.getMensagens().add(aiMessageModel);
      chatRepositorio.save(chatModel);

      // Push AI response to the stream
      pushMessageToSink(chatId, aiResponse);
    }
  }

  @RolesAllowed("ROLE_USER")
  private void pushMessageToSink(Long chatId, MensagemDTO message) {
    FluxSink<ServerSentEvent<MensagemDTO>> sink = chatSinks.get(chatId);
    if (sink != null) {
      sink.next(ServerSentEvent.builder(message).build());
    }
  }

  public boolean isUserInChat(String username, Long chatId) {
    var user = usuarioRepositorio.findByUsername(username);
    if (user == null) {
      return false;
    }
    var chat = chatRepositorio.findById(chatId).orElse(null);
    if (chat == null) {
      return false;
    }

    boolean isCliente =
        chat.getCliente() != null && chat.getCliente().getUsername().equals(username);
    boolean isTecnico =
        chat.getTecnico() != null && chat.getTecnico().getUsername().equals(username);

    return isCliente || isTecnico;
  }
}

