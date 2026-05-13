import { describe, expect, it } from 'vitest'
import { createViewportTimeline, pushViewport, redoViewport, undoViewport } from '@/features/viewer/viewportHistory'

describe('仕様: ビューポート履歴', () => {
  it('履歴をpushできる', () => {
    const initial = createViewportTimeline({ scale: 1, x: 0, y: 0 })
    const pushed = pushViewport(initial, { scale: 2, x: 10, y: -10 })
    expect(pushed.past).toEqual([{ scale: 1, x: 0, y: 0 }])
    expect(pushed.present).toEqual({ scale: 2, x: 10, y: -10 })
  })

  it('undo/redoできる', () => {
    const history = pushViewport(createViewportTimeline({ scale: 1, x: 0, y: 0 }), { scale: 2, x: 5, y: 5 })
    const undone = undoViewport(history)
    expect(undone.present).toEqual({ scale: 1, x: 0, y: 0 })
    const redone = redoViewport(undone)
    expect(redone.present).toEqual({ scale: 2, x: 5, y: 5 })
  })
})
