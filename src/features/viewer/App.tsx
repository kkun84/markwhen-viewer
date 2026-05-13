import { useMemo, useState } from 'react'
import { parseMarkwhen } from '@/domain/markwhen'

const initial = `2026-01-01: プロジェクト開始\n2026-03-01: 初回リリース`

export const App = () => {
  const [source, setSource] = useState(initial)
  const events = useMemo(() => parseMarkwhen(source), [source])

  return (
    <main>
      <h1>Markwhen Viewer</h1>
      <p>入力データはブラウザ内だけで処理されます。</p>
      <textarea aria-label="markwhen-input" value={source} onChange={(event) => setSource(event.target.value)} />
      <h2>解析結果</h2>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </main>
  )
}
