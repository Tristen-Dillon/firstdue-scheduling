import React from 'react'
import { format } from 'date-fns'
import { Button } from './ui/button'

interface DayProps {
  date: Date
  isCurrentMonth: boolean
}

export default function Day({ date, isCurrentMonth }: DayProps) {
  return (
    <div
      className={`relative border p-2 min-h-12 h-full grow flex flex-col items-start text-sm rounded-lg ${
        isCurrentMonth ? 'bg- text-foreground' : 'bg-background-90 text-muted-foreground'
      }`}
    >
      <span className="absolute top-1 left-1 text-xs font-semibold">{format(date, 'd')}</span>
      {/* Placeholder for events */}
    </div>
  )
}
