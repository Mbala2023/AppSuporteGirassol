package ao.appsuportegirassol.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mensagens")
public class Mensagem {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY, generator = "gn_msg")
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "chat_id")
  private Chat chat;

  @ManyToOne(fetch = FetchType.EAGER)
  private Usuario usuario;

  @Lob
  private String conteudo;
  private LocalDateTime dataEnvio;

  @PrePersist
  public void prePersist() {
    dataEnvio = LocalDateTime.now();
  }
}
