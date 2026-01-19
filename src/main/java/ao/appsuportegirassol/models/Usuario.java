package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@NoArgsConstructor
public class Usuario {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO, generator = "gn_usuario")
  private Long id;
  private String nome;
  private Papel papel;
  private String especialidade;
  private String email;
  private String username;
  private String telefone;
  private String senha;
  private String descricao;
  private int avaliacaoMedia;
  private int totalAvaliacoes;
}
