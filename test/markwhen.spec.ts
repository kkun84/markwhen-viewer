import { describe, expect, it } from 'vitest'
import { parseMarkwhen } from '@/domain/markwhen'

describe('仕様: Markwhen文字列をガントタスクへ変換する', () => {
  it('公式パーサーで期間とタイトルを抽出する', () => {
    const source = ['group Project', '2026-05-01/2026-05-03: 設計開始', 'memo line', '2026-05-11: 公開'].join('\n')

    expect(parseMarkwhen(source)).toEqual([
      { id: 'task-1', name: '設計開始', start: '2026-05-01', end: '2026-05-04', progress: 0 },
      { id: 'task-2', name: '公開', start: '2026-05-11', end: '2026-05-12', progress: 0 }
    ])
  })
})
