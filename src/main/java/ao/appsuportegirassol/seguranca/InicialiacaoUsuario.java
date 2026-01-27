package ao.appsuportegirassol.seguranca;

import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Usuario;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class InicialiacaoUsuario implements CommandLineRunner {
  private final UsuarioRepositorio usuarioRepositorio;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) throws Exception {
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
    
    if (!usuarioRepositorio.existsByUsername("mbala")) {
      var usuario = new Usuario();
      usuario.setUsername("mbala");
      usuario.setSenha(passwordEncoder.encode("mbala"));
      usuario.setNome("mbala");
      usuario.setEmail("mbala@appgirassol.com");
      usuario.setTelefone("555555555");
      usuario.setEspecialidade("Sysadm Linux e Windows");
      usuario.setDescricao("mbala");
      usuario.setPapel(Papel.TECNICO);
      usuarioRepositorio.save(usuario);
    }

    if (!usuarioRepositorio.existsByUsername("adao")) {
      var usuario = new Usuario();
      usuario.setUsername("adao");
      usuario.setSenha(passwordEncoder.encode("adao"));
      usuario.setNome("adao");
      usuario.setEmail("adao@appgirassol.com");
      usuario.setTelefone("555555555");
      usuario.setEspecialidade("Microsoft office, Instalação de software");
      usuario.setDescricao("adao");
      usuario.setPapel(Papel.TECNICO);
      usuarioRepositorio.save(usuario);
    }

    if (!usuarioRepositorio.existsByUsername("usuario")) {
      var usuario = new Usuario();
      usuario.setUsername("usuario");
      usuario.setSenha(passwordEncoder.encode("usuario"));
      usuario.setNome("usuario");
      usuario.setEmail("usuario@appgirassol.com");
      usuario.setTelefone("555555555");
      usuario.setDescricao("usuario");
      usuario.setPapel(Papel.CLIENTE);
      usuarioRepositorio.save(usuario);
    }

  }
}
