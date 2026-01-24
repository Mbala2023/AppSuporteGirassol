package ao.appsuportegirassol.services;

import ao.appsuportegirassol.configs.Assistant;
import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Mensagem;
import dev.langchain4j.model.chat.ChatModel; // Still needed for ChatModel bean, but not directly used here
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AIAssistentService {
  private final Assistant assistant;

  public MensagemDTO respondUser(Mensagem mensagem) {
    Long orderId = mensagem.getChat().getPedido().getId();
    ToolContextProvider.setOrderId(orderId); // Set the orderId in ThreadLocal

    try {
      String aiResponseText = assistant.chat(mensagem.getConteudo());

      return new MensagemDTO(
          null,
          "bot",
          mensagem.getChat().getPedido().getId(),
          null,
          aiResponseText,
          "Assistente",
          LocalDateTime.now()
      );
    } finally {
      ToolContextProvider.clear(); // Clear the orderId after processing
    }
  }
}
