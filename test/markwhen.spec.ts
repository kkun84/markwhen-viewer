import { describe, expect, it } from 'vitest'
import { parseMarkwhen } from '@/domain/markwhen'

describe('仕様: Markwhen文字列をイベントへ変換する', () => {
  it('日付行だけを抽出し、日付とタイトルへ分解する', () => {
    const source = ['group Project', '2026-05-01: 設計開始', 'memo line', '2026-05-11: 公開'].join('\n')

    expect(parseMarkwhen(source)).toEqual([
      { raw: '2026-05-01: 設計開始', date: '2026-05-01', title: '設計開始' },
      { raw: '2026-05-11: 公開', date: '2026-05-11', title: '公開' }
    ])
  })
})
