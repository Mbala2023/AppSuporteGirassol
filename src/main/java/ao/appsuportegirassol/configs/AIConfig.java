package ao.appsuportegirassol.configs;

import ao.appsuportegirassol.ia.Assistente;
import ao.appsuportegirassol.ia.MemoriaPersistente;
import ao.appsuportegirassol.services.TechnicianAssignmentTool;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.service.AiServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AIConfig {

  @Bean
  public ChatModel chatModel() {
    return OllamaChatModel.builder()
        .baseUrl("http://localhost:11434")
        .temperature(0.0)
        .logRequests(true)
        .logResponses(true)
        .modelName("llama3.2")
        .build();
  }

  @Bean
  public Assistente assistant(ChatModel chatModel,
                              TechnicianAssignmentTool technicianAssignmentTool,
                              MemoriaPersistente memoriaPersistente) {
    return AiServices.builder(Assistente.class)
        .chatModel(chatModel)
        .chatMemoryProvider(memoryId ->
            MessageWindowChatMemory.builder()
                .id(memoryId)
                .chatMemoryStore(memoriaPersistente)
                .maxMessages(20)
                .build())
        .tools(technicianAssignmentTool)
        .build();
  }
}
