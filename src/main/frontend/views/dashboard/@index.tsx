"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Wrench,
  Star,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TechnicianRanking } from "@/components/technician-ranking";
import { RatingChart } from "@/components/rating-chart";
import {
  getTechnicianStatsByPeriod,
  getRatingDataByPeriod,
  Order,
  Rating,
} from "@/lib/dashboard-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddUserDialog } from "@/components/add-user-dialog";
import { UserManagementCard, User } from "@/components/user-management-card";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { get } from "node:http";
import { getAuthenticatedUser } from "Frontend/auth";
import Papel from "Frontend/generated/ao/appsuportegirassol/models/Papel";
import { PedidoService } from "Frontend/generated/endpoints";
import PedidoEstado from "Frontend/generated/ao/appsuportegirassol/models/PedidoEstado";

// Mock data for dashboard demo
const mockOrders: Order[] = [
  {
    id: "1",
    titulo: "Instalação de Software",
    status: "pendente",
    tecnicoId: 2,
    createdAt: new Date(),
  },
  {
    id: "2",
    titulo: "Troca de Peça",
    status: "em_andamento",
    tecnicoId: 2,
    createdAt: new Date(),
  },
  {
    id: "3",
    titulo: "Manutenção Preventiva",
    status: "concluido",
    tecnicoId: 5,
    createdAt: new Date(),
  },
  {
    id: "4",
    titulo: "Configuração de Rede",
    status: "avaliado",
    tecnicoId: 5,
    createdAt: new Date(),
  },
  {
    id: "5",
    titulo: "Atualização de Sistema",
    status: "cancelado",
    tecnicoId: 2,
    createdAt: new Date(),
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    nome: "Admin User",
    email: "admin@email.com",
    telefone: "(11) 90000-0001",
    role: "admin",
    especialidade: "Gestão",
    avaliacaoMedia: 4.9,
    totalAvaliacoes: 100,
  },
  {
    id: 2,
    nome: "Técnico João",
    email: "joao.tecnico@email.com",
    telefone: "(11) 90000-0002",
    role: "tecnico",
    especialidade: "Hardware",
    avaliacaoMedia: 4.7,
    totalAvaliacoes: 80,
  },
  {
    id: 3,
    nome: "Cliente Maria",
    email: "maria.cliente@email.com",
    telefone: "(11) 90000-0003",
    role: "cliente",
    avaliacaoMedia: undefined,
    totalAvaliacoes: undefined,
  },
  {
    id: 4,
    nome: "Cliente José",
    email: "jose.cliente@email.com",
    telefone: "(11) 90000-0004",
    role: "cliente",
    avaliacaoMedia: undefined,
    totalAvaliacoes: undefined,
  },
  {
    id: 5,
    nome: "Técnico Ana",
    email: "ana.tecnico@email.com",
    telefone: "(11) 90000-0005",
    role: "tecnico",
    especialidade: "Software",
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 90,
  },
  {
    id: 6,
    nome: "Cliente Carla",
    email: "carla.cliente@email.com",
    telefone: "(11) 90000-0006",
    role: "cliente",
    avaliacaoMedia: undefined,
    totalAvaliacoes: undefined,
  },
];

const mockRatings: Rating[] = [
  { id: "1", estrelas: 5, tecnicoId: 2, createdAt: new Date("2026-01-10") },
  { id: "2", estrelas: 4, tecnicoId: 5, createdAt: new Date("2026-01-11") },
  { id: "3", estrelas: 3, tecnicoId: 2, createdAt: new Date("2026-01-12") },
  { id: "4", estrelas: 5, tecnicoId: 5, createdAt: new Date("2026-01-13") },
];

type TimePeriod = "diario" | "semanal" | "mensal" | "anual";

interface DashboardStats {
  totalPedidos: number;
  pedidosPendentes: number;
  pedidosEmAndamento: number;
  pedidosConcluidos: number;
  pedidosCancelados: number;
  totalClientes: number;
  totalTecnicos: number;
  avaliacaoMediaGeral: number;
}

export const config: ViewConfig = {
  loginRequired: true,
  rolesAllowed: ["ROLE_USER"],
};

