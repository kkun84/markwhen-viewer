import { useMemo, useState } from 'react'
import { parseMarkwhen } from '@/domain/markwhen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const initial = `2026-01-01: プロジェクト開始\n2026-03-01: 初回リリース`

export const App = () => {
  const [source, setSource] = useState(initial)
  const events = useMemo(() => parseMarkwhen(source), [source])

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
          <h2>解析結果</h2>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(events, null, 2)}</pre>
        </CardContent>
      </Card>
    </main>
  )
}
