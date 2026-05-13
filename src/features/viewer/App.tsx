import { useMemo, useState } from 'react'
import { parseMarkwhen } from '@/domain/markwhen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const initial = `2026-01-01/2026-01-15: 要件定義\n2026-01-16/2026-02-10: 実装\n2026-02-11/2026-02-20: テスト\n2026-03-01: 初回リリース`

const toUtcTime = (date: string): number => new Date(`${date}T00:00:00Z`).getTime()

const oneDay = 24 * 60 * 60 * 1000

export const App = () => {
  const [source, setSource] = useState(initial)
  const events = useMemo(() => parseMarkwhen(source), [source])

  const chart = useMemo(() => {
    if (events.length === 0) {
      return null
    }

    const starts = events.map((event) => toUtcTime(event.startDate))
    const ends = events.map((event) => toUtcTime(event.endDate))
    const chartStart = Math.min(...starts)
    const chartEnd = Math.max(...ends)
    const totalDays = Math.max(1, Math.round((chartEnd - chartStart) / oneDay) + 1)

    return events.map((event) => {
      const start = toUtcTime(event.startDate)
      const end = toUtcTime(event.endDate)
      const offsetDays = Math.round((start - chartStart) / oneDay)
      const durationDays = Math.max(1, Math.round((end - start) / oneDay) + 1)

      return {
        ...event,
        leftPercent: (offsetDays / totalDays) * 100,
        widthPercent: (durationDays / totalDays) * 100
      }
    })
  }, [events])

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <h1>Markwhen Viewer</h1>
          <p>入力データはブラウザ内だけで処理されます。</p>
        </CardHeader>
        <CardContent>
          <textarea aria-label="markwhen-input" value={source} onChange={(event) => setSource(event.target.value)} />
          <div style={{ marginTop: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setSource(initial)}>
              サンプルへ戻す
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2>ガントチャート</h2>
        </CardHeader>
        <CardContent>
          {chart === null ? (
            <p>表示できるイベントがありません。</p>
          ) : (
            <div className="space-y-2" aria-label="gantt-chart">
              {chart.map((event) => (
                <div key={event.raw}>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>{event.title}</div>
                  <div
                    style={{
                      position: 'relative',
                      height: 20,
                      background: '#f3f4f6',
                      borderRadius: 6,
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        left: `${event.leftPercent}%`,
                        width: `${event.widthPercent}%`,
                        top: 0,
                        bottom: 0,
                        background: '#111827',
                        borderRadius: 6
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, marginTop: 3 }}>
                    {event.startDate} - {event.endDate}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
