"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  MessageSquare,
  X,
  CheckCircle,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR, te } from "date-fns/locale";
import { Link, useNavigate } from "react-router";
import Pedido from "Frontend/generated/ao/appsuportegirassol/models/Pedido";
import PedidoEstado from "Frontend/generated/ao/appsuportegirassol/models/PedidoEstado";
import { useAuth } from "Frontend/auth";

interface OrderCardProps {
  order: Pedido;
  onCancel?: (orderId: number) => void;
  onComplete?: (orderId: number) => void;
  onAccept?: (orderId: number) => void;
  onRate?: (orderId: number) => void;
}

const statusConfig: Record<
  PedidoEstado,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDENTE: { label: "Pendente", variant: "outline" },
  ACEITO: { label: "Aceito", variant: "secondary" },
  CONCLUIDO: { label: "Concluído", variant: "secondary" },
  CANCELADO: { label: "Cancelado", variant: "destructive" },
  EM_ANDAMENTO: { label: "Em Andamento", variant: "default" },
  AVALIADO: { label: "Avaliado", variant: "default" },
};

interface Order {
  id: string;
  titulo: string;
  descricao?: string;
  dataHora?: Date;
  endereco?: string;
  status: PedidoEstado;
  tecnico?: {
    id: number;
    nome: string;
    especialidade?: string;
  };
  cliente?: {
    id: number;
    nome: string;
    telefone?: string;
  };
  tecnicoId?: number;
  clienteId: number;
  nota?: string;
}

export function OrderCard({
  order,
  onCancel,
  onComplete,
  onAccept,
  onRate,
}: OrderCardProps) {
  const cliente = order.cliente;
  const tecnico = order.tecnico;
  const status = statusConfig[order.estado ?? PedidoEstado.PENDENTE];
  const {
    state: { user },
  } = useAuth();
  const router = useNavigate()
  const isClient = user?.authorities.includes("ROLE_CLIENTE");
  const isTechnician = user?.authorities.includes("ROLE_TECNICO");

  const canCancel =
    isClient &&
    cliente?.username === user?.username &&
    (order.estado === PedidoEstado.PENDENTE ||
      order.estado === PedidoEstado.ACEITO);

  const canComplete =
    isTechnician &&
    tecnico?.username === user?.username &&
    order.estado === PedidoEstado.ACEITO;

  const canAccept =
    isTechnician && !tecnico && order.estado === PedidoEstado.PENDENTE;
  const canRate =
    isClient &&
    cliente?.username === user?.username &&
    order.estado === PedidoEstado.CONCLUIDO &&
    onRate;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base sm:text-lg">
              {order.titulo}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Pedido #{order.id} <Button onClick={() => router(`/chat/${order.id}`)}>Chat</Button>
            </CardDescription>
          </div>
          <Badge variant={status.variant} className="self-start">
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {order.descricao}
        </p>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">
              {format(order.dataHora ?? "", "dd 'de' MMMM 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{order.endereco}</span>
          </div>
        </div>

        {isClient && tecnico && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium">
              Técnico: {tecnico.nome}
            </p>
            {tecnico.especialidade && (
              <p className="text-xs text-muted-foreground">
                {tecnico.especialidade}
              </p>
            )}
          </div>
        )}

        {isTechnician && cliente && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium">
              Cliente: {cliente.nome}
            </p>
            <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
          </div>
        )}

        {order.estado === PedidoEstado.CANCELADO && order.nota && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium text-destructive">
              Motivo do cancelamento:
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
              {order.nota}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {(order.estado === PedidoEstado.ACEITO ||
            order.estado === PedidoEstado.EM_ANDAMENTO) && (
            <Link to={`/chat/${order.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </Link>
          )}

          {canAccept && onAccept && (
            <Button
              onClick={() => onAccept(order.id ?? -1)}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aceitar Pedido
            </Button>
          )}

          {canComplete && onComplete && (
            <Button
              onClick={() => onComplete(order.id ?? -1)}
              size="sm"
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Concluir
            </Button>
          )}

          {canRate && (
            <Button
              onClick={() => onRate(order.id ?? -1)}
              size="sm"
              className="flex-1"
            >
              <Star className="mr-2 h-4 w-4" />
              Avaliar
            </Button>
          )}

          {canCancel && onCancel && (
            <Button
              onClick={() => onCancel(order.id ?? -1)}
              variant="destructive"
              size="sm"
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
