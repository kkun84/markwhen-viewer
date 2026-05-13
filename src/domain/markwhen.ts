export type TimelineEvent = {
  readonly raw: string
  readonly date: string
  readonly title: string
}

const toTimelineEvent = (line: string): TimelineEvent => {
  const separator = line.indexOf(':')
  const date = line.slice(0, separator)
  const title = line.slice(separator + 1).trim()

  return { raw: line, date, title }
}

export const parseMarkwhen = (source: string): readonly TimelineEvent[] =>
  source
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\d{4}-\d{2}-\d{2}:/.test(line))
    .map(toTimelineEvent)
