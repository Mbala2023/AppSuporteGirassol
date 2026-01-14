package ao.appsuportegirassol.dto;

public record MessageDTO(String sender, // Pode ser "user", "bot" ou "operator"
                         String content,
                         String timestamp // Data e hora da mensagem
) {
}
