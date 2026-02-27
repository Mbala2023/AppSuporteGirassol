package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Pedido;
import ao.appsuportegirassol.models.PedidoEstado;
import ao.appsuportegirassol.models.Usuario;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {
  List<Pedido> findByEstado(PedidoEstado estado);
  List<Pedido> findByTecnicoAndEstado(Usuario tecnico, PedidoEstado estado);
  List<Pedido> findByCliente(Usuario cliente);

  @Query("select p from Pedido p where p.dataHora <= :dataHora and p.dataHora >= :dataHora1 order by p.dataHora")
  List<Pedido> gerarRelatorio(
      @Param("dataHora") @NonNull LocalDateTime dataHora,
      @Param("dataHora1") @NonNull LocalDateTime dataHora1);
}
