import type { GanttTask } from '@/domain/markwhen'

const normalize = (value: string): string => value.trim().toLocaleLowerCase('ja-JP')

export const filterTasksByQuery = (tasks: readonly GanttTask[], query: string): readonly GanttTask[] => {
  const q = normalize(query)
  if (!q) {
    return tasks
  }

  return tasks.filter((task) => normalize(task.name).includes(q))
}
