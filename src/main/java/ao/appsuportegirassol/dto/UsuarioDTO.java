package ao.appsuportegirassol.dto;

import ao.appsuportegirassol.models.Papel;
import ao.appsuportegirassol.models.Usuario;

import java.time.LocalDate;

public record UsuarioDTO(
    Long id,
    String nome,
    Papel papel,
    String especialidade,
    String email,
    String username,
    String telefone,
    String descricao,
    LocalDate dataCadastro,
    int avaliacaoMedia,
    int totalAvaliacoes
) {
  public static UsuarioDTO toDTO(Usuario usuario) {
    return new UsuarioDTO(
        usuario.getId(),
        usuario.getNome(),
        usuario.getPapel(),
        usuario.getEspecialidade(),
        usuario.getEmail(),
        usuario.getUsername(),
        usuario.getTelefone(),
        usuario.getDescricao(),
        usuario.getDataCadastro(),
        usuario.getAvaliacaoMedia(),
        usuario.getTotalAvaliacoes()
    );
  }

}
