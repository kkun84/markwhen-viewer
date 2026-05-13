import { describe, expect, it } from 'vitest'
import { parseMarkwhen, parseMarkwhenSafe } from '@/domain/markwhen'

describe('仕様: Markwhen文字列をガントタスクへ変換する', () => {
  it('公式パーサーで期間とタイトルを抽出する', () => {
    const source = ['group Project', '2026-05-01/2026-05-03: 設計開始', 'memo line', '2026-05-11: 公開'].join('\n')

    expect(parseMarkwhen(source)).toEqual([
      { id: 'task-1', name: '設計開始', start: '2026-05-01', end: '2026-05-04', progress: 0 },
      { id: 'task-2', name: '公開', start: '2026-05-11', end: '2026-05-12', progress: 0 }
    ])
  })

  it('安全版パーサーは失敗時に空配列とエラーを返す', () => {
    const result = parseMarkwhenSafe('2026-01-01: OK\ninvalid: : :')
    expect(Array.isArray(result.tasks)).toBe(true)
    if (result.error) {
      expect(typeof result.error).toBe('string')
    }
  })
})
