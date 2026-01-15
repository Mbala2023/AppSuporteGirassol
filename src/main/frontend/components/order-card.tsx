"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, MessageSquare, X, CheckCircle, Star } from "lucide-react"
import { format } from "date-fns"
import { ptBR, te } from "date-fns/locale"
import { useAuth } from "@/lib/auth-context"
import { Link } from "react-router"

interface OrderCardProps {
  order: Order
  onCancel?: (orderId: string) => void
  onComplete?: (orderId: string) => void
  onAccept?: (orderId: string) => void
  onRate?: (orderId: string) => void
}

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pendente: { label: "Pendente", variant: "outline" },
  aceito: { label: "Aceito", variant: "secondary" },
  em_andamento: { label: "Em Andamento", variant: "default" },
  concluido: { label: "Concluído", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "destructive" },
  avaliado: { label: "Avaliado", variant: "secondary" },
}

const mockOrders: Order[] = [
  { id: "1", titulo: "Instalação de Software", status: "pendente", tecnicoId: 2, clienteId: 3 },
  { id: "2", titulo: "Troca de Peça", status: "em_andamento", tecnicoId: 2, clienteId: 4 },
  { id: "3", titulo: "Manutenção Preventiva", status: "concluido", tecnicoId: 5, clienteId: 6 },
  { id: "4", titulo: "Configuração de Rede", status: "avaliado", tecnicoId: 5, clienteId: 3 },
  { id: "5", titulo: "Atualização de Sistema", status: "cancelado", tecnicoId: 2, clienteId: 4 },
]

// Mock users for demo
const mockUsers = [
  { id: 1, nome: "Admin User", role: "admin", especialidade: "Gestão", email: "admin@example.com", telefone: "1111-1111" },
  { id: 2, nome: "Técnico João", role: "tecnico", especialidade: "Hardware", email: "joao@example.com", telefone: "2222-2222" },
  { id: 3, nome: "Cliente Maria", role: "cliente", email: "maria@example.com", telefone: "3333-3333" },
  { id: 4, nome: "Cliente José", role: "cliente", email: "jose@example.com", telefone: "4444-4444" },
  { id: 5, nome: "Técnico Ana", role: "tecnico", especialidade: "Software", email: "ana@example.com", telefone: "5555-5555" },
  { id: 6, nome: "Cliente Carla", role: "cliente", email: "carla@example.com", telefone: "6666-6666" },
]

interface Order {
  id: string
  titulo: string
  descricao?: string
  dataHora?: Date
  endereco?: string
  status: OrderStatus
  tecnicoId?: number
  clienteId: number
  motivoCancelamento?: string
}

type OrderStatus =
  | "pendente"
  | "aceito"
  | "em_andamento"
  | "concluido"
  | "cancelado"
  | "avaliado"

function getUserById(id: number | string) {
  return mockUsers.find((u) => u.id === Number(id)) || null;
}

export function OrderCard({ order, onCancel, onComplete, onAccept, onRate }: OrderCardProps) {
  const { user, isClient, isTechnician } = useAuth()
  const cliente = getUserById(order.clienteId)
  const tecnico = order.tecnicoId ? getUserById(order.tecnicoId) : null
  const status = statusConfig[order.status]

  const canCancel =
    isClient && order.clienteId === user?.id && (order.status === "pendente" || order.status === "aceito")

  const canComplete = isTechnician && order.tecnicoId === user?.id && order.status === "em_andamento"

  const canAccept = isTechnician && !order.tecnicoId && order.status === "pendente"

  const canRate = isClient && order.clienteId === user?.id && order.status === "concluido" && onRate

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base sm:text-lg">{order.titulo}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Pedido #{order.id}</CardDescription>
          </div>
          <Badge variant={status.variant} className="self-start">
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{order.descricao}</p>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">{format(order.dataHora ?? "", "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{order.endereco}</span>
          </div>
        </div>

        {isClient && tecnico && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium">Técnico: {tecnico.nome}</p>
            {tecnico.especialidade && <p className="text-xs text-muted-foreground">{tecnico.especialidade}</p>}
          </div>
        )}

        {isTechnician && cliente && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium">Cliente: {cliente.nome}</p>
            <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
          </div>
        )}

        {order.status === "cancelado" && order.motivoCancelamento && (
          <div className="pt-2 border-t">
            <p className="text-xs sm:text-sm font-medium text-destructive">Motivo do cancelamento:</p>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{order.motivoCancelamento}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {(order.status === "aceito" || order.status === "em_andamento") && (
            <Link to={`/chat/${order.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </Link>
          )}

          {canAccept && onAccept && (
            <Button onClick={() => onAccept(order.id)} size="sm" className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Aceitar Pedido
            </Button>
          )}

          {canComplete && onComplete && (
            <Button onClick={() => onComplete(order.id)} size="sm" className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Concluir
            </Button>
          )}

          {canRate && (
            <Button onClick={() => onRate(order.id)} size="sm" className="flex-1">
              <Star className="mr-2 h-4 w-4" />
              Avaliar
            </Button>
          )}

          {canCancel && onCancel && (
            <Button onClick={() => onCancel(order.id)} variant="destructive" size="sm" className="flex-1">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
