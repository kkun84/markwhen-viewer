import type { ViewportState } from './viewport'

export type ViewportTimeline = {
  readonly past: readonly ViewportState[]
  readonly present: ViewportState
  readonly future: readonly ViewportState[]
}

const limit = 60

const equals = (a: ViewportState, b: ViewportState): boolean => a.scale === b.scale && a.x === b.x && a.y === b.y

export const createViewportTimeline = (initial: ViewportState): ViewportTimeline => ({
  past: [],
  present: initial,
  future: []
})

export const pushViewport = (timeline: ViewportTimeline, next: ViewportState): ViewportTimeline => {
  if (equals(timeline.present, next)) {
    return timeline
  }

  const past = [...timeline.past, timeline.present]
  const trimmed = past.length > limit ? past.slice(past.length - limit) : past

  return {
    past: trimmed,
    present: next,
    future: []
  }
}

export const undoViewport = (timeline: ViewportTimeline): ViewportTimeline => {
  if (timeline.past.length === 0) {
    return timeline
  }
  const previous = timeline.past[timeline.past.length - 1]
  if (!previous) {
    return timeline
  }
  return {
    past: timeline.past.slice(0, -1),
    present: previous,
    future: [timeline.present, ...timeline.future]
  }
}

export const redoViewport = (timeline: ViewportTimeline): ViewportTimeline => {
  if (timeline.future.length === 0) {
    return timeline
  }
  const [next, ...rest] = timeline.future
  if (!next) {
    return timeline
  }
  return {
    past: [...timeline.past, timeline.present],
    present: next,
    future: rest
  }
}
