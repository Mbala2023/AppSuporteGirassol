package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;

import java.time.LocalDateTime;

public record PedidoDTO(Long id, String titulo, PedidoEstado estado, LocalDateTime dataHora) {
  public static PedidoDTO converte(Pedido pedido) {
    return new PedidoDTO(
        pedido.getId(),
        pedido.getTitulo(),
        pedido.getEstado(),
        pedido.getDataHora()
    );
  }
}
