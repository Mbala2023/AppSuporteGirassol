package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.UsuarioInfo;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.Objects;

@BrowserCallable
@RequiredArgsConstructor
public class UsuarioInfoService {
  private final UsuarioService usuarioService;

  @PermitAll
  @NonNull
  public UsuarioInfo usuarioLogado() {
    Authentication auth = SecurityContextHolder.getContext()
        .getAuthentication();

    var usuario = usuarioService.logado();

    final List<String> authorities = Objects.requireNonNull(auth).getAuthorities().stream()
        .map(GrantedAuthority::getAuthority).toList();

    return new UsuarioInfo(usuario.getId(), auth.getName(), usuario.getUsername(), authorities);
  }
}
