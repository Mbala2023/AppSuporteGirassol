package ao.appsuportegirassol.configs;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

  @Bean
  public ChatModel chatModel(@Value("${ai.token}") String token) {
    return GoogleAiGeminiChatModel.builder()
        .maxRetries(2)
        .apiKey(token)
        .maxOutputTokens(255)
        .modelName("gemini-2.5-flash")
        .build();
  }
}
