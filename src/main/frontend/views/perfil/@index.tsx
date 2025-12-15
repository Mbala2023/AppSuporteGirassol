"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingDisplay } from "@/components/rating-display"
import { mockOrders, mockRatings, getUserById } from "@/lib/mock-data"
import type { Order, Rating } from "@/lib/types"
import { Mail, Phone, Briefcase, Calendar, Package, Award, Key } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

export default function PerfilPage() {
  const { user, isAuthenticated, isTechnician, isClient, changePassword } = useAuth()
  const router = useNavigate()
  const [userOrders, setUserOrders] = useState<Order[]>([])
  const [userRatings, setUserRatings] = useState<Rating[]>([])
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router("/")
      return
    }

    if (isTechnician) {
      const orders = mockOrders.filter((o) => o.tecnicoId === user?.id)
      setUserOrders(orders)

      const ratings = mockRatings.filter((r) => r.tecnicoId === user?.id)
      setUserRatings(ratings)
    } else if (isClient) {
      const orders = mockOrders.filter((o) => o.clienteId === user?.id)
      setUserOrders(orders)
    }
  }, [isAuthenticated, user, isTechnician, isClient, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const pedidosConcluidos = userOrders.filter((o) => o.status === "concluido" || o.status === "avaliado").length

  const pedidosAtivos = userOrders.filter(
    (o) => o.status === "pendente" || o.status === "aceito" || o.status === "em_andamento",
  ).length

  const handleChangePassword = (currentPassword: string, newPassword: string): boolean => {
    const success = changePassword(currentPassword, newPassword)

    if (success) {
      toast("Senha alterada!", {
        description: "Sua senha foi alterada com sucesso.",
      })
      return true
    } else {
      toast("Erro", {
        description: "Senha atual incorreta.",
      })
      return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          {/* Cabeçalho do Perfil */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">{getInitials(user.nome)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold">{user.nome}</h1>
                    <Badge className="mt-2 capitalize">
                      {user.role === "admin" ? "Administrador" : user.role === "tecnico" ? "Técnico" : "Cliente"}
                    </Badge>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user.telefone}</span>
                    </div>
                    {isTechnician && user.especialidade && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{user.especialidade}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde {format(user.createdAt, "MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)} className="mt-2">
                    <Key className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </div>

                {isTechnician && user.avaliacaoMedia && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <RatingDisplay
                      rating={user.avaliacaoMedia}
                      totalRatings={user.totalAvaliacoes}
                      showCount
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Descrição do Técnico */}
          {isTechnician && user.descricao && (
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{user.descricao}</p>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isTechnician ? "Atendimentos Totais" : "Pedidos Totais"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userOrders.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isTechnician ? "Atendimentos Ativos" : "Pedidos Ativos"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pedidosAtivos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isTechnician ? "Atendimentos Concluídos" : "Pedidos Concluídos"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pedidosConcluidos}</div>
              </CardContent>
            </Card>
          </div>

          {/* Avaliações Recebidas (apenas para técnicos) */}
          {isTechnician && userRatings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recebidas</CardTitle>
                <CardDescription>Feedback dos clientes sobre seus atendimentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRatings.map((rating) => {
                    const order = mockOrders.find((o) => o.id === rating.orderId)
                    const cliente = getUserById(rating.clienteId)

                    return (
                      <div key={rating.id} className="space-y-2 pb-4 border-b last:border-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{order?.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              {cliente?.nome} • {format(rating.createdAt, "dd 'de' MMMM", { locale: ptBR })}
                            </p>
                          </div>
                          <RatingDisplay rating={rating.estrelas} />
                        </div>
                        {rating.comentario && (
                          <p className="text-sm text-muted-foreground italic">"{rating.comentario}"</p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Pedidos/Atendimentos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>{isTechnician ? "Atendimentos Recentes" : "Pedidos Recentes"}</CardTitle>
              <CardDescription>Últimos {isTechnician ? "atendimentos realizados" : "pedidos feitos"}</CardDescription>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum {isTechnician ? "atendimento" : "pedido"} registrado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {userOrders.slice(0, 5).map((order) => {
                    const otherUserId = isTechnician ? order.clienteId : order.tecnicoId
                    const otherUser = otherUserId ? getUserById(otherUserId) : null

                    return (
                      <div key={order.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{order.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(order.dataHora, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                          </p>
                          {otherUser && (
                            <p className="text-sm text-muted-foreground">
                              {isTechnician ? "Cliente" : "Técnico"}: {otherUser.nome}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            order.status === "concluido" || order.status === "avaliado"
                              ? "secondary"
                              : order.status === "cancelado"
                                ? "destructive"
                                : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* ChangePasswordDialog component */}
      <ChangePasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onConfirm={handleChangePassword}
      />
    </div>
  )
}
