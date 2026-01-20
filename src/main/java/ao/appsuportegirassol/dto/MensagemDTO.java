package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Mensagem;
import org.jspecify.annotations.NonNull;

import java.time.LocalDateTime;

public record MensagemDTO(
    Long id,
    String sender, // Pode ser "user", "bot"
    long idPedido,
    Long idUsuario,
    String conteudo,
    LocalDateTime timestamp // Data e hora da mensagem
) {
  public Mensagem toModel() {
    var out = new Mensagem();
    out.setSender(sender);
    out.setConteudo(conteudo);
    out.setTimestamp(timestamp);
    return out;
  }

  public static MensagemDTO converte(@NonNull Mensagem mensagem) {
    return new MensagemDTO(
        mensagem.getId(),
        mensagem.getSender(),
        mensagem.getChat().getPedido().getId(),
        mensagem.getUsuario().getId(),
        mensagem.getConteudo(),
        mensagem.getTimestamp()
    );
  }
}
