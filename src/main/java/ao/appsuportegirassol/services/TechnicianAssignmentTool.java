package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.PedidoRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TechnicianAssignmentTool {

  private final UsuarioRepositorio usuarioRepositorio;
  private final PedidoRepositorio pedidoRepositorio;
  private final ChatRepositorio chatRepositorio;

  private record TecnicoDetalhado(Long id, String nome, String disponibilidade, String especialidade) {
  }

  @Tool("Lista de técnicos disponiveis")
  public String listaDeTecnicos() {
    return usuarioRepositorio.findAll().stream()
        .filter(u -> u.getPapel() == Papel.TECNICO)
        .map(u -> new TecnicoDetalhado(u.getId(), u.getNome(),
            pedidoRepositorio.findByTecnicoAndEstado(u, PedidoEstado.ACEITO).isEmpty() ? "Disponivel" : "Ocupado"
            , u.getEspecialidade()))
        .toList()
        .toString();
  }

  @Tool("Atribuir tecnico a um pedido. Nota: Sempre consultar a lista de tecnicos")
  public String atribuirTecnico(@P("Id do técnico") Long id) {
    Long orderId = ToolContextProvider.getOrderId();
    if (orderId == null) {
      return "Não foi possível identificar o pedido. Por favor, forneça o ID do pedido ou inicie um novo chat.";
    }

    var technician = usuarioRepositorio.findById(id);

    if (technician.isEmpty()) {
      return "Tecnico não encontrado";
    }

    if (technician.get().getPapel() != Papel.TECNICO) {
      return "Usuario não é um tecnico, não pode ter um pedido atribuido, por favor consulte a lista de tecnicos";
    }

    var pedidoOptional = pedidoRepositorio.findById(orderId.intValue());
    if (pedidoOptional.isEmpty()) {
      return "Pedido não encontrado.";
    }
    var pedido = pedidoOptional.get();

    var chatOptional = chatRepositorio.findByPedido(pedido);
    if (chatOptional.isEmpty()) {
      return "Chat não encontrado para este pedido.";
    }
    var chat = chatOptional.get();

    // Simple assignment logic: assign the first available technician

    pedido.setTecnico(technician.get());
    pedido.setEstado(PedidoEstado.ACEITO);
    pedido.setInicioAtendimento(LocalDateTime.now());
    pedidoRepositorio.save(pedido);

    chat.setTecnico(technician.get());
    chatRepositorio.save(chat);

    return String.format("O técnico %s foi designado para o seu pedido. Ele entrará em contato em breve.",
        technician.get().getNome());
  }

  @Tool("Fechar pedido")
  public String fecharPedido(@P("Id do pedido") Integer id) {
    var pedido = pedidoRepositorio.findById(id);
    if (pedido.isEmpty()) {
      return "Pedido não encontrado";
    }

    var pedidoDetalhes = pedido.get();

    var chat = chatRepositorio.findByPedido(pedidoDetalhes);
    if (chat.isEmpty()) {
      return "Chat do pedido não encontrado";
    }

    var chatDetalhes = chat.get();
    chatDetalhes.setActive(false);
    chatRepositorio.save(chatDetalhes);

    pedidoDetalhes.setEstado(PedidoEstado.CONCLUIDO);
    pedidoDetalhes.setConcluidoEm(LocalDateTime.now());
    pedidoRepositorio.save(pedidoDetalhes);

    return "Pedido %s foi fechado com sucesso!".formatted(pedidoDetalhes);
  }
}
