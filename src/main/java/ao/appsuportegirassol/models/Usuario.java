package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter @Setter
@NoArgsConstructor
@ToString
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
  private LocalDate dataCadastro;
  private int avaliacaoMedia;
  private int totalAvaliacoes;

  @PrePersist
  public void prePersist() {
    dataCadastro = LocalDate.now();
  }
}
