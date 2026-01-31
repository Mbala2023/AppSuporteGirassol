package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String titulo;
  private String descricao;
  private String nota;
  private String endereco;
  private LocalDateTime dataHora;
  private LocalDateTime inicioAtendimento;
  private LocalDateTime concluidoEm;
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario tecnico;
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario cliente;
  private PedidoEstado estado;

  @PrePersist
  public void prePersist() {
    dataHora = LocalDateTime.now();
  }

  public boolean podeCancelar() {
    return estado != PedidoEstado.AVALIADO && estado != PedidoEstado.CONCLUIDO;
  }

  public boolean podeConcluir() {
    return estado != PedidoEstado.AVALIADO && estado != PedidoEstado.CONCLUIDO;
  }
}
