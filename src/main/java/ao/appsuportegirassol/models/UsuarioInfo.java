package ao.appsuportegirassol.models;

import org.jspecify.annotations.NonNull;

import java.util.Collection;
import java.util.Collections;

public record UsuarioInfo(@NonNull String nome, @NonNull String username, @NonNull Collection<String> authorities) {
  public UsuarioInfo {
    authorities = Collections.unmodifiableCollection(authorities);
    System.out.println(this);
  }
}
