'use client'

import { createContext, useContext, useState } from 'react'
import { Event as PayloadEvent } from '@/payload-types'
import { addMonths, isSameDay, isSameMonth, subMonths } from 'date-fns'
import { useQueryState } from 'nuqs'
import { useUser } from './user-provider'
import { motion } from 'framer-motion'
interface CalendarContextType {
  state: {
    currentMonth: Date
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
    selectedDates: Date[]
    setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>
    events: PayloadEvent[]
    setEvents: React.Dispatch<React.SetStateAction<PayloadEvent[]>>
  }
  functions: {
    getEventsForDate: (date: Date) => PayloadEvent[]
    addEvent: (event: PayloadEvent) => void
    deleteEvent: (event: PayloadEvent) => void
    updateEvent: (event: PayloadEvent) => void
    getEventsForMonth: (date: Date) => PayloadEvent[]
    nextMonth: () => void
    previousMonth: () => void
    selectDate: (date: Date) => void
    deselectDate: (date: Date) => void
  }
  mode: 'view' | 'edit'
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({
  children,
  events,
}: {
  children: React.ReactNode
  events: PayloadEvent[]
}) {
  let mode
  const { user } = useUser()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useQueryState('view')

  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [eventState, setEventState] = useState<PayloadEvent[]>(events)

  const getEventsForDate = (date: Date) => {
    return eventState.filter((event) => {
      return isSameDay(event.date, date)
    })
  }

  const addEvent = (event: PayloadEvent) => {
    setEventState((prev) => [...prev, event])
  }

  const deleteEvent = (event: PayloadEvent) => {
    setEventState((prev) => prev.filter((e) => e.id !== event.id))
  }

  const updateEvent = (event: PayloadEvent) => {
    setEventState((prev) => prev.map((e) => (e.id === event.id ? event : e)))
  }

  const getEventsForMonth = (date: Date) => {
    return eventState.filter((event) => {
      return isSameMonth(event.date, date)
    })
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const selectDate = (date: Date) => {
    setSelectedDates((prev) => [...prev, date])
  }

  const deselectDate = (date: Date) => {
    setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, date)))
  }

  if (!view) {
    mode = 'view'
  }
  if (view === 'edit' && user.collection === 'admins') {
    mode = 'edit'
  } else {
    mode = 'view'
  }

  return (
    <CalendarContext.Provider
      value={{
        state: {
          currentMonth,
          setCurrentMonth,
          selectedDates,
          setSelectedDates,
          events: eventState,
          setEvents: setEventState,
        },
        functions: {
          getEventsForDate,
          addEvent,
          deleteEvent,
          updateEvent,
          getEventsForMonth,
          nextMonth,
          previousMonth,
          selectDate,
          deselectDate,
        },
        mode: mode as 'view' | 'edit',
      }}
    >
      <motion.div layout className="flex gap-2 h-full relative">
        {children}
      </motion.div>
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}
