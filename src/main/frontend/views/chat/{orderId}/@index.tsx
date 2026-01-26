import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AttendanceTimer } from "@/components/attendance-timer";
import * as ChatService from "@/generated/ChatService";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useAuth } from "Frontend/auth";
import PedidoEstado from "Frontend/generated/ao/appsuportegirassol/models/PedidoEstado";
import MensagemDTO from "Frontend/generated/ao/appsuportegirassol/dto/MensagemDTO";
import PedidoDTO from "Frontend/generated/ao/appsuportegirassol/dto/PedidoDTO";
import ChatDTO from "Frontend/generated/ao/appsuportegirassol/dto/ChatDTO";
import { useSignal } from "@vaadin/hilla-react-signals";
import { ActionOnLostSubscription } from "@vaadin/hilla-frontend";

export const config: ViewConfig = {
  loginRequired: true,
  rolesAllowed: ["ROLE_USER"],
};

export default function ChatPage() {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<PedidoDTO>();
  const {
    state: { user },
  } = useAuth();

  const messages = useSignal<MensagemDTO[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    try {
      await ChatService.enviarMensagem(Number(orderId), {
        conteudo: newMessage,
        chatId: Number(orderId),
        pedidoId: Number(orderId),
        username: user?.username ?? "",
        nomeDoUsuario: user?.nome ?? "",
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchChatMessages = () => {
    ChatService.getChat(Number(orderId))
      .then((chat: ChatDTO | undefined) => {
        if (!chat) {
          navigate("/pedidos");
          return;
        }

        setOrder(chat.pedidoDTO);
        messages.value = chat.mensagens ?? [];
      })
      .catch((error) => {
        console.error("Error fetching chat:", error);
      });
  };

useEffect(() => {
  // Busca mensagens existentes antes de abrir o streaming
  fetchChatMessages();

  // Subscribe à stream reativa
  const subscription = ChatService.observeChat(Number(orderId))
    .onNext((mensagem) => {
      // Aqui a mensagem já está no formato enviado pelo backend
      // Atualize o estado adicionando ao array
      messages.value = [...messages.value, mensagem];
    })
    .onError((err) => {
      console.error("Erro no chat SSE:", err);
    })
    .onSubscriptionLost(() => {
      // Tenta resubscrever quando a conexão SSE cair
      fetchChatMessages();
      return ActionOnLostSubscription.RESUBSCRIBE;
    });

  return () => {
    // Cancela a assinatura quando o componente desmontar
    subscription.cancel();
  };
}, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.value]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="mb-4 sm:mb-6">
          <Link to="/pedidos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Voltar para Pedidos</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </Link>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-base sm:text-lg">
                  {order?.titulo}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Pedido #{order?.id}
                </CardDescription>
              </div>
              <Badge className="self-start">{order?.estado}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                <AvatarFallback className="text-xs sm:text-sm">
                  {getInitials(user?.nome ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm sm:text-base">{user?.nome}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {user?.authorities.includes("ROLE_TECNICO")
                    ? "Técnico"
                    : "Cliente"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {(order?.estado === PedidoEstado.EM_ANDAMENTO ||
          order?.estado === PedidoEstado.ACEITO) && (
          <div className="mb-4">
            <AttendanceTimer
              startTime={new Date(order?.dataHora ?? "")}
              status={order?.estado}
            />
          </div>
        )}

        <Card className="flex flex-col h-[calc(100vh-320px)] sm:h-[600px]">
          <CardHeader className="py-3 sm:py-6">
            <CardTitle className="text-base sm:text-lg">Conversa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-3 sm:p-6">
            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4">
              {messages.value.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs sm:text-sm py-8">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              ) : (
                messages.value.map((mensagem) => {
                  const isCurrentUser = mensagem.username === user?.username;

                  return (
                    <div
                      key={mensagem.id}
                      className={`flex gap-2 sm:gap-3 ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {mensagem.nomeDoUsuario
                            ? getInitials(mensagem.nomeDoUsuario)
                            : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[70%] ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 sm:px-4 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-xs sm:text-sm break-words">
                            {mensagem.conteudo}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(mensagem?.dataEnvio ?? ""),
                            "HH:mm",
                            {
                              locale: ptBR,
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newMessage.trim()}
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
