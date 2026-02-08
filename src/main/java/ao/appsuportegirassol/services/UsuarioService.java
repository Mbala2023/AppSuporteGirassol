package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Usuario;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;
import java.util.Date;
import java.util.List;

import static java.util.Optional.ofNullable;

@BrowserCallable
@RequiredArgsConstructor
public class UsuarioService {
  private final UsuarioRepositorio usuarioRepositorio;
  private final PasswordEncoder passwordEncoder;
  private final JavaMailSender mensageiro;

  @RolesAllowed("ROLE_ADMIN")
  public @NonNull List<@NonNull Usuario> listarUsuarios() {
    var lista = usuarioRepositorio.findAll();

    System.out.println(lista);

    return lista;
  }

  @RolesAllowed("ROLE_ADMIN")
  public boolean criarUsuario(@NonNull Usuario usuario) {
    usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
    var novoUsuario = usuarioRepositorio.save(usuario);

    return novoUsuario.getId() != null;
  }

  @PermitAll
  public Usuario logado() {
    var username = ofNullable(SecurityContextHolder.getContext().getAuthentication())
        .map(Authentication::getPrincipal).map(User.class::cast)
        .map(User::getUsername)
        .orElse(null);

    if (username == null) {
      return null;
    }

    var usuario = usuarioRepositorio.findByUsername(username);

    if (usuario == null) {
      return null;
    }

    usuario.setSenha(null);
    return usuario;
  }

  @RolesAllowed("ROLE_ADMIN")
  public void promover(@NonNull String username) {
    var usuario = usuarioRepositorio.findByUsername(username);

    if (usuario == null) {
      return;
    }

    var logado = logado();

    if (logado.getUsername().equals(usuario.getUsername())) {
      return;
    }

    if (usuario.getPapel() != Papel.TECNICO) {
      return;
    }

    usuario.setPapel(Papel.ADMIN);

    usuarioRepositorio.save(usuario);
  }

  @RolesAllowed("ROLE_ADMIN")
  public void rebaixar(@NonNull String username) {
    var usuario = usuarioRepositorio.findByUsername(username);

    if (usuario == null) {
      return;
    }

    var logado = logado();

    if (logado.getUsername().equals(usuario.getUsername())) {
      return;
    }

    if (usuario.getPapel() != Papel.ADMIN) {
      return;
    }

    usuario.setPapel(Papel.TECNICO);

    usuarioRepositorio.save(usuario);
  }

  @AnonymousAllowed
  public void redefinirSenha(@NonNull String email) {
    var usuario = usuarioRepositorio.findByEmail(email).orElse(null);

    if (usuario == null) {
      return;
    }

    var novaSenha = criarNovaSenha();
    usuario.setSenha(passwordEncoder.encode(novaSenha));

    usuarioRepositorio.save(usuario);

    var email1 = new SimpleMailMessage();
    email1.setTo(usuario.getEmail());
    email1.setSubject("Redefinição de senha");
    email1.setSentDate(new Date());
    email1.setText("""
        Nova senha: %s
        """.formatted(novaSenha)
    );

    mensageiro.send(email1);
  }

  private String criarNovaSenha() {
    String pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    SecureRandom random = new SecureRandom();
    StringBuilder password = new StringBuilder();

    for (int i = 0; i < 16; i++) {
      int index = random.nextInt(pool.length());
      password.append(pool.charAt(index));
    }

    return password.toString();
  }

  @RolesAllowed("ROLE_USER")
  public void alterarSenha(@NonNull String senhaAtual, @NonNull String senhaNova) {
    var usuario = logado();
    var senha = usuario.getSenha();

    /*if (!passwordEncoder.matches(senhaAtual, senha)) {
      System.out.println("Senhas não batem");
      return;
    }*/

    var senhaNovaCodificada = passwordEncoder.encode(senhaNova);
    usuario.setSenha(senhaNovaCodificada);
    usuarioRepositorio.save(usuario);
  }
}
