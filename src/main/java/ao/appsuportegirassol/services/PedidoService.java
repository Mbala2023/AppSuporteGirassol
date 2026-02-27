package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.CriarPedido;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.PedidoRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.StringJoiner;

import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ofPattern;
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

    if (pedido == null) {
      return;
    }

    var tecnico = usuarioService.logado();

    if (tecnico.papel() != Papel.TECNICO) {
      return;
    }

    pedido.setTecnico(usuarioRepositorio.findByUsername(tecnico.username()));
    repositorio.save(pedido);
  }

  @RolesAllowed("ROLE_ADMIN")
  public byte[] gerarRelatorio(@NonNull LocalDate inicio, LocalDate fim) {
    var tempoInicial = inicio.atStartOfDay();
    var tempoFinal = ofNullable(fim).map(LocalDate::atStartOfDay).orElse(now());
    return gerarPDF(
        relatorioPDF(repositorio.gerarRelatorio(tempoInicial, tempoFinal)
        )
    );
  }

  private String relatorioPDF(@NonNull List<@NonNull Pedido> pedidos) {
    StringJoiner joiner = new StringJoiner("\n");
    for (Pedido pedido : pedidos) {
      String formatted = ("<tr>\n" +
                          "            <td>#%i</td>\n" +
                          "            <td>%s</td>\n" +
                          "            <td >%s</td>\n" +
                          "            <td >%s</td>\n" +
                          "            <td >%s</td>\n" +
                          "            <td >%s</td>\n" +
                          "        </tr>\n").formatted(
          pedido.getId(),
          pedido.getDataHora().toString(),
          pedido.getCliente().getNome(),
          pedido.getTitulo(),
          pedido.getEstado().toString()
      );
      joiner.add(formatted);
    }
    return "    <!DOCTYPE html>\n" +
        "    <html>\n" +
        "    <head>\n" +
        "        <style>\n" +
        "            @page {\n" +
        "                size: A4;\n" +
        "                margin: 20mm;\n" +
        "            }\n" +
        "            body {\n" +
        "                font-family: 'Arial', sans-serif;\n" +
        "                color: #333;\n" +
        "                line-height: 1.6;\n" +
        "            }\n" +
        "            .header {\n" +
        "                text-align: center;\n" +
        "                border-bottom: 2px solid #0056b3;\n" +
        "                margin-bottom: 20px;\n" +
        "                padding-bottom: 10px;\n" +
        "            }\n" +
        "            h1 { color: #0056b3; margin: 0; }\n" +
        "            .info { margin-bottom: 20px; font-size: 12px; }\n" +
        "\n" +
        "            table {\n" +
        "                border-collapse: collapse;\n" +
        "                margin-top: 10px;\n" +
        "                width: 100%\n" +
        "            }\n" +
        "            th {\n" +
        "                background-color: #0056b3;\n" +
        "                color: white;\n" +
        "                text-align: left;\n" +
        "                padding: 12px;\n" +
        "                font-size: 14px;\n" +
        "            }\n" +
        "            td {\n" +
        "                padding: 10px;\n" +
        "                border-bottom: 1px solid #ddd;\n" +
        "                font-size: 13px;\n" +
        "            }\n" +
        "            tr:nth-child(even) { background-color: #f9f9f9; }\n" +
        "            .total-row {\n" +
        "                font-weight: bold;\n" +
        "                background-color: #eee !important;\n" +
        "            }\n" +
        "            .footer {\n" +
        "                position: fixed;\n" +
        "                bottom: 0;\n" +
        "                text-align: center;\n" +
        "                font-size: 10px;\n" +
        "                color: #777;\n" +
        "                width: 100%\n" +
        "            }\n" +
        "        </style>\n" +
        "    </head>\n" +
        "    <body>\n" +
        "        <div class=\"header\">\n" +
        "            <h1>Relatório de Pedidos</h1>\n" +
        "        </div>\n" +
        "\n" +
        "        <div class=\"info\">\n" +
        "            <p><strong>Data de Emissão:</strong> " +
        LocalDate.now().format(ofPattern("dd 'de' MMMM 'de' yyyy", new Locale("pt", "PT"))) +
        "</p>\n" +
        "            <p><strong>Gerado por:</strong> AppSuporteGirassol</p>\n" +
        "        </div>\n" +
        "\n" +
        "        <table>\n" +
        "            <thead>\n" +
        "                <tr>\n" +
        "                    <th>ID</th>\n" +
        "                    <th>DATA</th>\n" +
        "                    <th>CLIENTE</th>\n" +
        "                    <th>TITULO</th>\n" +
        "                    <th>ESTADO</th>\n" +
        "                </tr>\n" +
        "            </thead>\n" +
        "            <tbody>\n"
        + joiner +
        "            </tbody>\n" +
        "        </table>\n" +
        "    </body>\n" +
        "    </html>\n";
  }

  private byte[] gerarPDF(String htmlContent) {
    try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      PdfRendererBuilder builder = new PdfRendererBuilder();
      builder.useFastMode();
      builder.withHtmlContent(htmlContent, null);
      builder.toStream(os);
      builder.run();
      return os.toByteArray();
    } catch (Exception e) {
      throw new RuntimeException("Erro ao gerar PDF", e);
    }
  }
}
