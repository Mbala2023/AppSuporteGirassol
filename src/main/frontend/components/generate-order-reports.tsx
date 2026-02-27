import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PedidoService } from "Frontend/generated/endpoints";

import { useState } from "react"


export function GenerateOrderReport({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const gerarRelatorio = async () => {
    if (inicio) {
      try {
        const pedidosBytes = await PedidoService.gerarRelatorio(inicio, fim)

        if (!pedidosBytes) return;

          // Converte o byte array em Blob
          const blob = new Blob([new Uint8Array(pedidosBytes!)], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Cria um link invisível para disparar o download
          const link = document.createElement('a');
          link.href = url;
          link.download = 'relatorio.pdf';
          link.click();

          // Limpeza
          window.URL.revokeObjectURL(url);

        setOpen(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Gerar Relatório</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os detalhes do seu pedido.
          </AlertDialogDescription>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inicio" className="text-right">
                Data de Início
              </Label>
              <Input
                id="inicio"
                type="date"
                value={inicio}
                onChange={(e) => { console.log(e.target.value); setInicio(e.target.value) }}
                className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fim" className="text-right">
                Data de Fim
              </Label>
              <Input
                id="fim"
                type="date"
                value={fim}
                onChange={(e) => setFim(e.target.value)}
                className="col-span-3" />
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={gerarRelatorio}>
            Gerar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>)
}