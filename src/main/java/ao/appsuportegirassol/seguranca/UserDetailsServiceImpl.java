package ao.appsuportegirassol.seguranca;

import ao.appsuportegirassol.repository.UsuarioRepositorio;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
  private final UsuarioRepositorio usuarioRepositorio;

  @Override
  public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
    var usuario = usuarioRepositorio.findByUsername(username);

    if (usuario == null) {
      throw new UsernameNotFoundException(username);
    }

    return new User(
        usuario.getUsername(),
        usuario.getSenha(),
        List.of(
            new SimpleGrantedAuthority("ROLE_" + usuario.getPapel().name()),
            new SimpleGrantedAuthority("ROLE_USER")
        )
    );
  }
}
