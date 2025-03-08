import React from 'react'
import { format, isSameDay } from 'date-fns'
import { useCalendar } from '@/providers/calendar-provider'
import { Edit2 } from 'lucide-react'
import { useUser } from '@/providers/user-provider'
import Link from 'next/link'
import ConditionalWrapper from './conditional-wrapper'
interface DayProps {
  date: Date
  isCurrentMonth: boolean
}

export default function Day({ date, isCurrentMonth }: DayProps) {
  const { state, functions, mode } = useCalendar()
  const { user } = useUser()
  const { selectedDates } = state
  const { deselectDate, selectDate, getEventsForDate } = functions
  const { setSelectedDates } = state

  const isSelected = selectedDates.some((d) => isSameDay(d, date))
  const isToday = isSameDay(date, new Date())

  const events = getEventsForDate(date)
  return (
    <div
      className={`relative border border-border p-2 min-h-12 h-full grow flex flex-col items-start text-sm rounded-lg ${
        isCurrentMonth ? 'bg-accent text-foreground' : 'bg-background-90 text-muted-foreground'
      }`}
    >
      {user.collection === 'admins' && events.length > 0 && mode === 'edit' && (
        <div className="absolute top-2 right-2 rounded-lg z-50">
          <Link href={`/a/events?query='date=${format(date, 'yyyy-MM-dd')}'`}>
            <Edit2 className="w-4 h-4" />
          </Link>
        </div>
      )}
      {(isSelected || (isToday && selectedDates.length === 0 && mode === 'view')) && (
        <div className="absolute top-0 left-0 w-full h-full bg-blue-400/10 rounded-lg" />
      )}
      <span className="absolute top-2 left-2 text-xs font-semibold">{format(date, 'd')}</span>
      <div className="w-full mt-6 hidden md:flex flex-col z-20 gap-2 overflow-y-auto max-h-[136px] scroll-container">
        {events
          .sort((a, b) => a.startTime - b.startTime)
          .map((event) => (
            <ConditionalWrapper
              condition={mode === 'view'}
              wrapper={(children) => <Link href={`/?modal=events&id=${event.id}`}>{children}</Link>}
              elseWrapper={(children) => (
                <Link href={`/a/events?query='id=${event.id}'`}>{children}</Link>
              )}
              key={event.id}
            >
              <div
                className={`relative z-50 w-full h-6 rounded-md bg-red-800  items-center ${event.filled ? 'grayscale' : ''} `}
              >
                <div className="w-2 rounded-l-md left-0 absolute h-full bg-red-600" />
                <div className="ml-4 flex text-xs gap-2 items-center h-full text-nowrap truncate">
                  {format(new Date(event.startTime), 'h:mm a')} -{' '}
                  {format(new Date(event.endTime), 'h:mm a')}
                  <div className="text-xs hidden lg:block font-semibold truncate w-[80px]">
                    {event.title}
                  </div>
                </div>
              </div>
            </ConditionalWrapper>
          ))}
      </div>
      <div
        className="absolute inset-0 w-full h-full"
        onClick={() => {
          if (isSelected) {
            deselectDate(date)
          } else {
            if (mode === 'view') {
              setSelectedDates([date])
            } else {
              selectDate(date)
            }
          }
        }}
      />
      <div
        className={`absolute z-50 top-0 left-0 w-full h-full md:hidden ${
          events.length > 0 ? 'bg-red-800/10' : ''
        } ${events.every((e) => e.filled) ? 'grayscale' : ''}`}
      >
        {events.length > 0 && mode == 'view' && (
          <Link
            href={`?modal=events&date=${format(date, 'yyyy-MM-dd:hh:mm:ss')}`}
            className={`absolute z-50 top-0 left-0 w-full h-full bg-red-800/10 rounded-lg ${
              events.every((e) => e.filled) ? 'grayscale' : ''
            }`}
          />
        )}
      </div>
    </div>
  )
}
