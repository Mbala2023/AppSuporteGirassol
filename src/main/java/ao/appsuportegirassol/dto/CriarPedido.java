package ao.appsuportegirassol.dto;

import org.jspecify.annotations.NonNull;

public record CriarPedido(
    @NonNull String titulo,
    @NonNull String endereco,
    String descricao,
    @NonNull Long clienteId) {
}
