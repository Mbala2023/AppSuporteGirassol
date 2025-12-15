import type { User, Order, Rating, ChatMessage } from "./types"

// Dados mockados de usuários
export const mockUsers: User[] = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao@email.com",
    password: "admin123",
    telefone: "+258 84 123 4567",
    role: "admin",
    especialidade: "Eletricista",
    descricao: "Especialista em instalações elétricas residenciais e comerciais",
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 45,
    totalAtendimentos: 52,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria@email.com",
    password: "tecnico123",
    telefone: "+258 84 234 5678",
    role: "tecnico",
    especialidade: "Encanadora",
    descricao: "Profissional com 10 anos de experiência em sistemas hidráulicos",
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 38,
    totalAtendimentos: 40,
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    nome: "Pedro Costa",
    email: "pedro@email.com",
    password: "cliente123",
    telefone: "+258 84 345 6789",
    role: "cliente",
    createdAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    nome: "Ana Oliveira",
    email: "ana@email.com",
    password: "cliente123",
    telefone: "+258 84 456 7890",
    role: "cliente",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "5",
    nome: "Carlos Mendes",
    email: "carlos@email.com",
    password: "tecnico123",
    telefone: "+258 84 567 8901",
    role: "tecnico",
    especialidade: "Técnico de Ar Condicionado",
    descricao: "Manutenção e instalação de sistemas de climatização",
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 28,
    totalAtendimentos: 30,
    createdAt: new Date("2024-02-25"),
  },
]

// Dados mockados de pedidos
export const mockOrders: Order[] = [
  {
    id: "ORD001",
    clienteId: "3",
    tecnicoId: "1",
    titulo: "Instalação de tomadas",
    descricao: "Preciso instalar 3 tomadas na sala de estar",
    categoria: "Elétrica",
    status: "em_andamento",
    endereco: "Av. Julius Nyerere, 1234, Maputo",
    dataHora: new Date("2025-01-10T14:00:00"),
    createdAt: new Date("2025-01-08T10:30:00"),
    updatedAt: new Date("2025-01-10T14:00:00"),
    inicioAtendimento: new Date("2025-01-10T14:05:00"),
  },
  {
    id: "ORD002",
    clienteId: "4",
    tecnicoId: "2",
    titulo: "Vazamento na cozinha",
    descricao: "Torneira da cozinha está vazando",
    categoria: "Hidráulica",
    status: "concluido",
    endereco: "Rua da Resistência, 567, Maputo",
    dataHora: new Date("2025-01-05T09:00:00"),
    createdAt: new Date("2025-01-03T15:20:00"),
    updatedAt: new Date("2025-01-05T11:30:00"),
    concluidoEm: new Date("2025-01-05T11:30:00"),
    inicioAtendimento: new Date("2025-01-05T09:10:00"),
    tempoAtendimento: 20,
  },
  {
    id: "ORD003",
    clienteId: "3",
    tecnicoId: "2",
    titulo: "Manutenção de ar condicionado",
    descricao: "Ar condicionado não está gelando adequadamente",
    categoria: "Climatização",
    status: "pendente",
    endereco: "Av. Julius Nyerere, 1234, Maputo",
    dataHora: new Date("2025-01-15T10:00:00"),
    createdAt: new Date("2025-01-09T16:45:00"),
    updatedAt: new Date("2025-01-09T16:45:00"),
  },
  {
    id: "ORD004",
    clienteId: "4",
    tecnicoId: "1",
    titulo: "Troca de disjuntor",
    descricao: "Disjuntor queimou, precisa ser substituído",
    categoria: "Elétrica",
    status: "cancelado",
    endereco: "Rua da Resistência, 567, Maputo",
    dataHora: new Date("2025-01-07T14:00:00"),
    createdAt: new Date("2025-01-06T11:00:00"),
    updatedAt: new Date("2025-01-06T18:00:00"),
    canceladoEm: new Date("2025-01-06T18:00:00"),
    motivoCancelamento: "Consegui resolver por conta própria",
  },
  {
    id: "ORD005",
    clienteId: "3",
    tecnicoId: "2",
    titulo: "Instalação de chuveiro",
    descricao: "Instalar chuveiro elétrico no banheiro",
    categoria: "Hidráulica",
    status: "avaliado",
    endereco: "Av. Julius Nyerere, 1234, Maputo",
    dataHora: new Date("2025-01-02T08:00:00"),
    createdAt: new Date("2024-12-30T14:20:00"),
    updatedAt: new Date("2025-01-02T10:30:00"),
    concluidoEm: new Date("2025-01-02T10:30:00"),
    inicioAtendimento: new Date("2025-01-02T08:15:00"),
    tempoAtendimento: 15,
  },
]

// Dados mockados de avaliações
export const mockRatings: Rating[] = [
  {
    id: "RAT001",
    orderId: "ORD002",
    clienteId: "4",
    tecnicoId: "2",
    estrelas: 5,
    comentario: "Excelente profissional! Resolveu o problema rapidamente.",
    createdAt: new Date("2025-01-05T12:00:00"),
  },
  {
    id: "RAT002",
    orderId: "ORD005",
    clienteId: "3",
    tecnicoId: "2",
    estrelas: 5,
    comentario: "Muito competente e pontual. Recomendo!",
    createdAt: new Date("2025-01-02T11:00:00"),
  },
]

// Dados mockados de mensagens do chat
export const mockChatMessages: ChatMessage[] = [
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

// Função auxiliar para obter usuário por ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id)
}

// Função auxiliar para obter pedidos por cliente
export function getOrdersByClient(clienteId: string): Order[] {
  return mockOrders.filter((order) => order.clienteId === clienteId)
}

// Função auxiliar para obter pedidos por técnico
export function getOrdersByTechnician(tecnicoId: string): Order[] {
  return mockOrders.filter((order) => order.tecnicoId === tecnicoId)
}

// Função auxiliar para obter avaliações por técnico
export function getRatingsByTechnician(tecnicoId: string): Rating[] {
  return mockRatings.filter((rating) => rating.tecnicoId === tecnicoId)
}

// Função auxiliar para obter mensagens por pedido
export function getMessagesByOrder(orderId: string): ChatMessage[] {
  return mockChatMessages.filter((msg) => msg.orderId === orderId)
}
