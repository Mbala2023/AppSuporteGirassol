package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Message;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AIAssistentService {
  private final ChatModel chatModel;

  public AIAssistentService(ChatModel chatModel) {
    this.chatModel = chatModel;
  }


  public Message respondUser(Message message) {
    
    var res = chatModel.chat(
        SystemMessage.from("""
          Tu és um assistente de IA, da Suporte Girassol, um sistema de atendimento ao cliente.
          
          Quando o assunto for algo fora do teu domínio deves passar a conversa para um humano(operador).
          """),
        UserMessage.from(message.getContent())
    );

    var out = new Message();

    out.setChat(message.getChat());
    out.setSender("bot");
    out.setContent(res.aiMessage().text());
    out.setTimestamp(new Date().toString());

    return out;
  }

}
