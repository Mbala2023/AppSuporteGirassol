package ao.appsuportegirassol.controllers;

import ao.appsuportegirassol.dto.MessageDTO;
import ao.appsuportegirassol.models.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class ChatController {

  @MessageMapping("/chat/{chat}")
  @SendTo("/topic/chat/{chat}")
  public MessageDTO sendMessage(@Payload MessageDTO message, @PathVariable String chat) {
    return message;
  }
}
