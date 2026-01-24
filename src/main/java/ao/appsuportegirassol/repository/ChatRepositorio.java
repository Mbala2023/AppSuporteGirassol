package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ao.appsuportegirassol.models.Pedido;

import java.util.Optional;

@Repository
public interface ChatRepositorio extends JpaRepository<Chat, Long> {
    Optional<Chat> findByPedido(Pedido pedido);
}
