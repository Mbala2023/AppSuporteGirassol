package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.MessageDTO;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Message;
import ao.appsuportegirassol.repository.ChatRepository;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import lombok.RequiredArgsConstructor;

@BrowserCallable
@RequiredArgsConstructor
public class ChatService {
  private final ChatRepository chatRepository;
  private final UsuarioRepositorio usuarioRepositorio;

  public Chat getChat(Long chatId) {
    return chatRepository.findById(chatId).orElse(null);
  }

  private void addMessage(Long chatId, Message message) {
    var chat = getChat(chatId);
    message.setChat(chat);

    if (chat == null) {
      return;
    }

    chat.getMessages().add(message);
    chatRepository.save(chat);
  }

  public void addMessage(Long chatId, MessageDTO message) {
    var m = new Message();
    m.setUsuario(usuarioRepositorio.findById(message.idUsuario()).orElse(null));

    addMessage(chatId, m);
  }
}
