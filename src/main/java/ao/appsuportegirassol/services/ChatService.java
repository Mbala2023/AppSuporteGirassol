package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.ChatDTO;
import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@BrowserCallable
public class ChatService {
  private final ChatRepositorio chatRepositorio;
  private final UsuarioRepositorio usuarioRepositorio;
  private final AIAssistentService aiAssistentService;
  private final UsuarioService usuarioService;

  @RolesAllowed("ROLE_USER")
  public ChatDTO getChat(@NonNull Long chatId) {
    var usuario = usuarioService.logado();

    if (isUserInChat(usuario.getUsername(), chatId)) {
      return chatRepositorio.findById(chatId).map(ChatDTO::converter).orElse(null);
    }

    return null;
  }

  @Transactional
  @RolesAllowed("ROLE_USER")
  public void enviarMensagem(@NonNull Long chatId, @NonNull MensagemDTO mensagem) {
    var chatModel = chatRepositorio.findById(chatId).orElse(null);
    if (chatModel == null) {
      var errorMessage = new MensagemDTO(null,
          "system",
          chatId,
          null,
          "Ocorreu um erro",
          "Sistema",
          LocalDateTime.now());
      return;
    }
    var usuario = usuarioService.logado();

    if (chatModel.getTecnico() == null && usuario.getPapel() == Papel.TECNICO) {
      chatModel.setTecnico(usuario);
    }

    var messageModel = mensagem.toModel();
    messageModel.setChat(chatModel);
    messageModel.setUsuario(usuario); // Set the logged-in user as the sender

    // Save the incoming message
    chatModel.getMensagens().add(messageModel);
    chatRepositorio.save(chatModel);

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

    if (user.getPapel() == Papel.TECNICO) {
      return true;
    }

    boolean isCliente =
        chat.getCliente() != null && chat.getCliente().getUsername().equals(username);
    boolean isTecnico =
        chat.getTecnico() != null && chat.getTecnico().getUsername().equals(username);

    return isCliente || isTecnico;
  }
}

