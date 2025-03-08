import React from 'react'
import { getPayload } from 'payload'
import config from '@/payload.config'
import EventsTable from '@/components/tables/events'

interface EventsPageProps {
  searchParams: Promise<{
    page?: number
  }>
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { page } = await searchParams

  const eventsResult = await payload.find({
    collection: 'events',
    limit: 1,
    page: page ? page - 1 : 0,
  })
  const events = eventsResult.docs

  return (
    <div>
      <EventsTable events={events} />
    </div>
  )
}
