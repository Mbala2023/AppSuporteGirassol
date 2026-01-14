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

  @ManyToOne
  @JoinColumn(name = "chat_id")
  private Chat chat;

  private String sender; // Pode ser "user", "bot" ou "operator"
  private String content;
  private String timestamp; // Data e hora da mensagem
}
