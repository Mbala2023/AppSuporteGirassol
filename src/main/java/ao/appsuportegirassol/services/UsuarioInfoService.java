package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.UsuarioInfo;
import com.vaadin.collaborationengine.UserInfo;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;

import java.util.List;
import java.util.Objects;

@AnonymousAllowed
@BrowserCallable
public class UsuarioInfoService {

  @PermitAll
  @NonNull
  public UsuarioInfo usuarioLogado() {
    Authentication auth = SecurityContextHolder.getContext()
        .getAuthentication();

    final List<String> authorities = Objects.requireNonNull(auth).getAuthorities().stream()
        .map(GrantedAuthority::getAuthority).toList();

    return new UsuarioInfo(auth.getName(),  Objects.requireNonNull((User) auth.getPrincipal()).getUsername(), authorities);
  }
}
