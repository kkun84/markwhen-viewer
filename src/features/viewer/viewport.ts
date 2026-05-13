export type Point = { readonly x: number; readonly y: number }

export type Size = { readonly width: number; readonly height: number }

export type ViewportState = {
  readonly scale: number
  readonly x: number
  readonly y: number
}

const minScale = 0.3
const maxScale = 8
const zoomFactor = 1.25

export const clampScale = (scale: number): number => Math.min(maxScale, Math.max(minScale, scale))

export const panViewport = (state: ViewportState, delta: Point): ViewportState => ({
  ...state,
  x: state.x + delta.x,
  y: state.y + delta.y
})

export const scaleAroundPoint = (state: ViewportState, nextScaleRaw: number, focal: Point): ViewportState => {
  const nextScale = clampScale(nextScaleRaw)
  if (nextScale === state.scale) {
    return state
  }

  const ratio = nextScale / state.scale

  return {
    scale: nextScale,
    x: focal.x - (focal.x - state.x) * ratio,
    y: focal.y - (focal.y - state.y) * ratio
  }
}

export const stepZoom = (state: ViewportState, direction: -1 | 1, focal: Point = { x: 0, y: 0 }): ViewportState =>
  scaleAroundPoint(state, state.scale * (direction === 1 ? zoomFactor : 1 / zoomFactor), focal)

export const fitViewportToBounds = (content: Size, container: Size, padding = 24): ViewportState => {
  const safeWidth = Math.max(content.width, 1)
  const safeHeight = Math.max(content.height, 1)
  const availableWidth = Math.max(container.width - padding * 2, 1)
  const availableHeight = Math.max(container.height - padding * 2, 1)
  const scale = clampScale(Math.min(availableWidth / safeWidth, availableHeight / safeHeight))

  return {
    scale,
    x: (container.width - safeWidth * scale) / 2,
    y: (container.height - safeHeight * scale) / 2
  }
}

export const toTransformStyle = (state: ViewportState): string =>
  `translate(${state.x}px, ${state.y}px) scale(${state.scale})`

export const initialViewportState: ViewportState = { scale: 1, x: 0, y: 0 }
