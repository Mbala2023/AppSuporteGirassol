package ao.appsuportegirassol.configs;

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
  public Assistant assistant(ChatModel chatModel, TechnicianAssignmentTool technicianAssignmentTool) {
    return AiServices.builder(Assistant.class)
            .chatModel(chatModel)
            .chatMemory(MessageWindowChatMemory.withMaxMessages(10))
            .tools(technicianAssignmentTool)
            .build();
  }
}
