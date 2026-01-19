package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "chat_id")
  private Chat chat;
  private String sender; // Pode ser "user", "bot"
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario usuario;
  private String conteudo;
  private String timestamp; // Data e hora da mensagem
}
