package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Message;

public record MessageDTO(String sender, // Pode ser "user", "bot"
                         long idPedido,
                         long idUsuario,
                         String content,
                         String timestamp // Data e hora da mensagem
) {
  public Message toModel() {
    var out = new Message();
    out.setSender(sender);
    out.setConteudo(content);
    out.setTimestamp(timestamp);
    return out;
  }
}
