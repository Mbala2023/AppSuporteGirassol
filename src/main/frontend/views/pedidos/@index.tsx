"use client";

import { useState, useEffect } from "react";

import { Navbar } from "@/components/navbar";
import { OrderCard } from "@/components/order-card";
import { CancelOrderDialog } from "@/components/cancel-order-dialog";
import { Button } from "@/components/ui/button";
import { AddOrderDialog } from "@/components/add-order-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Pedido from "@/generated/ao/appsuportegirassol/models/Pedido";
import Usuario from "@/generated/ao/appsuportegirassol/models/Usuario";
import * as PedidoService from "@/generated/PedidoService";
import PedidoEstado from "Frontend/generated/ao/appsuportegirassol/models/PedidoEstado";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import Papel from "Frontend/generated/ao/appsuportegirassol/models/Papel";
import Message from "Frontend/generated/ao/appsuportegirassol/models/Message";
import MessageDTO from "Frontend/generated/ao/appsuportegirassol/dto/MessageDTO";
import { useAuth } from "Frontend/auth";
import { RatingDialog } from "Frontend/components/rating-dialog";
import { UsuarioService } from "Frontend/generated/endpoints";
import { set } from "date-fns";
import CriarPedido from "Frontend/generated/ao/appsuportegirassol/dto/CriarPedido";

interface ChatMessage {
  id: string;
  orderId: number;
  senderId: number;
  senderRole: string;
  mensagem: string;
  createdAt: Date;
  lida: boolean;
}

export const config: ViewConfig = {
  loginRequired: true,
  rolesAllowed: ["ROLE_USER"],
};

export default function PedidosPage() {
  const [user, setUser] = useState<Usuario>();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [orderToRate, setOrderToRate] = useState<Pedido | null>(null);
  const [addOrderDialogOpen, setAddOrderDialogOpen] = useState(false);

  const fetchOrders = async () => {
    // Filtrar pedidos baseado no tipo de usuário
    if (user?.papel === Papel.CLIENTE) {
      const data = await PedidoService.encontrarPedidosCliente();
      setOrders(data);
    } else if (user?.papel === Papel.TECNICO) {
      // Técnicos veem seus pedidos e pedidos pendentes
      const data = await PedidoService.encontrarPedidosTecnico();
      setOrders(data);
    }
  }

  useEffect(() => {
    UsuarioService.logado().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    fetchOrders()
  }, [user]);

  const handleCreateNewOrder = async (novoPedido: CriarPedido) => {

    const resultado = await PedidoService.criarPedido(novoPedido);

    if (resultado) {
      toast("Novo pedido criado", {
        description:
          "Seu pedido foi criado com sucesso e está aguardando um técnico.",
      });

      setAddOrderDialogOpen(false);

      fetchOrders();
    } else {
      toast("Erro ao criar pedido", {
        description: "Ocorreu um erro ao criar seu pedido. Tente novamente.",
      });
    }
  };

  const handleCancelOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelDialogOpen(true);
  };

  const confirmCancelOrder = (motivo: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedOrderId
          ? {
              ...order,
              estado: PedidoEstado.CANCELADO,
              nota: motivo,
              updatedAt: new Date(),
            }
          : order,
      ),
    );

    toast("Pedido cancelado", {
      description: "O pedido foi cancelado com sucesso.",
    });
  };

  const handleCompleteOrder = (orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              estado: PedidoEstado.CONCLUIDO,
              concluidoEm: new Date().toISOString(),
            }
          : order,
      ),
    );

    toast("Atendimento concluído", {
      description: "O cliente poderá avaliar o atendimento agora.",
    });
  };

  const handleAcceptOrder = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              estado: PedidoEstado.EM_ANDAMENTO,
              tecnicoId: user?.id,
              updatedAt: new Date(),
            }
          : order,
      ),
    );

    if (user && order) {
      const welcomeMessage: MessageDTO = {
        content: `Olá! Sou ${user.nome}, ${
          user.especialidade || "técnico"
        }. Aceitei seu pedido e estou pronto para atendê-lo. ${
          user.telefone
            ? `Você pode me contatar pelo telefone ${user.telefone}.`
            : ""
        } Vamos resolver seu problema!`,
        idPedido: order.id!,
        idUsuario: user.id!,
        sender: "user",
        timestamp: new Date().toISOString(),
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

  const handleRateOrder = (orderId: number) => {
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
              estado: PedidoEstado.AVALIADO,
              updatedAt: new Date(),
            }
          : order,
      ),
    );

    toast("Avaliação enviada!", {
      description: "Obrigado pelo seu feedback.",
    });

    setOrderToRate(null);
  };

  const filterOrdersByStatus = (statuses: PedidoEstado[]) => {
    return orders.filter((order) =>
      statuses.includes(order.estado ?? PedidoEstado.PENDENTE),
    );
  };

  const isClient = user?.papel === Papel.CLIENTE;
  const isTechnician = user?.papel === Papel.TECNICO;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isClient ? "Meus Pedidos" : "Atendimentos"}
          </h1>
          {isClient && (
            <Button onClick={() => setAddOrderDialogOpen(true)}>
              Novo Pedido
            </Button>
          )}
        </div>

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
            {filterOrdersByStatus([
              PedidoEstado.PENDENTE,
              PedidoEstado.ACEITO,
              PedidoEstado.EM_ANDAMENTO,
            ]).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido ativo no momento.
              </p>
            ) : (
              filterOrdersByStatus([
                PedidoEstado.PENDENTE,
                PedidoEstado.ACEITO,
                PedidoEstado.EM_ANDAMENTO,
              ]).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={handleCancelOrder}
                  onComplete={handleCompleteOrder}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="concluidos" className="space-y-4">
            {filterOrdersByStatus([
              PedidoEstado.CONCLUIDO,
              PedidoEstado.AVALIADO,
            ]).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido concluído.
              </p>
            ) : (
              filterOrdersByStatus([
                PedidoEstado.CONCLUIDO,
                PedidoEstado.AVALIADO,
              ]).map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onRate={handleRateOrder}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelados" className="space-y-4">
            {filterOrdersByStatus([PedidoEstado.CANCELADO]).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum pedido cancelado.
              </p>
            ) : (
              filterOrdersByStatus([PedidoEstado.CANCELADO]).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          {isTechnician && (
            <TabsContent value="disponiveis" className="space-y-4">
              {orders.filter(
                (o) => o.estado === PedidoEstado.PENDENTE && !o.tecnico,
              ).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum pedido disponível no momento.
                </p>
              ) : (
                orders
                  .filter(
                    (o) => o.estado === PedidoEstado.PENDENTE && !o.tecnico,
                  )
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
        orderId={selectedOrderId || -1}
      />

      {orderToRate && (
        <RatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          onSubmit={handleSubmitRating}
          technicianName={
            orderToRate.tecnico ? (orderToRate.tecnico.nome ?? "") : "Técnico"
          }
        />
      )}

      {/* New AddOrderDialog */}
      <AddOrderDialog
        open={addOrderDialogOpen}
        onOpenChange={setAddOrderDialogOpen}
        onConfirm={handleCreateNewOrder}
        clienteId={user?.id ?? -1}
      />
    </div>
  );
}
