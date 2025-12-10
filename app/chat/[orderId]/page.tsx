"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import type { ChatMessage, Order } from "@/lib/types"
import { mockOrders, getUserById } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AttendanceTimer } from "@/components/attendance-timer"

const chatMessagesStore: ChatMessage[] = [
  {
    id: "MSG001",
    orderId: "ORD001",
    senderId: "3",
    senderRole: "cliente",
    mensagem: "Olá, a que horas você pode vir?",
    createdAt: new Date("2025-01-10T13:30:00"),
    lida: true,
  },
  {
    id: "MSG002",
    orderId: "ORD001",
    senderId: "1",
    senderRole: "tecnico",
    mensagem: "Boa tarde! Posso chegar às 14h. Está bom para você?",
    createdAt: new Date("2025-01-10T13:35:00"),
    lida: true,
  },
  {
    id: "MSG003",
    orderId: "ORD001",
    senderId: "3",
    senderRole: "cliente",
    mensagem: "Perfeito! Estarei esperando.",
    createdAt: new Date("2025-01-10T13:37:00"),
    lida: true,
  },
  {
    id: "MSG004",
    orderId: "ORD001",
    senderId: "1",
    senderRole: "tecnico",
    mensagem: "Já estou a caminho!",
    createdAt: new Date("2025-01-10T13:50:00"),
    lida: false,
  },
]

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    // Buscar pedido
    const foundOrder = mockOrders.find((o) => o.id === orderId)
    if (!foundOrder) {
      router.push("/pedidos")
      return
    }

    // Verificar se o usuário tem acesso a este chat
    if (foundOrder.clienteId !== user?.id && foundOrder.tecnicoId !== user?.id) {
      router.push("/pedidos")
      return
    }

    setOrder(foundOrder)
    setMessages(chatMessagesStore.filter((m) => m.orderId === orderId))
  }, [isAuthenticated, user, orderId, router])

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user) return

    const message: ChatMessage = {
      id: `MSG${Date.now()}`,
      orderId,
      senderId: user.id,
      senderRole: user.role,
      mensagem: newMessage,
      createdAt: new Date(),
      lida: false,
    }

    chatMessagesStore.push(message)
    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!isAuthenticated || !order) {
    return null
  }

  const otherUserId = order.clienteId === user?.id ? order.tecnicoId : order.clienteId
  const otherUser = otherUserId ? getUserById(otherUserId) : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <div className="mb-4 sm:mb-6">
          <Link href="/pedidos">
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
                <CardTitle className="text-base sm:text-lg">{order.titulo}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Pedido #{order.id}</CardDescription>
              </div>
              <Badge className="self-start">{order.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {otherUser && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarFallback className="text-xs sm:text-sm">{getInitials(otherUser.nome)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm sm:text-base">{otherUser.nome}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {otherUser.role === "tecnico" ? otherUser.especialidade : "Cliente"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {(order.status === "em_andamento" || order.status === "aceito") && (
          <div className="mb-4">
            <AttendanceTimer startTime={order.inicioAtendimento} status={order.status} />
          </div>
        )}

        <Card className="flex flex-col h-[calc(100vh-320px)] sm:h-[600px]">
          <CardHeader className="py-3 sm:py-6">
            <CardTitle className="text-base sm:text-lg">Conversa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-3 sm:p-6">
            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 mb-3 sm:mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground text-xs sm:text-sm py-8">
                  Nenhuma mensagem ainda. Inicie a conversa!
                </p>
              ) : (
                messages.map((message) => {
                  const sender = getUserById(message.senderId)
                  const isCurrentUser = message.senderId === user?.id

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 sm:gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">{sender ? getInitials(sender.nome) : "?"}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col gap-1 max-w-[75%] sm:max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 sm:px-4 ${
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-xs sm:text-sm break-words">{message.mensagem}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(message.createdAt, "HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()} className="flex-shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
