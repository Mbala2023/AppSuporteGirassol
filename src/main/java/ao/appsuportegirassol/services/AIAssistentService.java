package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Mensagem;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AIAssistentService {
  private final ChatModel chatModel;

  public AIAssistentService(ChatModel chatModel) {
    this.chatModel = chatModel;
  }


  public MensagemDTO respondUser(Mensagem mensagem) {
    
    var res = chatModel.chat(
        SystemMessage.from("""
          Tu és um assistente de IA, da Suporte Girassol, um sistema de atendimento ao cliente.
          
          Quando o assunto for algo fora do teu domínio deves passar a conversa para um humano(operador).
          """),
        UserMessage.from(mensagem.getConteudo())
    );

    return new MensagemDTO(
        null,
        "bot",
        mensagem.getChat().getPedido().getId(),
        null,
        res.aiMessage().text(),
        LocalDateTime.now()
    );
  }

}
