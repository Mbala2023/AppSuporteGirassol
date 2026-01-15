"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Trophy, TrendingUp, Award, Clock } from "lucide-react"

interface TechnicianRankingProps {
  stats: TechnicianStats[]
}

interface TechnicianStats {
  tecnicoId: number
  nome: string
  especialidade: string
  score: number
  totalAtendimentos: number
  tempoMedioAtendimento: number
  atendimentosConcluidos: number
  avaliacaoMedia: number
  totalAvaliacoes: number
  taxaConclusao: number
}

// Provide mock data if stats is not passed (for development/demo)
const mockStats: TechnicianStats[] = [
  {
    tecnicoId: 1,
    nome: "João Silva",
    especialidade: "Elétrica",
    score: 92,
    totalAtendimentos: 120,
    tempoMedioAtendimento: 45,
    atendimentosConcluidos: 115,
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 60,
    taxaConclusao: 96,
  },
  {
    tecnicoId: 2,
    nome: "Maria Souza",
    especialidade: "Hidráulica",
    score: 88,
    totalAtendimentos: 110,
    tempoMedioAtendimento: 50,
    atendimentosConcluidos: 105,
    avaliacaoMedia: 4.6,
    totalAvaliacoes: 55,
    taxaConclusao: 95,
  },
  {
    tecnicoId: 3,
    nome: "Carlos Lima",
    especialidade: "Pintura",
    score: 80,
    totalAtendimentos: 90,
    tempoMedioAtendimento: 60,
    atendimentosConcluidos: 85,
    avaliacaoMedia: 4.3,
    totalAvaliacoes: 40,
    taxaConclusao: 94,
  },
];

export function TechnicianRanking({ stats = mockStats }: TechnicianRankingProps) {
  const getPositionIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Award className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />
    return null
  }

  const getPositionColor = (index: number) => {
    if (index === 0) return "bg-yellow-50 border-yellow-200"
    if (index === 1) return "bg-gray-50 border-gray-200"
    if (index === 2) return "bg-amber-50 border-amber-200"
    return "bg-background"
  }

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return "—"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
          Ranking de Técnicos
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Classificação por score de desempenho</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {stats.length === 0 ? (
            <p className="text-xs sm:text-sm text-muted-foreground text-center py-8">
              Nenhum dado disponível para o período selecionado
            </p>
          ) : (
            stats.map((tecnico, index) => (
              <div
                key={tecnico.tecnicoId}
                className={`p-3 sm:p-4 border rounded-lg transition-colors ${getPositionColor(index)}`}
              >
                <div className="flex items-start gap-2 sm:gap-4">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    {getPositionIcon(index)}
                  </div>

                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarFallback className="text-xs sm:text-sm">
                      {tecnico.nome.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">{tecnico.nome}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{tecnico.especialidade}</p>
                      </div>
                      <Badge variant="secondary" className="text-base sm:text-lg font-bold flex-shrink-0">
                        {tecnico.score}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Atendimentos</p>
                        <p className="font-semibold">{tecnico.totalAtendimentos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Concluídos</p>
                        <p className="font-semibold text-green-600">{tecnico.atendimentosConcluidos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Tempo Médio</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          <span className="font-semibold">{formatTime(tecnico.tempoMedioAtendimento || 0)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Avaliação</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          <span className="font-semibold">{tecnico.avaliacaoMedia.toFixed(1)}</span>
                          <span className="text-muted-foreground text-xs">({tecnico.totalAvaliacoes})</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Taxa Conclusão</p>
                        <p className="font-semibold">{tecnico.taxaConclusao.toFixed(0)}%</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Score de Desempenho</span>
                        <span className="font-medium">{tecnico.score}/100</span>
                      </div>
                      <Progress value={tecnico.score} className="h-1.5 sm:h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
