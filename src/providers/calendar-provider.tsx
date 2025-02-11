'use client'

import { createContext, useContext, useState } from 'react'
import { Event as PayloadEvent } from '@/payload-types'
import { addMonths, isSameDay, isSameMonth, subMonths } from 'date-fns'
interface CalendarContextType {
  state: {
    currentMonth: Date
    setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
    selectedDate: Date | null
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>
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
  }
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export function CalendarProvider({
  children,
  events,
}: {
  children: React.ReactNode
  events: PayloadEvent[]
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [eventState, setEventState] = useState<PayloadEvent[]>(events)

  const getEventsForDate = (date: Date) => {
    return eventState.filter((event) => {
      return isSameDay(event.date, date)
    })
  }

  const addEvent = (event: PayloadEvent) => {
    setEventState([...eventState, event])
  }

  const deleteEvent = (event: PayloadEvent) => {
    setEventState(eventState.filter((e) => e.id !== event.id))
  }

  const updateEvent = (event: PayloadEvent) => {
    setEventState(eventState.map((e) => (e.id === event.id ? event : e)))
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

  return (
    <CalendarContext.Provider
      value={{
        state: {
          currentMonth,
          setCurrentMonth,
          selectedDate,
          setSelectedDate,
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
        },
      }}
    >
      {children}
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
