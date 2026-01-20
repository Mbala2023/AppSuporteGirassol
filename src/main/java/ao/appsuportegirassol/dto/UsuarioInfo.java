package ao.appsuportegirassol.dto;

import org.jspecify.annotations.NonNull;

import java.util.Collection;
import java.util.Collections;

public record UsuarioInfo(@NonNull Long id, @NonNull String nome, @NonNull String username,
                          @NonNull Collection<String> authorities) {
  public UsuarioInfo {
    authorities = Collections.unmodifiableCollection(authorities);
  }
}
