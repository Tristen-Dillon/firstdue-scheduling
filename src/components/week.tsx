import React from 'react'
import { addDays, isSameMonth } from 'date-fns'
import Day from './day'

interface WeekProps {
  startDate: Date // Sunday of the week
  currentMonth: Date
}

export default function Week({ startDate, currentMonth }: WeekProps) {
  return (
    <div className="grid grid-cols-7 md:gap-1 h-full">
      {Array.from({ length: 7 }).map((_, i) => {
        const currentDate = addDays(startDate, i)
        return (
          <Day key={i} date={currentDate} isCurrentMonth={isSameMonth(currentDate, currentMonth)} />
        )
      })}
    </div>
  )
}
