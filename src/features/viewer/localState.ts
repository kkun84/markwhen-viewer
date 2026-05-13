import type { GanttViewMode } from './viewMode'

export type PersistedViewerState = {
  readonly source: string
  readonly viewMode: GanttViewMode
}

const key = 'markwhen-viewer-state'

export const loadPersistedViewerState = (): PersistedViewerState | undefined => {
  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return undefined
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedViewerState>
    if (typeof parsed.source !== 'string' || typeof parsed.viewMode !== 'string') {
      return undefined
    }
    return { source: parsed.source, viewMode: parsed.viewMode as GanttViewMode }
  } catch {
    return undefined
  }
}

export const savePersistedViewerState = (state: PersistedViewerState): void => {
  window.localStorage.setItem(key, JSON.stringify(state))
}
