package ao.appsuportegirassol.controllers;

import ao.appsuportegirassol.dto.MessageDTO;
import ao.appsuportegirassol.services.AIAssistentService;
import ao.appsuportegirassol.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
@RequiredArgsConstructor
public class ChatController {
  private final ChatService chatService;
  private final AIAssistentService aiAssistentService;


  @MessageMapping("/chat/{chat}")
  @SendTo("/topic/chat/{chat}")
  public MessageDTO sendMessage(@DestinationVariable("chat") Long chat, @Payload MessageDTO message) {
    var chatModel = chatService.getChat(chat);

    if (chatModel == null) {
      return new MessageDTO("system", -1, -1, "Ocorreu um erro", new Date().toString());
    }

    var messageModel = message.toModel();
    messageModel.setChat(chatModel);
    messageModel.setUsuario(chatModel.getPedido().getCliente());

    var m = aiAssistentService.respondUser(messageModel);
    chatService.addMessage(chat, message);

    return new MessageDTO(
        m.getSender(),
        m.getChat().getPedido().getId(),
        m.getUsuario().getId(),
        m.getConteudo(),
        m.getTimestamp()
    );
  }
}
