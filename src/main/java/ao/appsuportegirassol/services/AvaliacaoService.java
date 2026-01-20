package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Avaliacao;
import ao.appsuportegirassol.repository.AvaliacaoRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;

import java.util.List;

@BrowserCallable
@RequiredArgsConstructor
public class AvaliacaoService {
  private final AvaliacaoRepositorio avaliacaoRepositorio;
  @PermitAll
  public @NonNull List<@NonNull Avaliacao> listarAvaliacoes() {
    return avaliacaoRepositorio.findAll();
  }
}
