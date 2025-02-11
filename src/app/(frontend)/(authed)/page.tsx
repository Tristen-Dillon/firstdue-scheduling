import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Calendar from '@/components/calendar'
import { CalendarProvider } from '../../../providers/calendar-provider'
import SidebarProvider from '../../../providers/sidebar-provider'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const eventsResults = await payload.find({
    collection: 'events',
  })
  const events = eventsResults.docs

  return (
    <div className="w-full h-full">
      <SidebarProvider>
        <CalendarProvider events={events}>
          <Calendar />
        </CalendarProvider>
      </SidebarProvider>
    </div>
  )
}
