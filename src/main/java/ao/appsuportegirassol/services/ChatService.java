package ao.appsuportegirassol.services;

import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Message;
import ao.appsuportegirassol.repository.ChatRepository;
import com.vaadin.hilla.BrowserCallable;
import lombok.RequiredArgsConstructor;

@BrowserCallable
@RequiredArgsConstructor
public class ChatService {
  private final ChatRepository chatRepository;

  public Chat getChat(Long chatId) {
    return chatRepository.findById(chatId).orElse(null);
  }

  public void addMessage(Long chatId, Message message) {
    var chat = getChat(chatId);

    if (chat == null) {
      return;
    }

    chat.getMessages().add(message);
    chatRepository.save(chat);
  }
}