export default function DashboardPage() {
  const router = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("mensal");
  const user = getAuthenticatedUser();

  useEffect(() => {
    if (user?.authorities.includes("ROLE_ADMIN") === false) {
      router("/pedidos");
      return;
    }

    PedidoService.encontrarPedidosCliente().then((data) => {
      // Calcular estatísticas
      const totalPedidos = data.length;
      const pedidosPendentes = data.filter(
        (o) => o.estado === PedidoEstado.PENDENTE,
      ).length;
      const pedidosEmAndamento = data.filter(
        (o) => o.estado === PedidoEstado.EM_ANDAMENTO || o.estado === PedidoEstado.ACEITO,
      ).length;
      const pedidosConcluidos = data.filter(
        (o) => o.endereco === PedidoEstado.CONCLUIDO || o.estado === PedidoEstado.AVALIADO,
      ).length;
      const pedidosCancelados = data.filter(
        (o) => o.estado === PedidoEstado.CANCELADO,
      ).length;
      const totalClientes = mockUsers.filter(
        (u) => u.role === "cliente",
      ).length;
      const totalTecnicos = mockUsers.filter(
        (u) => u.role === "tecnico" || u.role === "admin",
      ).length;

      const somaAvaliacoes = mockRatings.reduce(
        (acc, r) => acc + r.estrelas,
        0,
      );
      const avaliacaoMediaGeral =
        mockRatings.length > 0 ? somaAvaliacoes / mockRatings.length : 0;

      setStats({
        totalPedidos,
        pedidosPendentes,
        pedidosEmAndamento,
        pedidosConcluidos,
        pedidosCancelados,
        totalClientes,
        totalTecnicos,
        avaliacaoMediaGeral,
      });
    });
  }, [router]);

  if (!stats) {
    return null;
  }

  const taxaConclusao =
    stats.totalPedidos > 0
      ? ((stats.pedidosConcluidos / stats.totalPedidos) * 100).toFixed(1)
      : "0";

  const taxaCancelamento =
    stats.totalPedidos > 0
      ? ((stats.pedidosCancelados / stats.totalPedidos) * 100).toFixed(1)
      : "0";

  const technicianStats = getTechnicianStatsByPeriod(
    mockUsers,
    mockOrders,
    mockRatings,
    selectedPeriod,
  );
  const ratingData = getRatingDataByPeriod(mockRatings, selectedPeriod);

  const getPeriodLabel = (period: TimePeriod) => {
    const labels = {
      diario: "Hoje",
      semanal: "Últimos 7 dias",
      mensal: "Último mês",
      anual: "Último ano",
    };
    return labels[period];
  };

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return "—";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema e estatísticas de atendimento
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="rankings">Rankings e Avaliações</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Estatísticas Principais */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Pedidos
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPedidos}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Todos os pedidos registrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pedidos Ativos
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.pedidosPendentes + stats.pedidosEmAndamento}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pendentes e em andamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Conclusão
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taxaConclusao}%</div>
                  <Progress
                    value={Number.parseFloat(taxaConclusao)}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avaliação Média
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avaliacaoMediaGeral.toFixed(1)}
                  </div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= Math.round(stats.avaliacaoMediaGeral)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalhamento de Status */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Pedidos</CardTitle>
                  <CardDescription>
                    Distribuição por status atual
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Pendentes</span>
                    </div>
                    <Badge variant="outline">{stats.pedidosPendentes}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Em Andamento</span>
                    </div>
                    <Badge variant="outline">{stats.pedidosEmAndamento}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Concluídos</span>
                    </div>
                    <Badge variant="outline">{stats.pedidosConcluidos}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Cancelados</span>
                    </div>
                    <Badge variant="outline">{stats.pedidosCancelados}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>
                    Total de usuários cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Clientes</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.totalClientes}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Técnicos</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.totalTecnicos}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total</span>
                      <div className="text-2xl font-bold">
                        {stats.totalClientes + stats.totalTecnicos}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>
                  Indicadores de qualidade do serviço
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Taxa de Conclusão
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {taxaConclusao}%
                    </span>
                  </div>
                  <Progress value={Number.parseFloat(taxaConclusao)} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Taxa de Cancelamento
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {taxaCancelamento}%
                    </span>
                  </div>
                  <Progress
                    value={Number.parseFloat(taxaCancelamento)}
                    className="bg-red-100"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Satisfação dos Clientes
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {((stats.avaliacaoMediaGeral / 5) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={(stats.avaliacaoMediaGeral / 5) * 100} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rankings" className="space-y-6">
            {/* Filtro de Período */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Período de Análise</CardTitle>
                    <CardDescription>
                      Selecione o período para visualizar as estatísticas
                    </CardDescription>
                  </div>
                  <Select
                    value={selectedPeriod}
                    onValueChange={(value) =>
                      setSelectedPeriod(value as TimePeriod)
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">Diário</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Ranking de Técnicos */}
            <TechnicianRanking stats={technicianStats} />

            {/* Gráfico de Avaliações */}
            <RatingChart
              data={ratingData}
              title={`Avaliações - ${getPeriodLabel(selectedPeriod)}`}
              description="Evolução das avaliações e atendimentos no período selecionado"
            />

            {/* Estatísticas Resumidas por Período */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Melhor Técnico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {technicianStats.length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold">
                        {technicianStats[0].nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {technicianStats[0].especialidade}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                          Score: {technicianStats[0].score}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {technicianStats[0].avaliacaoMedia.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Mais Atendimentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {technicianStats.length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          [...technicianStats].sort(
                            (a, b) => b.totalAtendimentos - a.totalAtendimentos,
                          )[0].nome
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {
                          [...technicianStats].sort(
                            (a, b) => b.totalAtendimentos - a.totalAtendimentos,
                          )[0].totalAtendimentos
                        }{" "}
                        atendimentos
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Mais Rápido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {technicianStats.filter(
                    (t) => (t.tempoMedioAtendimento || 0) > 0,
                  ).length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          [...technicianStats]
                            .filter((t) => (t.tempoMedioAtendimento || 0) > 0)
                            .sort(
                              (a, b) =>
                                (a.tempoMedioAtendimento || 0) -
                                (b.tempoMedioAtendimento || 0),
                            )[0].nome
                        }
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-bold">
                          {formatTime(
                            [...technicianStats]
                              .filter((t) => (t.tempoMedioAtendimento || 0) > 0)
                              .sort(
                                (a, b) =>
                                  (a.tempoMedioAtendimento || 0) -
                                  (b.tempoMedioAtendimento || 0),
                              )[0].tempoMedioAtendimento || 0,
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Melhor Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {technicianStats.filter((t) => t.totalAvaliacoes > 0).length >
                  0 ? (
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          [...technicianStats]
                            .filter((t) => t.totalAvaliacoes > 0)
                            .sort(
                              (a, b) => b.avaliacaoMedia - a.avaliacaoMedia,
                            )[0].nome
                        }
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-bold">
                          {[...technicianStats]
                            .filter((t) => t.totalAvaliacoes > 0)
                            .sort(
                              (a, b) => b.avaliacaoMedia - a.avaliacaoMedia,
                            )[0]
                            .avaliacaoMedia.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem dados</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Pedidos</CardTitle>
                <CardDescription>
                  Lista completa de pedidos no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{order.titulo}</p>
                        <p className="text-sm text-muted-foreground">
                          #{order.id}
                        </p>
                      </div>
                      <Badge>{order.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  Gerenciamento de Usuários
                </h2>
                <p className="text-muted-foreground">
                  Adicione, edite e gerencie usuários do sistema
                </p>
              </div>
              <AddUserDialog />
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="admins">Administradores</TabsTrigger>
                <TabsTrigger value="technicians">Técnicos</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockUsers.map((user) => (
                  <UserManagementCard key={user.id} user={user} />
                ))}
              </TabsContent>

              <TabsContent value="admins" className="space-y-4">
                {mockUsers
                  .filter((u) => u.role === "admin")
                  .map((user) => (
                    <UserManagementCard key={user.id} user={user} />
                  ))}
              </TabsContent>

              <TabsContent value="technicians" className="space-y-4">
                {mockUsers
                  .filter((u) => u.role === "tecnico")
                  .map((user) => (
                    <UserManagementCard key={user.id} user={user} />
                  ))}
              </TabsContent>

              <TabsContent value="clients" className="space-y-4">
                {mockUsers
                  .filter((u) => u.role === "cliente")
                  .map((user) => (
                    <UserManagementCard key={user.id} user={user} />
                  ))}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
