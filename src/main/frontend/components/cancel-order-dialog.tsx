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

interface CancelOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (orderId: number) => void
  orderId: number
}

export function CancelOrderDialog({ open, onOpenChange, onConfirm, orderId }: CancelOrderDialogProps) {
  const handleConfirm = () => {
    if (orderId !== -1) {
      onConfirm(orderId)
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={orderId === -1}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
