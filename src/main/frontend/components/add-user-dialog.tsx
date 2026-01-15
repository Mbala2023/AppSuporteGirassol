"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Eye, EyeOff } from "lucide-react"
import {toast} from "sonner"

// Mock users for demo
const mockUsers = [
  { id: 1, nome: "Admin User", role: "admin", especialidade: "Gestão", email: "admin@example.com" },
  { id: 2, nome: "Técnico João", role: "tecnico", especialidade: "Hardware", email: "joao@example.com" },
  { id: 3, nome: "Cliente Maria", role: "cliente", email: "maria@example.com" },
  { id: 4, nome: "Cliente José", role: "cliente", email: "jose@example.com" },
  { id: 5, nome: "Técnico Ana", role: "tecnico", especialidade: "Software", email: "ana@example.com" },
  { id: 6, nome: "Cliente Carla", role: "cliente", email: "carla@example.com" },
]

type UserRole = "cliente" | "tecnico" | "admin"

export function AddUserDialog() {
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [telefone, setTelefone] = useState("")
  const [role, setRole] = useState<UserRole>("cliente")
  const [especialidade, setEspecialidade] = useState("")
  const [descricao, setDescricao] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar se email já existe
    const emailExists = mockUsers.some((u) => u.email === email)
    if (emailExists) {
      toast( "Erro", {
        description: "Este email já está cadastrado no sistema."
      })
      return
    }

    // Criar novo usuário
    const newUser = {
      id: mockUsers.length + 1,
      nome, 
      email,
      role,
    }

    mockUsers.push(newUser)

    toast( "Usuário criado com sucesso!", {
      description: `${nome} foi adicionado como ${role}.`,
    })

    // Resetar formulário
    setNome("")
    setEmail("")
    setPassword("")
    setTelefone("")
    setRole("cliente")
    setEspecialidade("")
    setDescricao("")
    setOpen(false)

    // Recarregar página para atualizar lista
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>Preencha os dados para criar um novo usuário no sistema.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="+258 84 123 4567"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Tipo de Usuário *</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(role === "tecnico" || role === "admin") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="especialidade">Especialidade *</Label>
                  <Input
                    id="especialidade"
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    placeholder="Ex: Eletricista, Encanador, etc."
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Breve descrição sobre experiência e qualificações..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
