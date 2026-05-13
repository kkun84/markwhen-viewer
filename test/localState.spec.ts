import { describe, expect, it } from 'vitest'
import { loadPersistedViewerState, savePersistedViewerState } from '@/features/viewer/localState'

describe('仕様: ローカル保存状態', () => {
  it('sourceとviewModeを保存・復元する', () => {
    savePersistedViewerState({ source: '2026-01-01:開始', viewMode: 'Week' })
    expect(loadPersistedViewerState()).toEqual({ source: '2026-01-01:開始', viewMode: 'Week' })
  })

  it('不正形式は読み飛ばす', () => {
    window.localStorage.setItem('markwhen-viewer-state', '{broken')
    expect(loadPersistedViewerState()).toBeUndefined()
  })
})
