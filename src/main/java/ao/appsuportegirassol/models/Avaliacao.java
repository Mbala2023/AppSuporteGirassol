package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "avaliacoes")
@Getter
@Setter
@NoArgsConstructor
public class Avaliacao {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "gn_avaliacoes")
  private Long id;
  private short estrelas;
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario tecnico;
  private LocalDate dataHora;
}
