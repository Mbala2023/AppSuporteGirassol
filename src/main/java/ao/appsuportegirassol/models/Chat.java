package ao.appsuportegirassol.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jspecify.annotations.NonNull;

import java.util.ArrayList;
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

  private boolean isActive; // Se o chat está ativo ou finalizado
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario tecnico; // ID do operador, se o chat foi transferido
  @ManyToOne(fetch = FetchType.LAZY)
  private Usuario cliente;
  @OneToOne(fetch = FetchType.LAZY)
  private Pedido pedido;

  @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
  private List<@NonNull Mensagem> mensagens = new ArrayList<>(); // Relacionamento com as mensagens

  public void adicionarMensagem(String mensagem) {
    if (mensagem == null) {
      return;
    }

    var mensagemInicial = new Mensagem();
    mensagemInicial.setChat(this);
    mensagemInicial.setUsuario(cliente);
    mensagemInicial.setConteudo(mensagem);
    mensagemInicial.setSender("user");

    mensagens.add(mensagemInicial);
  }
}

