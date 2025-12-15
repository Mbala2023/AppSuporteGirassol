"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CancelOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (motivo: string) => void
  orderId: string
}

export function CancelOrderDialog({ open, onOpenChange, onConfirm, orderId }: CancelOrderDialogProps) {
  const [motivo, setMotivo] = useState("")

  const handleConfirm = () => {
    if (motivo.trim()) {
      onConfirm(motivo)
      setMotivo("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Pedido</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do cancelamento</Label>
            <Textarea
              id="motivo"
              placeholder="Por favor, informe o motivo do cancelamento..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!motivo.trim()}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
