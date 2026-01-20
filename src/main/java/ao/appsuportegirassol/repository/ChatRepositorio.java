package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepositorio extends JpaRepository<Chat, Long> {
}
