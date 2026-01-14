package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Chat {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // ID único da conversa

  private Long userId; // ID do usuário que iniciou o chat
  private boolean isActive; // Se o chat está ativo ou finalizado
  private Long operatorId; // ID do operador, se o chat foi transferido

  @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
  private List<Message> messages; // Relacionamento com as mensagens
}

