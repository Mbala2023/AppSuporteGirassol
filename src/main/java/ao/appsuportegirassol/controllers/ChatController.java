package ao.appsuportegirassol.controllers;

import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.services.AIAssistentService;
import ao.appsuportegirassol.services.ChatService;
import ao.appsuportegirassol.services.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Date;

import static java.time.LocalDateTime.now;
import static java.util.Optional.ofNullable;

@Controller
@RequiredArgsConstructor
public class ChatController {
  private final ChatService chatService;
  private final AIAssistentService aiAssistentService;
  private final ChatRepositorio chatRepositorio;
  private final UsuarioService usuarioService;

  @MessageMapping("/chat/{chat}")
  @SendTo("/topic/chat/{chat}")
  public MensagemDTO sendMessage(@DestinationVariable("chat") Long chat, @Payload MensagemDTO message) {
    var chatModel = chatRepositorio.findById(chat).orElse(null);

    if (chatModel == null) {
      return new MensagemDTO(null, "system", -1, null, "Ocorreu um erro", now());
    }

    var messageModel = message.toModel();
    messageModel.setChat(chatModel);

    messageModel.setUsuario(usuarioService.logado());

    if (chatModel.isActive() && chatModel.getTecnico() == null) {
      var m = aiAssistentService.respondUser(messageModel);
      chatService.addMessage(chat, message);

      return m;
    }

    return null;
  }
}
