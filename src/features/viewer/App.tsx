import { useEffect, useMemo, useState } from 'react'
import { parseMarkwhenSafe, type GanttTask } from '@/domain/markwhen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GanttChart } from './GanttChart'
import { ganttViewModes, isGanttViewMode, type GanttViewMode } from './viewMode'
import { decodeViewerState, toShareSearch, toShareUrl } from './shareState'
import { filterTasksByQuery } from './taskFilter'
import { loadPersistedViewerState, savePersistedViewerState } from './localState'

const initial = `2026-01-01/2026-01-31: 要件定義
2026-02-01/2026-02-28: 設計
2026-03-01/2026-03-31: 実装
2026-04-01/2026-04-15: テスト
2026-04-16: リリース`

const loadInitialState = (): { source: string; viewMode: GanttViewMode } => {
  const shared = new URLSearchParams(window.location.search).get('s')
  const fromShared = shared ? decodeViewerState(shared) : undefined
  if (fromShared && isGanttViewMode(fromShared.viewMode)) {
    return { source: fromShared.source, viewMode: fromShared.viewMode }
  }

  const persisted = loadPersistedViewerState()
  if (persisted && isGanttViewMode(persisted.viewMode)) {
    return persisted
  }

  return { source: initial, viewMode: 'Month' }
}

export const App = () => {
  const [state, setState] = useState(loadInitialState)
  const [selectedTask, setSelectedTask] = useState<GanttTask>()
  const [query, setQuery] = useState('')
  const parsed = useMemo(() => parseMarkwhenSafe(state.source), [state.source])
  const tasks = useMemo(() => filterTasksByQuery(parsed.tasks, query), [parsed.tasks, query])

  const updateState = (next: { source: string; viewMode: GanttViewMode }) => {
    savePersistedViewerState(next)
    setState(next)
  }

  useEffect(() => {
    const nextSearch = toShareSearch(state)
    if (window.location.search !== nextSearch) {
      window.history.replaceState(null, '', `${window.location.pathname}${nextSearch}`)
    }
  }, [state])

  return (
    <main className="space-y-4">
      <Card>
        <CardHeader>
          <h1>Markwhen Viewer</h1>
          <p>入力データはブラウザ内だけで処理されます。</p>
        </CardHeader>
        <CardContent>
          <textarea aria-label="markwhen-input" value={state.source} onChange={(event) => updateState({ ...state, source: event.target.value })} />
          {parsed.error ? <p className="gantt-error">解析エラー: {parsed.error}</p> : null}
          <input className="gantt-filter" aria-label="task-filter" placeholder="タスク名で絞り込み" value={query} onChange={(event) => setQuery(event.target.value)} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button type="button" variant="secondary" onClick={() => updateState({ ...state, source: initial })}>サンプルへ戻す</Button>
            <Button type="button" variant="secondary" onClick={() => navigator.clipboard.writeText(toShareUrl(state, window.location.origin, window.location.pathname))}>共有URLをコピー</Button>
            <Button type="button" variant="secondary" onClick={() => {
              const blob = new Blob([state.source], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'timeline.mw'
              link.click()
              URL.revokeObjectURL(url)
            }}>エクスポート</Button>
            <label className="gantt-upload">インポート<input type="file" accept=".mw,.txt" onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) {
                return
              }
              updateState({ ...state, source: await file.text() })
            }} /></label>
            {ganttViewModes.map((mode) => (
              <Button key={mode} type="button" variant={state.viewMode === mode ? 'default' : 'secondary'} onClick={() => updateState({ ...state, viewMode: mode })}>
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
          <p style={{ marginBottom: 8, color: '#475569' }}>ドラッグ・ホイール・ショートカットで操作できます。状態はURL共有とローカル保存に対応しています。表示中タスク: {tasks.length}件 / 全{parsed.tasks.length}件</p>
          <div className="gantt-stage">
            <GanttChart tasks={tasks} viewMode={state.viewMode} onTaskSelect={setSelectedTask} />
          </div>
          {selectedTask ? <p aria-label="selected-task" style={{ marginTop: 8 }}>選択中: {selectedTask.name}（{selectedTask.start} 〜 {selectedTask.end}）</p> : null}
        </CardContent>
      </Card>
    </main>
  )
}
