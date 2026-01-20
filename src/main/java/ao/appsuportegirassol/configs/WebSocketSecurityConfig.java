package ao.appsuportegirassol.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.access.intercept.MessageMatcherDelegatingAuthorizationManager;

@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfig {

  @Bean
  AuthorizationManager<Message<?>> messageAuthorizationManager(
      MessageMatcherDelegatingAuthorizationManager.Builder messages) {

    messages
        .simpTypeMatchers(SimpMessageType.CONNECT).permitAll()
        // Permite desconectar
        .simpTypeMatchers(SimpMessageType.DISCONNECT).permitAll()
        // Permite unsubscribe
        .simpTypeMatchers(SimpMessageType.UNSUBSCRIBE).permitAll()
        // Permite apenas usuários autenticados para destinos /app/**
        .simpDestMatchers("/app/**").authenticated()
        // Permite todos SUBSCRIBE ao tópico de notificações
        .simpSubscribeDestMatchers("/topic/chat/**", "/app/topic/chat/**").permitAll()
        // Bloqueia envio para destinos de broker direto
        .simpDestMatchers("/topic/**").denyAll();

    return messages.build();
  }
}
