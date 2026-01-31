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
import { RatingDialog } from "Frontend/components/rating-dialog";
import { AvaliacaoService, UsuarioService } from "Frontend/generated/endpoints";
import CriarPedido from "Frontend/generated/ao/appsuportegirassol/dto/CriarPedido";
import MensagemDTO from "Frontend/generated/ao/appsuportegirassol/dto/MensagemDTO";

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
    } else {
      const data = await PedidoService.todosPedidos();
      setOrders(data);
    }
  };

  useEffect(() => {
    UsuarioService.logado().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    fetchOrders();
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

  const confirmCancelOrder = async (id: number) => {
    try {
    await PedidoService.cancelarPedido(id)

    toast("Pedido cancelado", {
      description: "O pedido foi cancelado com sucesso.",
    });

    fetchOrders();
  } catch(error) {
    toast("Pedido cancelado", {
      description: "O pedido não foi cancelado.",
    });
  }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await PedidoService.concluirPedido(orderId)
      
      toast("Atendimento concluído", {
        description: "O cliente poderá avaliar o atendimento agora.",
      });

      fetchOrders();
    } catch(error) {

    }

  };

  const handleAcceptOrder = async (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);

    try {
      await PedidoService.aceitarPedido(orderId);
    
    toast("Pedido aceito", {
      description:
      "Você aceitou este pedido. Uma mensagem automática foi enviada ao cliente.",
    });

    fetchOrders();
  } catch(error) {
    toast("Erro ao aceitar pedido", {
      description: "Ocorreu um erro ao aceitar o pedido. Tente novamente.",
    });
  }
  };

  const handleRateOrder = (orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setOrderToRate(order);
      setRatingDialogOpen(true);
    }
  };

  const handleSubmitRating = async (rating: number, comentario: string) => {
    if (!orderToRate || !user) return;
try {
    await AvaliacaoService.avaliarTecnico(orderToRate.id ?? -1, rating)

    toast("Avaliação enviada!", {
      description: "Obrigado pelo seu feedback.",
    });

    setOrderToRate(null);
    fetchOrders();
  } catch(error) {
    toast("Erro ao enviar avaliação", {
      description: "Ocorreu um erro ao enviar sua avaliação. Tente novamente.",
    });
  }
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
                  onRate={handleRateOrder}
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
