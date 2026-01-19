package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jspecify.annotations.NonNull;

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
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario usuario; // ID do operador, se o chat foi transferido
  @OneToOne(fetch = FetchType.LAZY)
  private Pedido pedido;

  @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
  private List<@NonNull Message> messages; // Relacionamento com as mensagens
}

