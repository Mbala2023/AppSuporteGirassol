package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.repository.PedidoRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@BrowserCallable
@RequiredArgsConstructor
public class PedidoService {
  private final PedidoRepositorio repositorio;
  private final UsuarioRepositorio usuarioRepositorio;

  public Pedido encontrarPedido(@NonNull Integer id) {
    return repositorio.findById(id).orElse(null);
  }

  public @NonNull List<@NonNull Pedido> encontrarPedidosCliente() {
    var idCliente = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var usuario = usuarioRepositorio.findById(idCliente).orElseThrow();
    return repositorio.findByCliente(usuario);
  }

  public @NonNull List<@NonNull Pedido> encontrarPedidosTecnico() {
    var idCliente = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    var usuario = usuarioRepositorio.findById(idCliente).orElseThrow();
    return repositorio.findByTecnicoAndEstado(usuario, PedidoEstado.PENDENTE);
  }

  public @NonNull List<@NonNull Pedido> encontrarPedidos() {
    return repositorio.findAll();
  }
}
