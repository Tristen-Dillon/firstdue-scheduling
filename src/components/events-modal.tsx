'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useQueryState } from 'nuqs'
import { useCalendar } from '@/providers/calendar-provider'
import { Event as PayloadEvent, type Client } from '@/payload-types'
import { format } from 'date-fns'
import { Button } from './ui/button'
import { useUser } from '@/providers/user-provider'
import { toast } from 'sonner'
export default function EventsModal() {
  const [modal, setModal] = useQueryState('modal')
  const [id, setId] = useQueryState('id')
  const [date, setDate] = useQueryState('date')
  const { functions, state } = useCalendar()
  const [selectedEvent, setSelectedEvent] = useState<PayloadEvent | null>()

  const [loading, setLoading] = useState(false)
  if (!modal || modal !== 'events') return null
  if (!id && !date) return null
  let events: PayloadEvent[] = []

  if (id) {
    events = state.events.filter((event) => event.id === Number(id))
  } else {
    events = functions.getEventsForDate(new Date(date!))
  }

  const closeModal = () => {
    setModal(null)
    setId(null)
    setDate(null)
  }

  const selectEvent = async (event: PayloadEvent) => {
    setLoading(true)
    const res = await fetch(`/api/events/${event.id}/fill`, {
      method: 'POST',
    })

    if (res.ok) {
      const body = await res.json()
      functions.updateEvent(body.doc)
      closeModal()
      toast.success('Event selected')
    }
    setLoading(false)
  }

  const deselectEvent = async (event: PayloadEvent) => {
    setLoading(true)
    const res = await fetch(`/api/events/${event.id}/unfill`, {
      method: 'POST',
    })

    if (res.ok) {
      const body = await res.json()
      functions.updateEvent(body.doc)
      closeModal()
      toast.success('Event deselected')
    }
    setLoading(false)
  }

  return (
    <Dialog open={modal === 'events'} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        {events.length > 1 ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <Select
              onValueChange={(value) => {
                setSelectedEvent(events.find((event) => event.id === Number(value)) || null)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id.toString()}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <EventDetails
              event={selectedEvent}
              selectEvent={selectEvent}
              deselectEvent={deselectEvent}
              loading={loading}
            />
          </div>
        ) : (
          <EventDetails
            event={events[0]}
            selectEvent={selectEvent}
            deselectEvent={deselectEvent}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function EventDetails({
  event,
  selectEvent,
  deselectEvent,
  loading,
}: {
  event: PayloadEvent | null | undefined
  selectEvent: (event: PayloadEvent) => void
  deselectEvent: (event: PayloadEvent) => void
  loading: boolean
}) {
  const { user } = useUser()
  if (!event) return null
  return (
    <>
      <DialogDescription>
        {event.filled ? (
          <>
            {(event.filledBy as Client).id === user.id ? (
              <>You have already selected {event.title}.</>
            ) : (
              <>{event.title} is already filled.</>
            )}
          </>
        ) : (
          <>
            Would you like to select {event.title}? Between{' '}
            {format(new Date(event.startTime), 'hh:mm a')} and{' '}
            {format(new Date(event.endTime), 'hh:mm a')}
          </>
        )}
      </DialogDescription>
      {!event.filled && (
        <DialogFooter>
          <Button
            disabled={user.collection === 'admins' || loading}
            onClick={() => selectEvent(event)}
          >
            Select
          </Button>
        </DialogFooter>
      )}
      {event.filled && (event.filledBy as Client).id === user.id && (
        <DialogFooter>
          <Button disabled={loading} onClick={() => deselectEvent(event)}>
            Deselect
          </Button>
        </DialogFooter>
      )}
    </>
  )
}
