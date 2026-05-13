import { describe, expect, it } from 'vitest'
import { ganttViewModes, isGanttViewMode } from '@/features/viewer/viewMode'

describe('仕様: ガントの表示モード', () => {
  it('利用可能な表示モードを提供する', () => {
    expect(ganttViewModes).toEqual(['Day', 'Week', 'Month', 'Year'])
  })

  it('許可された表示モードだけを受け入れる', () => {
    expect(isGanttViewMode('Week')).toBe(true)
    expect(isGanttViewMode('Quarter')).toBe(false)
  })
})
