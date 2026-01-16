package ao.appsuportegirassol.controllers;

import ao.appsuportegirassol.dto.MessageDTO;
import ao.appsuportegirassol.models.Message;
import ao.appsuportegirassol.services.AIAssistentService;
import ao.appsuportegirassol.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

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
      return new MessageDTO(
          "system",
          "Ocorreu um erro",
          new Date().toString()
      );
    }

    var m = aiAssistentService.respondUser(message.toModel());
    chatService.addMessage(chat, m);

    return new MessageDTO(m.getSender(), m.getContent(), m.getTimestamp());
  }
}
