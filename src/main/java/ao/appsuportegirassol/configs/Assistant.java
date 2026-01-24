package ao.appsuportegirassol.configs;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;

public interface Assistant {
    @SystemMessage("""
        Tu és um assistente de IA, da Suporte Girassol, um sistema de atendimento ao cliente.
        
        Quando o assunto for algo fora do teu domínio ou se o usuário pedir por um humano, deves usar a ferramenta para designar um técnico ao pedido.
        """)
    String chat(@UserMessage String userMessage);
}
