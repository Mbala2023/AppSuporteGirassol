"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Star, Shield, ShieldCheck, Trash2 } from "lucide-react"
// Local mock data and type fallback
export type User = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role: "admin" | "tecnico" | "cliente";
  especialidade?: string;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  createdAt?: Date;
  descricao?: string;
};

const mockUsers: User[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(11) 99999-0001",
    role: "tecnico",
    especialidade: "Elétrica",
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 60,
  },
  {
    id: 2,
    nome: "Maria Souza",
    email: "maria.souza@email.com",
    telefone: "(21) 98888-0002",
    role: "admin",
    especialidade: "Hidráulica",
    avaliacaoMedia: 4.6,
    totalAvaliacoes: 55,
  },
];
import { toast } from "sonner"
import Usuario from "Frontend/generated/ao/appsuportegirassol/models/Usuario"
import Papel from "Frontend/generated/ao/appsuportegirassol/models/Papel"


interface UserManagementCardProps {
  user?: Usuario
}

export function UserManagementCard({ user }: UserManagementCardProps) {
  // Use provided user or fallback to first mock user
  const [currentUser, setCurrentUser] = useState(user)

  const handlePromoteToAdmin = () => {
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser?.id)
    if (userIndex !== -1) {
      mockUsers[userIndex].role = "admin"
      setCurrentUser({ ...(currentUser!), papel: Papel.ADMIN })
      toast("Usuário promovido!", {
        description: `${currentUser?.nome} agora é um administrador.`,
      })
      window.location.reload()
    }
  }

  const handleDemoteFromAdmin = () => {
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser?.id)
    if (userIndex !== -1) {
      mockUsers[userIndex].role = "tecnico"
      setCurrentUser({ ...(currentUser!), papel: Papel.TECNICO })
      toast("Permissões alteradas", {
        description: `${currentUser?.nome} agora é um técnico.`,
      })
      window.location.reload()
    }
  }

  const handleDeleteUser = () => {
    const userIndex = mockUsers.findIndex((u) => u.id === currentUser?.id)
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1)
      toast("Usuário removido", {
        description: `${currentUser?.nome} foi removido do sistema.`,
      })
      window.location.reload()
    }
  }

  const getRoleBadge = (role: Papel) => {
    const variants: { [key in Papel]: string } = {
      ADMIN: "default",
      TECNICO: "secondary",
      CLIENTE: "outline",
    }
    return <Badge variant={variants[role as keyof typeof variants] as any}>{role}</Badge>
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{currentUser?.nome}</h3>
              {getRoleBadge(currentUser?.papel ?? Papel.CLIENTE)}
            </div>
            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
            <p className="text-sm text-muted-foreground">{currentUser?.telefone}</p>
            {currentUser?.especialidade && (
              <p className="text-sm">
                <span className="font-medium">Especialidade:</span> {currentUser.especialidade}
              </p>
            )}
            {currentUser?.avaliacaoMedia !== undefined && currentUser?.avaliacaoMedia > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{currentUser.avaliacaoMedia.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground">({currentUser.totalAvaliacoes} avaliações)</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {currentUser?.papel === Papel.TECNICO && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Promover a Admin
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Promover a Administrador?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {currentUser.nome} terá acesso total ao sistema, incluindo o dashboard administrativo e
                      gerenciamento de usuários.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePromoteToAdmin}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {currentUser?.papel === Papel.ADMIN && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Remover Admin
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover permissões de administrador?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {currentUser.nome} perderá acesso ao dashboard administrativo e voltará a ser um técnico comum.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDemoteFromAdmin}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. {currentUser?.nome} será permanentemente removido do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
