import type { Order, Rating, User, TechnicianStats, TimePeriod, PeriodRatingData } from "./types"

// Função para filtrar dados por período
export function filterByPeriod<T extends { createdAt: Date }>(data: T[], period: TimePeriod): T[] {
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case "diario":
      startDate.setHours(0, 0, 0, 0)
      break
    case "semanal":
      startDate.setDate(now.getDate() - 7)
      break
    case "mensal":
      startDate.setMonth(now.getMonth() - 1)
      break
    case "anual":
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  return data.filter((item) => item.createdAt >= startDate)
}

// Função para calcular score do técnico
export function calculateTechnicianScore(
  totalAtendimentos: number,
  atendimentosConcluidos: number,
  avaliacaoMedia: number,
  totalAvaliacoes: number,
): number {
  // Peso: 40% taxa de conclusão, 40% avaliação média, 20% volume de atendimentos
  const taxaConclusao = totalAtendimentos > 0 ? atendimentosConcluidos / totalAtendimentos : 0
  const pesoTaxaConclusao = taxaConclusao * 40

  const pesoAvaliacao = (avaliacaoMedia / 5) * 40

  // Normalizar volume de atendimentos (máximo 20 pontos para 50+ atendimentos)
  const pesoVolume = Math.min((totalAtendimentos / 50) * 20, 20)

  return Number((pesoTaxaConclusao + pesoAvaliacao + pesoVolume).toFixed(1))
}

function calculateAverageAttendanceTime(orders: Order[]): number {
  const completedOrders = orders.filter(
    (o) => (o.status === "concluido" || o.status === "avaliado") && o.inicioAtendimento && o.concluidoEm,
  )

  if (completedOrders.length === 0) return 0

  const totalTime = completedOrders.reduce((acc, order) => {
    const start = new Date(order.inicioAtendimento!).getTime()
    const end = new Date(order.concluidoEm!).getTime()
    const diffInMinutes = (end - start) / (1000 * 60)
    return acc + diffInMinutes
  }, 0)

  return Math.round(totalTime / completedOrders.length)
}

// Função para obter estatísticas de técnicos por período
export function getTechnicianStatsByPeriod(
  users: User[],
  orders: Order[],
  ratings: Rating[],
  period: TimePeriod,
): TechnicianStats[] {
  const tecnicos = users.filter((u) => u.role === "tecnico" || u.role === "admin")

  const filteredOrders = filterByPeriod(orders, period)
  const filteredRatings = filterByPeriod(ratings, period)

  const stats: TechnicianStats[] = tecnicos.map((tecnico) => {
    const tecnicoOrders = filteredOrders.filter((o) => o.tecnicoId === tecnico.id)
    const tecnicoRatings = filteredRatings.filter((r) => r.tecnicoId === tecnico.id)

    const totalAtendimentos = tecnicoOrders.length
    const atendimentosConcluidos = tecnicoOrders.filter(
      (o) => o.status === "concluido" || o.status === "avaliado",
    ).length
    const atendimentosCancelados = tecnicoOrders.filter((o) => o.status === "cancelado").length

    const somaAvaliacoes = tecnicoRatings.reduce((acc, r) => acc + r.estrelas, 0)
    const avaliacaoMedia = tecnicoRatings.length > 0 ? somaAvaliacoes / tecnicoRatings.length : 0
    const totalAvaliacoes = tecnicoRatings.length

    const taxaConclusao = totalAtendimentos > 0 ? (atendimentosConcluidos / totalAtendimentos) * 100 : 0

    const score = calculateTechnicianScore(totalAtendimentos, atendimentosConcluidos, avaliacaoMedia, totalAvaliacoes)

    const ordersComData = tecnicoOrders.filter((o) => o.concluidoEm)
    const ultimoAtendimento = ordersComData.length > 0 ? ordersComData[ordersComData.length - 1].concluidoEm : undefined

    const tempoMedioAtendimento = calculateAverageAttendanceTime(tecnicoOrders)

    return {
      tecnicoId: tecnico.id,
      nome: tecnico.nome,
      especialidade: tecnico.especialidade || "Não especificado",
      avatar: tecnico.avatar,
      totalAtendimentos,
      atendimentosConcluidos,
      atendimentosCancelados,
      avaliacaoMedia,
      totalAvaliacoes,
      score,
      taxaConclusao,
      ultimoAtendimento,
      tempoMedioAtendimento,
    }
  })

  // Ordenar por score (maior para menor)
  return stats.sort((a, b) => b.score - a.score)
}

// Função para obter dados de avaliação por período para gráficos
export function getRatingDataByPeriod(ratings: Rating[], period: TimePeriod): PeriodRatingData[] {
  const filteredRatings = filterByPeriod(ratings, period)

  if (period === "diario") {
    // Agrupar por hora
    const hourlyData: { [key: string]: Rating[] } = {}

    filteredRatings.forEach((rating) => {
      const hour = rating.createdAt.getHours()
      const key = `${hour}:00`
      if (!hourlyData[key]) hourlyData[key] = []
      hourlyData[key].push(rating)
    })

    return Object.entries(hourlyData).map(([periodo, ratings]) => ({
      periodo,
      avaliacaoMedia: ratings.reduce((acc, r) => acc + r.estrelas, 0) / ratings.length,
      totalAvaliacoes: ratings.length,
      totalAtendimentos: ratings.length,
    }))
  }

  if (period === "semanal") {
    // Agrupar por dia da semana
    const dailyData: { [key: string]: Rating[] } = {}
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

    filteredRatings.forEach((rating) => {
      const dia = diasSemana[rating.createdAt.getDay()]
      if (!dailyData[dia]) dailyData[dia] = []
      dailyData[dia].push(rating)
    })

    return diasSemana.map((dia) => {
      const ratings = dailyData[dia] || []
      return {
        periodo: dia,
        avaliacaoMedia: ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.estrelas, 0) / ratings.length : 0,
        totalAvaliacoes: ratings.length,
        totalAtendimentos: ratings.length,
      }
    })
  }

  if (period === "mensal") {
    // Agrupar por semana
    const weeklyData: { [key: string]: Rating[] } = {}

    filteredRatings.forEach((rating) => {
      const weekNumber = Math.ceil(rating.createdAt.getDate() / 7)
      const key = `Semana ${weekNumber}`
      if (!weeklyData[key]) weeklyData[key] = []
      weeklyData[key].push(rating)
    })

    return Object.entries(weeklyData).map(([periodo, ratings]) => ({
      periodo,
      avaliacaoMedia: ratings.reduce((acc, r) => acc + r.estrelas, 0) / ratings.length,
      totalAvaliacoes: ratings.length,
      totalAtendimentos: ratings.length,
    }))
  }

  // Anual - agrupar por mês
  const monthlyData: { [key: string]: Rating[] } = {}
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

  filteredRatings.forEach((rating) => {
    const mes = meses[rating.createdAt.getMonth()]
    if (!monthlyData[mes]) monthlyData[mes] = []
    monthlyData[mes].push(rating)
  })

  return meses.map((mes) => {
    const ratings = monthlyData[mes] || []
    return {
      periodo: mes,
      avaliacaoMedia: ratings.length > 0 ? ratings.reduce((acc, r) => acc + r.estrelas, 0) / ratings.length : 0,
      totalAvaliacoes: ratings.length,
      totalAtendimentos: ratings.length,
    }
  })
}
