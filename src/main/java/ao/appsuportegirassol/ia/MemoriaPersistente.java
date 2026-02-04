package ao.appsuportegirassol.ia;

import ao.appsuportegirassol.models.Mensagem;
import ao.appsuportegirassol.repository.ChatRepositorio;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MemoriaPersistente implements ChatMemoryStore {
  private final ChatRepositorio repositorio;

  @Override
  public List<ChatMessage> getMessages(Object o) {
    var chatId = (Long) o;
    var chat = repositorio.findById(chatId).orElse(null);

    if (chat == null) {
      return List.of();
    }

    var stream = chat.getMensagens().stream();

    var length = chat.getMensagens().size();

    var skip = length > 10 ? length - 10 : 0;

    return stream.skip(skip).map(Mensagem::getConteudo)
        .map(UserMessage::userMessage)
        .map(ChatMessage.class::cast)
        .toList();
  }

  @Override
  public void updateMessages(Object o, List<ChatMessage> list) {

  }

  @Override
  public void deleteMessages(Object o) {

  }
}
