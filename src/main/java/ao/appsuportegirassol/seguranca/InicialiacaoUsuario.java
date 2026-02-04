package ao.appsuportegirassol.seguranca;

import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Usuario;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InicialiacaoUsuario implements CommandLineRunner {
  private final UsuarioRepositorio usuarioRepositorio;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String @NonNull ... args) throws Exception {
    if (!usuarioRepositorio.existsByUsername("admin")) {
      var usuario = new Usuario();

      usuario.setUsername("admin");
      usuario.setSenha(passwordEncoder.encode("admin"));
      usuario.setNome("admin");
      usuario.setEmail("admin@appgirassol.com");
      usuario.setTelefone("555555555");
      usuario.setDescricao("admin");
      usuario.setPapel(Papel.ADMIN);
      usuarioRepositorio.save(usuario);
    }
  }
}
