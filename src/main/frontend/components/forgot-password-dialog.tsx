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
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { UsuarioService } from "Frontend/generated/endpoints"

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    UsuarioService.redefinirSenha(email)

    toast("Email enviado!", {
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    })
  }


  const handleClose = () => {
    setEmail("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 text-sm">
          Esqueceu a senha?
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Recuperar Senha"</DialogTitle>
          <DialogDescription>
            Digite seu email para recuperar o acesso à sua conta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEmailSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">Verificar Email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
