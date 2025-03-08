import { getPayload } from 'payload'
import React, { Suspense } from 'react'

import config from '@/payload.config'
import Calendar from '@/components/calendar'
import { CalendarProvider } from '@/providers/calendar-provider'
import EventEditor from '@/components/event-editor'
import EventsModal from '@/components/events-modal'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const eventsResults = await payload.find({
    collection: 'events',
    limit: 1000,
  })
  const events = eventsResults.docs

  return (
    <Suspense fallback={null}>
      <CalendarProvider events={events}>
        <Calendar />
        <EventEditor />
        <EventsModal />
      </CalendarProvider>
    </Suspense>
  )
}
