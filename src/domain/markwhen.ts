import { isEvent, iter, parse } from '@markwhen/parser'

export type GanttTask = {
  readonly id: string
  readonly name: string
  readonly start: string
  readonly end: string
  readonly progress: number
}

const toDate = (isoDateTime: string): string => isoDateTime.slice(0, 10)

const toGanttTask = (
  id: string,
  sourceEvent: { firstLine?: { restTrimmed?: string }; dateRangeIso?: { fromDateTimeIso: string; toDateTimeIso: string } }
): GanttTask | undefined => {
  if (!sourceEvent.firstLine?.restTrimmed || !sourceEvent.dateRangeIso) {
    return undefined
  }

  return {
    id,
    name: sourceEvent.firstLine.restTrimmed,
    start: toDate(sourceEvent.dateRangeIso.fromDateTimeIso),
    end: toDate(sourceEvent.dateRangeIso.toDateTimeIso),
    progress: 0
  }
}

export const parseMarkwhen = (source: string): readonly GanttTask[] => {
  const timeline = parse(source)

  return [...iter(timeline.events)].reduce<GanttTask[]>((tasks, { eventy }) => {
    if (!isEvent(eventy)) {
      return tasks
    }

    const task = toGanttTask(`task-${tasks.length + 1}`, eventy)
    return task ? [...tasks, task] : tasks
  }, [])
}
