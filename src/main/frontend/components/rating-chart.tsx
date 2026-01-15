"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Line, LineChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Star } from "lucide-react"

interface RatingChartProps {
  data: PeriodRatingData[]
  title: string
  description: string
}

interface PeriodRatingData {
  
}

export function RatingChart({ data, title, description }: RatingChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum dado disponível para o período selecionado
          </p>
        ) : (
          <ChartContainer
            config={{
              avaliacaoMedia: {
                label: "Avaliação Média",
                color: "hsl(var(--chart-1))",
              },
              totalAtendimentos: {
                label: "Total de Atendimentos",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis yAxisId="left" domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avaliacaoMedia"
                  stroke="var(--color-avaliacaoMedia)"
                  name="Avaliação Média"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalAtendimentos"
                  stroke="var(--color-totalAtendimentos)"
                  name="Total de Atendimentos"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
