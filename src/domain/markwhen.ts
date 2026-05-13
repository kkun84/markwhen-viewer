export type TimelineEvent = {
  readonly raw: string
  readonly startDate: string
  readonly endDate: string
  readonly title: string
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const linePattern = /^(\d{4}-\d{2}-\d{2})(?:\/(\d{4}-\d{2}-\d{2}))?:\s*(.+)$/

const toTimelineEvent = (line: string): TimelineEvent | null => {
  const match = line.match(linePattern)
  if (!match) {
    return null
  }

  const startDate = match[1]
  const endDate = match[2]
  const title = match[3]

  if (startDate === undefined || title === undefined) {
    return null
  }

  const resolvedEndDate = endDate ?? startDate

  if (!datePattern.test(startDate) || !datePattern.test(resolvedEndDate)) {
    return null
  }

  return {
    raw: line,
    startDate,
    endDate: resolvedEndDate,
    title: title.trim()
  }
}

export const parseMarkwhen = (source: string): readonly TimelineEvent[] =>
  source
    .split('\n')
    .map((line) => line.trim())
    .map(toTimelineEvent)
    .filter((event): event is TimelineEvent => event !== null)
