package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {
  List<Pedido> findByEstado(PedidoEstado estado);
  List<Pedido> findByTecnicoAndEstado(Usuario tecnico, PedidoEstado estado);
  List<Pedido> findByCliente(Usuario cliente);
}
