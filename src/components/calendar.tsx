'use client'

import React from 'react'
import Month from '@/components/month'
import { useCalendar } from '@/providers/calendar-provider'
import { format } from 'date-fns'
import { Button } from './ui/button'
import { useUser } from '@/providers/user-provider'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { state, functions, mode } = useCalendar()
  const { setSelectedDates } = state
  const { user } = useUser()
  const { currentMonth } = state
  const { nextMonth, previousMonth } = functions
  const router = useRouter()

  return (
    <div className="flex flex-col w-full h-full mx-auto shadow-lg rounded-lg border-border border">
      <div className="flex px-4 py-2 md:pt-4 justify-between md:mb-4">
        <Button variant="outline" className="block md:hidden" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-10">
          <h2 className="text-md md:text-2xl font-bold text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          {user.collection === 'admins' && (
            <Button
              variant="outline"
              onClick={() => {
                if (mode === 'view') {
                  router.push('?view=edit')
                } else {
                  setSelectedDates([])
                  router.push('/')
                }
              }}
            >
              {mode === 'view' ? 'Edit Calendar' : 'View Calendar'}
            </Button>
          )}
        </div>
        <Button variant="outline" className="block md:hidden" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="gap-2 hidden md:flex">
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
