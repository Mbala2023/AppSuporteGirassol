"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { ForgotPasswordDialog } from "./forgot-password-dialog"
import { useAuth } from "Frontend/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useNavigate()
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)

      if (!result.error) {
        toast("Login realizado com sucesso!",{
          description: "Redirecionando...",
        })
        router("/dashboard")
      } else {
        toast( "Erro ao fazer login",{
          description: "Email ou senha incorretos."
        })
      }
    } catch (error) {
      toast("Erro",{
        description: "Ocorreu um erro ao fazer login."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar no Sistema</CardTitle>
        <CardDescription>Digite suas credenciais para acessar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <ForgotPasswordDialog />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-3">Contas de teste:</p>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium">Admin:</span>
              <span className="text-muted-foreground">joao@email.com / admin123</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium">Técnico:</span>
              <span className="text-muted-foreground">maria@email.com / tecnico123</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-medium">Cliente:</span>
              <span className="text-muted-foreground">pedro@email.com / cliente123</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
