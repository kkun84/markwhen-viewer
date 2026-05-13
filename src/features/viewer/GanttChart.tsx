import { useEffect, useRef } from 'react'
import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import type { GanttTask } from '@/domain/markwhen'
import type { GanttViewMode } from './viewMode'

type Props = {
  readonly tasks: readonly GanttTask[]
  readonly viewMode: GanttViewMode
  readonly onTaskSelect: (task: GanttTask | undefined) => void
}

export const GanttChart = ({ tasks, viewMode, onTaskSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)

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
  }, [onTaskSelect, tasks, viewMode])

  return <div ref={containerRef} />
}
