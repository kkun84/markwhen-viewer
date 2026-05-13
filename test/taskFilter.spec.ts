import { describe, expect, it } from 'vitest'
import { filterTasksByQuery } from '@/features/viewer/taskFilter'

const tasks = [
  { id: '1', name: '要件定義', start: '2026-01-01', end: '2026-01-02', progress: 0 },
  { id: '2', name: '実装 API', start: '2026-02-01', end: '2026-02-02', progress: 0 }
]

describe('仕様: タスクフィルタ', () => {
  it('空クエリは全件を返す', () => {
    expect(filterTasksByQuery(tasks, '')).toHaveLength(2)
  })

  it('部分一致で抽出する', () => {
    expect(filterTasksByQuery(tasks, 'api')).toEqual([tasks[1]])
  })
})
