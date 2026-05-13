import { useMemo, useState } from 'react'
import { parseMarkwhen, type GanttTask } from '@/domain/markwhen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GanttChart } from './GanttChart'
import { ganttViewModes, type GanttViewMode } from './viewMode'

const initial = `2026-01-01/2026-01-31: 要件定義
2026-02-01/2026-02-28: 設計
2026-03-01/2026-03-31: 実装
2026-04-01/2026-04-15: テスト
2026-04-16: リリース`

export const App = () => {
  const [source, setSource] = useState(initial)
  const [viewMode, setViewMode] = useState<GanttViewMode>('Month')
  const [selectedTask, setSelectedTask] = useState<GanttTask>()
  const tasks = useMemo(() => parseMarkwhen(source), [source])

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <h1>Markwhen Viewer</h1>
          <p>入力データはブラウザ内だけで処理されます。</p>
        </CardHeader>
        <CardContent>
          <textarea aria-label="markwhen-input" value={source} onChange={(event) => setSource(event.target.value)} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <Button type="button" variant="secondary" onClick={() => setSource(initial)}>
              サンプルへ戻す
            </Button>
            {ganttViewModes.map((mode) => (
              <Button key={mode} type="button" variant={viewMode === mode ? 'default' : 'secondary'} onClick={() => setViewMode(mode)}>
                {mode}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2>ガントチャート</h2>
        </CardHeader>
        <CardContent>
          <GanttChart tasks={tasks} viewMode={viewMode} onTaskSelect={setSelectedTask} />
          {selectedTask ? (
            <p aria-label="selected-task" style={{ marginTop: 8 }}>
              選択中: {selectedTask.name}（{selectedTask.start} 〜 {selectedTask.end}）
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}
