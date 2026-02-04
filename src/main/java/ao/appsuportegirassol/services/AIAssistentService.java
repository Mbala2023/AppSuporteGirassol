package ao.appsuportegirassol.services;

import ao.appsuportegirassol.ia.Assistente;
import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Mensagem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AIAssistentService {
  private final Assistente assistente;

  public MensagemDTO respondUser(Mensagem mensagem) {
    Long orderId = mensagem.getChat().getPedido().getId();
    ToolContextProvider.setOrderId(orderId); // Set the orderId in ThreadLocal

    try {
      String aiResponseText = assistente.chat(
          mensagem.getChat().getId(),
          mensagem.getChat().getPedido().getDescricao(),
          mensagem.getConteudo()
      );

      return new MensagemDTO(
          null,
          "bot",
          mensagem.getChat().getId(),
          mensagem.getChat().getPedido().getId(),
          aiResponseText,
          "Assistente",
          LocalDateTime.now()
      );
    } finally {
      ToolContextProvider.clear(); // Clear the orderId after processing
    }
  }
}
