'use client'

import React from 'react'
import { startOfMonth, startOfWeek, addWeeks } from 'date-fns'
import Week from '@/components/week'
import { useCalendar } from '../providers/calendar-provider'

export default function Month() {
  const { state } = useCalendar()
  const { currentMonth } = state

  const startDate = startOfWeek(startOfMonth(currentMonth))
  const weeks = Array.from({ length: 6 }).map((_, i) => addWeeks(startDate, i))

  return (
    <div className="w-full flex flex-col justify-between mx-auto bg-background shadow-lg rounded-lg gap-1 h-full">
      {weeks.map((weekStart, i) => (
        <Week key={i} startDate={weekStart} currentMonth={currentMonth} />
      ))}
    </div>
  )
}
