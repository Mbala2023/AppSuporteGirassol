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

  private record TecnicoDetalhado(Long id, String nome, String especialidade) {
  }

  @Tool("Lista de técnicos")
  public String listaDeTecnicos() {
    return usuarioRepositorio.findAll().stream()
        .filter(u -> u.getPapel() == Papel.TECNICO)
        .map(u -> new TecnicoDetalhado(u.getId(), u.getNome(), u.getEspecialidade()))
        .toList()
        .toString();
  }

  @Tool("assign a technician to the order when the user asks for a human or the query is too complex")
  public String assignTechnicianToOrder(@P("Id do técnico") Long id) {
    Long orderId = ToolContextProvider.getOrderId();
    if (orderId == null) {
      return "Não foi possível identificar o pedido. Por favor, forneça o ID do pedido ou inicie um novo chat.";
    }

    var technician = usuarioRepositorio.findById(id);

    if (technician.isEmpty()) {
      return "Nenhum técnico disponível no momento. Por favor, tente novamente mais tarde.";
    }

    if (technician.get().getPapel() != Papel.TECNICO) {
      return "Nenhum técnico disponível no momento. Por favor, tente novamente mais tarde.";
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
}
