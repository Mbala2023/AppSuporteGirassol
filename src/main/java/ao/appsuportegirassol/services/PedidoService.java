package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.CriarPedido;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.PedidoRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.Comparator;
import java.util.List;

import static java.util.Optional.ofNullable;

@BrowserCallable
@RequiredArgsConstructor
public class PedidoService {
  private final PedidoRepositorio repositorio;
  private final UsuarioRepositorio usuarioRepositorio;
  private final ChatRepositorio chatRepositorio;
  private final UsuarioService usuarioService;

  public Pedido encontrarPedido(@NonNull Integer id) {
    return repositorio.findById(id).orElse(null);
  }

  @RolesAllowed("ROLE_ADMIN")
  public @NonNull List<@NonNull Pedido> todosPedidos() {
    return repositorio.findAll();
  }

  @RolesAllowed({"ROLE_CLIENTE", "ROLE_ADMIN"})
  public @NonNull List<@NonNull Pedido> encontrarPedidosCliente() {
    var username = ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getPrincipal).map(User.class::cast)
        .map(User::getUsername)
        .orElse(null);

    if (username == null) {
      return List.of();
    }

    var usuario = usuarioRepositorio.findByUsername(username);
    return repositorio.findByCliente(usuario);
  }

  @RolesAllowed({"ROLE_TECNICO", "ROLE_ADMIN"})
  public @NonNull List<@NonNull Pedido> encontrarPedidosTecnico() {
    var username = ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getPrincipal).map(User.class::cast)
        .map(User::getUsername)
        .orElse(null);

    if (username == null) {
      return List.of();
    }

    //var usuario = usuarioRepositorio.findByUsername(username);
    var pedidos = repositorio.findAll();

    pedidos.sort(Comparator.comparing(Pedido::getDataHora));

    return ofNullable(pedidos).orElse(List.of());
  }

  @RolesAllowed("ROLE_ADMIN")
  public @NonNull List<@NonNull Pedido> encontrarPedidos() {
    return repositorio.findAll();
  }

  @PermitAll
  public Long criarPedido(@NonNull CriarPedido pedido) {
    var usuario = usuarioRepositorio.findById(pedido.clienteId()).orElseThrow();
    var novoPedido = new Pedido();

    if (usuario.getPapel() != Papel.CLIENTE) {
      return null;
    }

    novoPedido.setEstado(PedidoEstado.PENDENTE);
    novoPedido.setDescricao(pedido.descricao());
    novoPedido.setTitulo(pedido.titulo());
    novoPedido.setEndereco(pedido.endereco());
    novoPedido.setCliente(usuario);

    var pedidoSalvo = repositorio.save(novoPedido);

    var chat = new Chat();

    chat.setPedido(pedidoSalvo);
    chat.setCliente(usuario);
    chat.setActive(true);
    chat.adicionarMensagem(pedido.mensagem());

    chatRepositorio.save(chat);

    return pedidoSalvo.getId();
  }

  @RolesAllowed("ROLE_CLIENTE")
  public void cancelarPedido(@NonNull Integer id) {
    var pedido = repositorio.findById(id).orElse(null);

    if (pedido == null) {
      return;
    }

    if (!pedido.podeCancelar()) {
      return;
    }

    var chat = chatRepositorio.findByPedido(pedido).orElse(null);

    if (chat == null) {
      return;
    }

    chat.setActive(false);
    pedido.setEstado(PedidoEstado.CANCELADO);
    repositorio.save(pedido);
  }

  @RolesAllowed("ROLE_CLIENTE")
  public void concluirPedido(@NonNull Integer id) {
    var pedido = repositorio.findById(id).orElse(null);

    if (pedido == null) {
      return;
    }

    if (!pedido.podeConcluir()) {
      return;
    }

    var chat = chatRepositorio.findByPedido(pedido).orElse(null);

    if (chat == null) {
      return;
    }

    chat.setActive(false);
    pedido.setEstado(PedidoEstado.CONCLUIDO);
    repositorio.save(pedido);
  }

  @RolesAllowed("ROLE_TECNICO")
  public void aceitarPedido(@NonNull Integer id) {
    var pedido = repositorio.findById(id).orElse(null);

    if(pedido == null) {
      return;
    }

    var tecnico = usuarioService.logado();

    if (tecnico.getPapel() != Papel.TECNICO) {
      return;
    }

    pedido.setTecnico(tecnico);
    repositorio.save(pedido);
  }
}
