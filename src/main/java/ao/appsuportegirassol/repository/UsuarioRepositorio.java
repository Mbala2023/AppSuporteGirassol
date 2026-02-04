package ao.appsuportegirassol.repository;

import ao.appsuportegirassol.models.Usuario;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {
  Usuario findByUsername(String username);

  boolean existsByUsername(String username);

  Optional<Usuario> findByEmail(@NonNull String email);
}
