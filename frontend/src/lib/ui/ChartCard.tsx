import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from './Card'

Chart.register(...registerables)

interface ChartCardProps {
  title: string
  type: 'bar' | 'doughnut' | 'line' | 'pie'
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
  height?: number
}

export function ChartCard({ title, type, labels, datasets, height = 250 }: ChartCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    if (chartRef.current) chartRef.current.destroy()

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    chartRef.current = new Chart(ctx, {
      type,
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, usePointStyle: true, boxWidth: 8, font: { size: 11 } },
          },
        },
        scales: type === 'doughnut' || type === 'pie' ? undefined : {
          y: { beginAtZero: true, ticks: { font: { size: 11 } }, grid: { color: '#f1f5f9' } },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } },
        },
      },
    })

    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [title, type, labels, datasets])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}
