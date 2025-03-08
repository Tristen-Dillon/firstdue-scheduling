import React from 'react'
import ClientsTable from '@/components/tables/clients'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function ClientsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const clientsResults = await payload.find({
    collection: 'clients',
    limit: 1000,
  })
  const clients = clientsResults.docs

  return (
    <div>
      <ClientsTable clients={clients} />
    </div>
  )
}
