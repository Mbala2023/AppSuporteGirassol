"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/navbar";
import { ChangePasswordDialog } from "@/components/change-password-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingDisplay } from "@/components/rating-display";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Package,
  Award,
  Key,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useAuth } from "Frontend/auth";
import Pedido from "Frontend/generated/ao/appsuportegirassol/models/Pedido";
import PedidoEstado from "Frontend/generated/ao/appsuportegirassol/models/PedidoEstado";
import {
  encontrarPedidosCliente,
  encontrarPedidosTecnico,
} from "Frontend/generated/PedidoService";
import Usuario from "Frontend/generated/ao/appsuportegirassol/models/Usuario";
import Papel from "Frontend/generated/ao/appsuportegirassol/models/Papel";
import { UsuarioService } from "Frontend/generated/endpoints";
import Avaliacao from "Frontend/generated/ao/appsuportegirassol/models/Avaliacao";

export const config: ViewConfig = {
  loginRequired: true,
  rolesAllowed: ["ROLE_USER"],
};

export default function PerfilPage() {
  const router = useNavigate();
  const [userOrders, setUserOrders] = useState<Pedido[]>([]);
  const [userRatings, setUserRatings] = useState<Avaliacao[]>([]);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [user, setUser] = useState<Usuario>();

  useEffect(() => {
    UsuarioService.logado().then((data) => {
      setUser(data);
    });
  }, []);

  useEffect(() => {
    if (user?.papel === Papel.TECNICO) {
      encontrarPedidosTecnico().then((data) => {
        setUserOrders(data);
      });

//      setUserRatings(ratings);
    } else if (user?.papel === Papel.CLIENTE) {
      encontrarPedidosCliente().then((data) => {
        setUserOrders(data);
      });
    }
  }, [user, router]);


  if (!user) { return null; }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const pedidosConcluidos = userOrders.filter(
    (o) =>
      o.estado === PedidoEstado.CONCLUIDO || o.estado === PedidoEstado.AVALIADO,
  ).length;

  const pedidosAtivos = userOrders.filter(
    (o) =>
      o.estado === PedidoEstado.PENDENTE ||
      o.estado === PedidoEstado.ACEITO ||
      o.estado === PedidoEstado.EM_ANDAMENTO,
  ).length;

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> => {
    const success = {}; //changePassword(currentPassword, newPassword);

    if (success) {
     await  UsuarioService.alterarSenha(currentPassword, newPassword)
      toast("Senha alterada!", {
        description: "Sua senha foi alterada com sucesso.",
      });
      return true;
    } else {
      toast("Erro", {
        description: "Senha atual incorreta.",
      });
      return false;
    }
  };

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
                  <AvatarFallback className="text-2xl">
                    {getInitials(user?.nome ?? "")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold">{user?.nome}</h1>
                    <Badge className="mt-2 capitalize">
                      {user?.papel === Papel.ADMIN
                        ? "Administrador"
                        : user?.papel === Papel.TECNICO
                          ? "Técnico"
                          : "Cliente"}
                    </Badge>
                  </div>

                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{user?.telefone}</span>
                    </div>
                    {user?.papel === Papel.TECNICO && user?.especialidade && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{user.especialidade}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Membro desde{" "}
                        {format(user?.dataCadastro ?? "2025-01-01", "MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordDialogOpen(true)}
                    className="mt-2"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </Button>
                </div>

                {user?.papel === Papel.TECNICO && user?.avaliacaoMedia && (
                  <div className="flex flex-col items-center gap-2 p-4 border rounded-lg">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <RatingDisplay
                      rating={user?.avaliacaoMedia}
                      totalRatings={user?.totalAvaliacoes}
                      showCount
                      size="lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Descrição do Técnico */}
          {user?.papel === Papel.TECNICO && user?.descricao && (
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{user?.descricao}</p>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user?.papel === Papel.TECNICO
                    ? "Atendimentos Totais"
                    : "Pedidos Totais"}
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
                  {user?.papel === Papel.TECNICO
                    ? "Atendimentos Ativos"
                    : "Pedidos Ativos"}
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
                  {user?.papel === Papel.TECNICO
                    ? "Atendimentos Concluídos"
                    : "Pedidos Concluídos"}
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pedidosConcluidos}</div>
              </CardContent>
            </Card>
          </div>

          {/* Avaliações Recebidas (apenas para técnicos) */}
          {user?.papel === Papel.TECNICO && userRatings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Avaliações Recebidas</CardTitle>
                <CardDescription>
                  Feedback dos clientes sobre seus atendimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userRatings.map((rating) => {
                    const order = userOrders.find(
                      (o) => o.id === -1
                    );
                    const cliente = user;

                    return (
                      <div
                        key={rating.id}
                        className="space-y-2 pb-4 border-b last:border-0"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{order?.titulo}</p>
                            <p className="text-sm text-muted-foreground">
                              {cliente?.nome} •{" "}
                              {format(rating?.dataHora ?? "", "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                          <RatingDisplay rating={rating.estrelas} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Pedidos/Atendimentos Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>
                {user?.papel === Papel.TECNICO
                  ? "Atendimentos Recentes"
                  : "Pedidos Recentes"}
              </CardTitle>
              <CardDescription>
                Últimos{" "}
                {user?.papel === Papel.TECNICO
                  ? "atendimentos realizados"
                  : "pedidos feitos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum{" "}
                  {user?.papel === Papel.TECNICO ? "atendimento" : "pedido"}{" "}
                  registrado ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {userOrders.slice(0, 5).map((order) => {
                    const otherUserId =
                      user?.papel === Papel.TECNICO
                        ? order.cliente?.id
                        : order.tecnico?.id;
                    const otherUser = otherUserId ? user?.nome : null;

                    return (
                      <div
                        key={order.id}
                        className="flex items-start justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{order.titulo}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(
                              order.dataHora ?? "",
                              "dd 'de' MMMM 'às' HH:mm",
                              {
                                locale: ptBR,
                              },
                            )}
                          </p>
                          {otherUser && (
                            <p className="text-sm text-muted-foreground">
                              {user?.papel === Papel.TECNICO
                                ? "Cliente"
                                : "Técnico"}
                              : {otherUser}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            order.estado === PedidoEstado.CONCLUIDO ||
                            order.estado === PedidoEstado.AVALIADO
                              ? "secondary"
                              : order.estado === PedidoEstado.CANCELADO
                                ? "destructive"
                                : "default"
                          }
                        >
                          {order.estado?.replace("_", " ")}
                        </Badge>
                      </div>
                    );
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
  );
}
