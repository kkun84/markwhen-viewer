import { describe, expect, it } from 'vitest'
import {
  clampScale,
  fitViewportToBounds,
  panViewport,
  scaleAroundPoint,
  stepZoom,
  toTransformStyle,
  type ViewportState
} from '@/features/viewer/viewport'

describe('仕様: ビューポート操作', () => {
  it('拡大率を許容範囲に収める', () => {
    expect(clampScale(0.1)).toBe(0.3)
    expect(clampScale(20)).toBe(8)
    expect(clampScale(1.5)).toBe(1.5)
  })

  it('ドラッグ操作で平行移動を反映する', () => {
    const state: ViewportState = { scale: 1, x: 30, y: -10 }
    expect(panViewport(state, { x: 12, y: -6 })).toEqual({ scale: 1, x: 42, y: -16 })
  })

  it('カーソル位置を起点にズームし表示位置を補正する', () => {
    const state: ViewportState = { scale: 1, x: 0, y: 0 }
    const zoomed = scaleAroundPoint(state, 2, { x: 100, y: 50 })

    expect(zoomed).toEqual({ scale: 2, x: -100, y: -50 })
  })

  it('ステップ単位でズームできる', () => {
    const state: ViewportState = { scale: 1, x: 0, y: 0 }
    expect(stepZoom(state, 1)).toMatchObject({ scale: 1.25 })
    expect(stepZoom(state, -1)).toMatchObject({ scale: 0.8 })
  })

  it('表示領域に収まるようfitできる', () => {
    const fitted = fitViewportToBounds({ width: 1000, height: 500 }, { width: 500, height: 500 }, 40)
    expect(fitted.scale).toBeCloseTo(0.42, 2)
    expect(fitted.x).toBeCloseTo(40, 0)
    expect(fitted.y).toBeCloseTo(145, 0)
  })

  it('transform文字列へ変換できる', () => {
    expect(toTransformStyle({ scale: 1.5, x: 20, y: -10 })).toBe('translate(20px, -10px) scale(1.5)')
  })
})
