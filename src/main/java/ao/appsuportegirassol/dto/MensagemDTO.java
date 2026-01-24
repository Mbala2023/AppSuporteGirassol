package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Mensagem;
import java.time.LocalDateTime;

public record MensagemDTO(
    Long id,
    String username,
    Long chatId,
    Long pedidoId,
    String conteudo,
    String nomeDoUsuario,
    LocalDateTime dataEnvio) {

  public static MensagemDTO converte(Mensagem mensagem) {
    return new MensagemDTO(
        mensagem.getId(),
        mensagem.getUsuario().getUsername(),
        mensagem.getChat().getId(),
        mensagem.getChat().getPedido().getId(),
        mensagem.getConteudo(),
        mensagem.getUsuario().getNome(),
        mensagem.getDataEnvio());
  }

  public Mensagem toModel() {
    var model = new Mensagem();
    model.setId(id());
    model.setConteudo(conteudo());
    model.setDataEnvio(dataEnvio());

    return model;
  }
}
