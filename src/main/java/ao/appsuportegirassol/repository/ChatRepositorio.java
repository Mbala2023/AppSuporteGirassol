package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRepositorio extends JpaRepository<Chat, Long> {
  Optional<Chat> findByPedido(Pedido pedido);
}
