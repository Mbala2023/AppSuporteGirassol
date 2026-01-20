package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Usuario;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static java.util.Optional.ofNullable;

@BrowserCallable
@RequiredArgsConstructor
public class UsuarioService {
  private final UsuarioRepositorio usuarioRepositorio;

  @RolesAllowed("ROLE_ADMIN")
  public @NonNull List<@NonNull Usuario> listarUsuarios() {
    var lista = usuarioRepositorio.findAll();

    System.out.println(lista);

    return lista;
  }

  @RolesAllowed("ROLE_ADMIN")
  public boolean criarUsuario(@NonNull Usuario usuario) {
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
}
