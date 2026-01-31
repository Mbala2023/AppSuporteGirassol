package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Avaliacao;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.repository.AvaliacaoRepositorio;
import ao.appsuportegirassol.repository.PedidoRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;

import java.util.List;

@BrowserCallable
@RequiredArgsConstructor
public class AvaliacaoService {
  private final AvaliacaoRepositorio avaliacaoRepositorio;
  private final UsuarioRepositorio usuarioRepositorio;
  private final PedidoRepositorio pedidoRepositorio;

  @PermitAll
  public @NonNull List<@NonNull Avaliacao> listarAvaliacoes() {
    return avaliacaoRepositorio.findAll();
  }

  @RolesAllowed("ROLE_CLIENTE")
  public void avaliarTecnico(@NonNull Integer pedidoId, @NonNull Integer estrelas) {
    var pedido = pedidoRepositorio.findById(pedidoId).orElse(null);

    if (pedido == null) {
      return;
    }

    var tecnico = pedido.getTecnico();

    if (tecnico == null) {
      return;
    }

    var avaliacao = new Avaliacao();
    avaliacao.setEstrelas(estrelas);
    avaliacao.setTecnico(tecnico);

    avaliacaoRepositorio.save(avaliacao);

    pedido.setEstado(PedidoEstado.AVALIADO);
    pedidoRepositorio.save(pedido);
  }
}
