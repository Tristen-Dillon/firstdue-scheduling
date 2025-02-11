'use client'

import React from 'react'
import Month from '@/components/month'
import { useCalendar } from '@/providers/calendar-provider'
import { format } from 'date-fns'
import { Button } from './ui/button'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { state, functions } = useCalendar()
  const { currentMonth } = state
  const { nextMonth, previousMonth } = functions

  return (
    <div className="flex flex-col w-full h-full mx-auto shadow-lg rounded-lg border-border border">
      <div className="flex p-4 items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previousMonth}>
            Previous
          </Button>
          <Button variant="outline" onClick={nextMonth}>
            Next
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-border text-center font-medium text-muted-foreground pb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>
      <Month />
    </div>
  )
}
