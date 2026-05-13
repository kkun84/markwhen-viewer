import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import Gantt from 'frappe-gantt'
import '../../styles/frappe-gantt.css'
import type { GanttTask } from '@/domain/markwhen'
import type { GanttViewMode } from './viewMode'
import { createViewportTimeline, pushViewport, redoViewport, undoViewport } from './viewportHistory'
import {
  fitViewportToBounds,
  initialViewportState,
  panViewport,
  scaleAroundPoint,
  stepZoom,
  toTransformStyle,
  type Point,
  type ViewportState
} from './viewport'

type Props = {
  readonly tasks: readonly GanttTask[]
  readonly viewMode: GanttViewMode
  readonly onTaskSelect: (task: GanttTask | undefined) => void
}

const zoomIntensity = 0.0012
const keyboardPanStep = 40

const asPoint = (event: { clientX: number; clientY: number }): Point => ({ x: event.clientX, y: event.clientY })

export const GanttChart = ({ tasks, viewMode, onTaskSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [timeline, setTimeline] = useState(() => createViewportTimeline(initialViewportState))
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<Point | undefined>(undefined)
  const viewport = timeline.present

  const setViewport = (updater: (current: ViewportState) => ViewportState) => {
    setTimeline((currentTimeline) => pushViewport(currentTimeline, updater(currentTimeline.present)))
  }

  const fitToScreen = () => {
    if (!containerRef.current) {
      return
    }
    const svg = containerRef.current.querySelector('svg')
    if (!svg) {
      return
    }
    const bounds = svg.getBBox()
    const rect = containerRef.current.getBoundingClientRect()
    setViewport(() => fitViewportToBounds({ width: bounds.width, height: bounds.height }, { width: rect.width, height: rect.height }, 40))
  }

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    containerRef.current.innerHTML = '<svg aria-label="gantt-chart" />'
    const svg = containerRef.current.querySelector('svg')
    if (!svg) {
      return
    }

    const chart = new Gantt(svg, [...tasks], {
      view_mode: viewMode,
      language: 'ja',
      on_click: (task: unknown) => onTaskSelect(task as GanttTask)
    })

    chart.change_view_mode(viewMode)
    requestAnimationFrame(fitToScreen)
  }, [onTaskSelect, tasks, viewMode])

  const transform = useMemo(() => toTransformStyle(viewport), [viewport])

  const zoomByStep = (direction: -1 | 1) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const focal = rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 }
    setViewport((current) => stepZoom(current, direction, focal))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      setTimeline((current) => (event.shiftKey ? redoViewport(current) : undoViewport(current)))
      return
    }

    if (event.key === '+' || event.key === '=') {
      event.preventDefault()
      zoomByStep(1)
      return
    }
    if (event.key === '-') {
      event.preventDefault()
      zoomByStep(-1)
      return
    }
    if (event.key === '0') {
      event.preventDefault()
      setTimeline(() => createViewportTimeline(initialViewportState))
      return
    }
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault()
      fitToScreen()
      return
    }

    const keyMap: Record<string, Point> = {
      ArrowUp: { x: 0, y: keyboardPanStep },
      ArrowDown: { x: 0, y: -keyboardPanStep },
      ArrowLeft: { x: keyboardPanStep, y: 0 },
      ArrowRight: { x: -keyboardPanStep, y: 0 }
    }

    const delta = keyMap[event.key]
    if (delta) {
      event.preventDefault()
      setViewport((current) => panViewport(current, delta))
    }
  }

  return (
    <section className="gantt-shell">
      <div className="gantt-toolbar">
        <button type="button" onClick={() => zoomByStep(1)}>拡大 +</button>
        <button type="button" onClick={() => zoomByStep(-1)}>縮小 -</button>
        <button type="button" onClick={() => setTimeline((current) => undoViewport(current))} disabled={timeline.past.length === 0}>戻す</button>
        <button type="button" onClick={() => setTimeline((current) => redoViewport(current))} disabled={timeline.future.length === 0}>進む</button>
        <button type="button" onClick={() => setTimeline(() => createViewportTimeline(initialViewportState))}>リセット</button>
        <button type="button" onClick={fitToScreen}>全体表示</button>
        <span>倍率: {(viewport.scale * 100).toFixed(0)}%</span>
      </div>
      <p className="gantt-shortcut">ショートカット: Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z, +, -, 0, F, ←→↑↓</p>
      <div
        ref={containerRef}
        className={`gantt-interactive ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onDoubleClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setViewport((current) => stepZoom(current, 1, { x: event.clientX - rect.left, y: event.clientY - rect.top }))
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          dragStart.current = asPoint(event)
          setIsDragging(true)
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId)
          dragStart.current = undefined
          setIsDragging(false)
        }}
        onPointerMove={(event) => {
          if (!dragStart.current) {
            return
          }
          const nextPoint = asPoint(event)
          const start = dragStart.current
          setViewport((current) => panViewport(current, { x: nextPoint.x - start.x, y: nextPoint.y - start.y }))
          dragStart.current = nextPoint
        }}
        onWheel={(event) => {
          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          const focal = { x: event.clientX - rect.left, y: event.clientY - rect.top }
          const zoomDelta = Math.exp(-event.deltaY * zoomIntensity)
          setViewport((current) => scaleAroundPoint(current, current.scale * zoomDelta, focal))
        }}
      />
    </section>
  )
}
