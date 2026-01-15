"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/navbar";
import { OrderCard } from "@/components/order-card";
import { CancelOrderDialog } from "@/components/cancel-order-dialog";
import { RatingDialog } from "@/components/rating-dialog";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockOrders: Order[] = [
  { id: "1", titulo: "Instalação de Software", status: "pendente", tecnicoId: 2, clienteId: 3 },
  { id: "2", titulo: "Troca de Peça", status: "em_andamento", tecnicoId: 2, clienteId: 4 },
  { id: "3", titulo: "Manutenção Preventiva", status: "concluido", tecnicoId: 5, clienteId: 6 },
  { id: "4", titulo: "Configuração de Rede", status: "avaliado", tecnicoId: 5, clienteId: 3 },
  { id: "5", titulo: "Atualização de Sistema", status: "cancelado", tecnicoId: 2, clienteId: 4 },
]

// Mock users for demo
const mockUsers = [
  { id: 1, nome: "Admin User", role: "admin", especialidade: "Gestão" },
  { id: 2, nome: "Técnico João", role: "tecnico", especialidade: "Hardware" },
  { id: 3, nome: "Cliente Maria", role: "cliente" },
  { id: 4, nome: "Cliente José", role: "cliente" },
  { id: 5, nome: "Técnico Ana", role: "tecnico", especialidade: "Software" },
  { id: 6, nome: "Cliente Carla", role: "cliente" },
]

function getUserById(id: number | string) {
  return mockUsers.find((u) => u.id === Number(id)) || null;
}

type OrderStatus =
  | "pendente"
  | "aceito"
  | "em_andamento"
  | "concluido"
  | "avaliado"
  | "cancelado";

interface Order {
  id: string;
  titulo: string;
  status: OrderStatus;
  tecnicoId?: number;
  clienteId: number;
}

interface ChatMessage {
  id: string;
  orderId: string;
  senderId: number;
  senderRole: string;
  mensagem: string;
  createdAt: Date;
  lida: boolean;
}

export default function PedidosPage() {
  const { user, isAuthenticated, isClient, isTechnician } = useAuth();
  const router = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router("/");
      return;
    }

    // Filtrar pedidos baseado no tipo de usuário
    if (isClient) {
      setOrders(mockOrders.filter((o) => o.clienteId === user?.id));
    } else if (isTechnician) {
      // Técnicos veem seus pedidos e pedidos pendentes
      setOrders(
        mockOrders.filter(
          (o) => o.tecnicoId === user?.id || o.status === "pendente"
        )
      );
    }
  }, [isAuthenticated, user, isClient, isTechnician, router]);

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = (motivo: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderId
          ? {
              ...order,
              status: "cancelado" as OrderStatus,
              motivoCancelamento: motivo,
              canceladoEm: new Date(),
              updatedAt: new Date(),
            }
          : order
      )
    );

    toast("Pedido cancelado", {
      description: "O pedido foi cancelado com sucesso.",
    });
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "concluido" as OrderStatus,
              concluidoEm: new Date(),
              updatedAt: new Date(),
            }
          : order
      )
    );

    toast("Atendimento concluído", {
      description: "O cliente poderá avaliar o atendimento agora.",
    });
  };

  const handleAcceptOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "em_andamento" as OrderStatus,
              tecnicoId: user?.id,
              updatedAt: new Date(),
            }
          : order
      )
    );

    if (user && order) {
      const welcomeMessage: ChatMessage = {
        id: `MSG${Date.now()}`,
        orderId: orderId,
        senderId: user.id,
        senderRole: user.role,
        mensagem: `Olá! Sou ${user.nome}, ${
          user.especialidade || "técnico"
        }. Aceitei seu pedido e estou pronto para atendê-lo. ${
          user.telefone
            ? `Você pode me contatar pelo telefone ${user.telefone}.`
            : ""
        } Vamos resolver seu problema!`,
        createdAt: new Date(),
        lida: false,
      };

      // Add to global chat store (accessing the same store from chat page)
      if (typeof window !== "undefined") {
        const chatStore = (window as any).chatMessagesStore || [];
        chatStore.push(welcomeMessage);
        (window as any).chatMessagesStore = chatStore;
      }
    }

    toast("Pedido aceito", {
      description:
        "Você aceitou este pedido. Uma mensagem automática foi enviada ao cliente.",
    });
  };

  const handleRateOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderToRate(order);
      setRatingDialogOpen(true);
    }
  };

  const handleSubmitRating = (rating: number, comentario: string) => {
    if (!orderToRate || !user) return;

    // Atualizar status do pedido para avaliado
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderToRate.id
          ? {
              ...order,
              status: "avaliado" as OrderStatus,
              updatedAt: new Date(),
            }
          : order
      )
    );

    toast("Avaliação enviada!", {
      description: "Obrigado pelo seu feedback.",
    });

    setOrderToRate(null);
  };

  const filterOrdersByStatus = (statuses: OrderStatus[]) => {
    return orders.filter((order) => statuses.includes(order.status));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {isClient ? "Meus Pedidos" : "Atendimentos"}
        </h1>

        <Tabs defaultValue="ativos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ativos">Ativos</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
            <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
            {isTechnician && (
              <TabsTrigger value="disponiveis">Disponíveis</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="ativos" className="space-y-4">
            {filterOrdersByStatus(["pendente", "aceito", "em_andamento"])
              .length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido ativo no momento.
              </p>
            ) : (
              filterOrdersByStatus(["pendente", "aceito", "em_andamento"]).map(
                (order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onCancel={handleCancelOrder}
                    onComplete={handleCompleteOrder}
                  />
                )
              )
            )}
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-4">
            {filterOrdersByStatus(["concluido", "avaliado"]).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido concluído.
              </p>
            ) : (
              filterOrdersByStatus(["concluido", "avaliado"]).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onRate={handleRateOrder}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelados" className="space-y-4">
            {filterOrdersByStatus(["cancelado"]).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido cancelado.
              </p>
            ) : (
              filterOrdersByStatus(["cancelado"]).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          {isTechnician && (
            <TabsContent value="disponiveis" className="space-y-4">
              {orders.filter((o) => o.status === "pendente" && !o.tecnicoId)
                .length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido disponível no momento.
                </p>
              ) : (
                orders
                  .filter((o) => o.status === "pendente" && !o.tecnicoId)
                  .map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onAccept={handleAcceptOrder}
                    />
                  ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>

      <CancelOrderDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={confirmCancelOrder}
        orderId={selectedOrderId || ""}
      />

      {orderToRate && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          onSubmit={handleSubmitRating}
          technicianName={
            getUserById(orderToRate.tecnicoId || "")?.nome || "Técnico"
          }
        />
      )}
    </div>
  );
}
