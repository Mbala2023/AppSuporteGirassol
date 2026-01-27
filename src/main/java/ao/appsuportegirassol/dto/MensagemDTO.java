package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Mensagem;
import ao.appsuportegirassol.models.Usuario;

import java.time.LocalDateTime;

import static java.util.Optional.ofNullable;

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
        ofNullable(mensagem.getUsuario()).map(Usuario::getUsername).orElse(null),
        mensagem.getChat().getId(),
        mensagem.getChat().getPedido().getId(),
        mensagem.getConteudo(),
        ofNullable(mensagem.getUsuario()).map(Usuario::getNome).orElse(null),
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
