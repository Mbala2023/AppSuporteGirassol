package ao.appsuportegirassol.configs;

import ao.appsuportegirassol.ia.Assistente;
import ao.appsuportegirassol.ia.MemoriaPersistente;
import ao.appsuportegirassol.services.TechnicianAssignmentTool;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {
  private String apiKey = "token";

  @Bean
  public ChatModel chatModel() {
    return OpenAiChatModel.builder()
        .apiKey(apiKey)
        .modelName("gpt-4o-mini")
        .build();
  }

  @Bean
  public Assistente assistant(ChatModel chatModel,
                              TechnicianAssignmentTool technicianAssignmentTool,
                              MemoriaPersistente memoriaPersistente) {
    return AiServices.builder(Assistente.class)
        .chatModel(chatModel)
        .chatMemoryProvider(memoryId ->
            MessageWindowChatMemory.withMaxMessages(20))
        .tools(technicianAssignmentTool)
        .build();
  }
}
