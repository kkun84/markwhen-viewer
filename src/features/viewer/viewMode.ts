export const ganttViewModes = ['Day', 'Week', 'Month', 'Year'] as const

export type GanttViewMode = (typeof ganttViewModes)[number]

export const isGanttViewMode = (value: string): value is GanttViewMode =>
  ganttViewModes.includes(value as GanttViewMode)
