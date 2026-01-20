package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Chat;
import org.jspecify.annotations.NonNull;

import java.util.List;

public record ChatDTO(PedidoDTO pedidoDTO, List<@NonNull MensagemDTO> mensagens) {
  public static ChatDTO converter(Chat chat) {
    return new ChatDTO(
        PedidoDTO.converte(chat.getPedido()),
        chat.getMensagens().stream().map(MensagemDTO::converte).toList()
    );
  }
}
