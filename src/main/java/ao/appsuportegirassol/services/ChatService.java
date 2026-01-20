package ao.appsuportegirassol.services;

import ao.appsuportegirassol.dto.ChatDTO;
import ao.appsuportegirassol.dto.MensagemDTO;
import ao.appsuportegirassol.models.Chat;
import ao.appsuportegirassol.models.Mensagem;
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
  public ChatDTO getChat(Long chatId) {
    return chatRepositorio.findById(chatId).map(ChatDTO::converter).orElse(null);
  }

  private void addMessage(Long chatId, Mensagem mensagem) {
    var chat = chatRepositorio.findById(chatId).orElse(null);
    mensagem.setChat(chat);

    if (chat == null) {
      return;
    }

    chat.getMensagens().add(mensagem);
    chatRepositorio.save(chat);
  }

  @RolesAllowed("ROLE_USER")
  public void addMessage(Long chatId, MensagemDTO message) {
    var m = new Mensagem();
    m.setUsuario(usuarioRepositorio.findById(message.idUsuario()).orElse(null));

    addMessage(chatId, m);
  }
}
