// Tipos de usuário no sistema
export type UserRole = "cliente" | "tecnico" | "admin"

// Status dos pedidos
export type OrderStatus =
  | "pendente" // Pedido criado, aguardando aceite
  | "aceito" // Técnico aceitou o pedido
  | "em_andamento" // Atendimento em progresso
  | "concluido" // Atendimento finalizado
  | "cancelado" // Cancelado pelo cliente
  | "avaliado" // Cliente já avaliou

// Interface do usuário
export interface User {
  id: string
  nome: string
  email: string
  password: string
  telefone: string
  role: UserRole
  avatar?: string
  createdAt: Date
  // Campos específicos para técnicos
  especialidade?: string
  descricao?: string
  avaliacaoMedia?: number
  totalAvaliacoes?: number
  totalAtendimentos?: number
}

// Interface do pedido/atendimento
export interface Order {
  id: string
  clienteId: string
  tecnicoId?: string
  titulo: string
  descricao: string
  categoria: string
  status: OrderStatus
  endereco: string
  dataHora: Date
  createdAt: Date
  updatedAt: Date
  canceladoEm?: Date
  concluidoEm?: Date
  motivoCancelamento?: string
  inicioAtendimento?: Date // Campo para rastrear quando o atendimento começou
  tempoAtendimento?: number // Tempo total em minutos
}

// Interface da avaliação
export interface Rating {
  id: string
  orderId: string
  clienteId: string
  tecnicoId: string
  estrelas: number // 1 a 5
  comentario?: string
  createdAt: Date
}

// Interface da mensagem do chat
export interface ChatMessage {
  id: string
  orderId: string
  senderId: string
  senderRole: UserRole
  mensagem: string
  createdAt: Date
  lida: boolean
}

// Interface para estatísticas do dashboard
export interface DashboardStats {
  totalPedidos: number
  pedidosPendentes: number
  pedidosEmAndamento: number
  pedidosConcluidos: number
  pedidosCancelados: number
  totalClientes: number
  totalTecnicos: number
  avaliacaoMediaGeral: number
}

// Interface para estatísticas de técnico com período
export interface TechnicianStats {
  tecnicoId: string
  nome: string
  especialidade: string
  avatar?: string
  totalAtendimentos: number
  atendimentosConcluidos: number
  atendimentosCancelados: number
  avaliacaoMedia: number
  totalAvaliacoes: number
  score: number // Score calculado baseado em atendimentos e avaliações
  taxaConclusao: number
  ultimoAtendimento?: Date
  tempoMedioAtendimento?: number // Campo para tempo médio em minutos
}

// Interface para dados de avaliação por período
export interface PeriodRatingData {
  periodo: string
  avaliacaoMedia: number
  totalAvaliacoes: number
  totalAtendimentos: number
}

// Interface para dados do perfil do técnico
export interface TechnicianProfile extends User {
  role: "tecnico" | "admin"
  especialidade: string
  descricao: string
  avaliacaoMedia: number
  totalAvaliacoes: number
  totalAtendimentos: number
  avaliacoes: Rating[]
  atendimentosRecentes: Order[]
}

// Interface para dados do perfil do cliente
export interface ClientProfile extends User {
  role: "cliente"
  pedidosAtivos: Order[]
  pedidosHistorico: Order[]
}
