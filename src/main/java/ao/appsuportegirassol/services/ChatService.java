package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.MessageDTO;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Message;
import ao.appsuportegirassol.repository.ChatRepositorio;
import ao.appsuportegirassol.repository.UsuarioRepositorio;
import com.vaadin.hilla.BrowserCallable;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;

@BrowserCallable
@RequiredArgsConstructor
public class ChatService {
  private final ChatRepositorio chatRepositorio;
  private final UsuarioRepositorio usuarioRepositorio;

  @RolesAllowed("ROLE_USER")
  public Chat getChat(Long chatId) {
    return chatRepositorio.findById(chatId).orElse(null);
  }

  private void addMessage(Long chatId, Message message) {
    var chat = getChat(chatId);
    message.setChat(chat);

    if (chat == null) {
      return;
    }

    chat.getMessages().add(message);
    chatRepositorio.save(chat);
  }

  @RolesAllowed("ROLE_USER")
  public void addMessage(Long chatId, MessageDTO message) {
    var m = new Message();
    m.setUsuario(usuarioRepositorio.findById(message.idUsuario()).orElse(null));

    addMessage(chatId, m);
  }
}
