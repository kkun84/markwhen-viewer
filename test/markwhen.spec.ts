import { describe, expect, it } from 'vitest'
import { parseMarkwhen } from '@/domain/markwhen'

describe('仕様: Markwhen文字列をイベントへ変換する', () => {
  it('日付行だけを抽出し、開始日と終了日とタイトルへ分解する', () => {
    const source = ['group Project', '2026-05-01: 設計開始', 'memo line', '2026-05-11: 公開'].join('\n')

    expect(parseMarkwhen(source)).toEqual([
      { raw: '2026-05-01: 設計開始', startDate: '2026-05-01', endDate: '2026-05-01', title: '設計開始' },
      { raw: '2026-05-11: 公開', startDate: '2026-05-11', endDate: '2026-05-11', title: '公開' }
    ])
  })

  it('開始日/終了日形式を期間イベントとして扱う', () => {
    const source = '2026-05-01/2026-05-07: 実装'

    expect(parseMarkwhen(source)).toEqual([
      { raw: '2026-05-01/2026-05-07: 実装', startDate: '2026-05-01', endDate: '2026-05-07', title: '実装' }
    ])
  })
})
