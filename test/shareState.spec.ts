import { describe, expect, it } from 'vitest'
import { decodeViewerState, encodeViewerState, toShareSearch, toShareUrl } from '@/features/viewer/shareState'

describe('仕様: 共有状態', () => {
  it('状態をエンコード/デコードできる', () => {
    const encoded = encodeViewerState({ source: '2026-01-01: 開始', viewMode: 'Week' })
    expect(decodeViewerState(encoded)).toEqual({ source: '2026-01-01: 開始', viewMode: 'Week' })
  })

  it('日本語と絵文字を含む状態を保持できる', () => {
    const encoded = encodeViewerState({ source: '設計🛠️\n2026-01-01: 開始', viewMode: 'Month' })
    expect(decodeViewerState(encoded)).toEqual({ source: '設計🛠️\n2026-01-01: 開始', viewMode: 'Month' })
  })

  it('共有URLを生成できる', () => {
    const url = toShareUrl({ source: 'a', viewMode: 'Month' }, 'https://example.com', '/viewer')
    expect(url).toContain('https://example.com/viewer?s=')
  })

  it('共有クエリ文字列を生成できる', () => {
    const search = toShareSearch({ source: 'a', viewMode: 'Month' })
    expect(search.startsWith('?s=')).toBe(true)
  })

  it('不正な文字列は無効と判定する', () => {
    expect(decodeViewerState('bad-token')).toBeUndefined()
  })
})
