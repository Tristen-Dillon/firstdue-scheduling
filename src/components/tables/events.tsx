'use client'

import type { Event } from '@/payload-types'
import { DataTable } from '../ui/data-table'
import { clientColumns } from './columns/clients-columns'
import EditClientSheet from '../edit-client-sheet'
import CreateClientSheet from '../create-client-sheet'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DataTableProvider } from '@/providers/datatable-provider'
export default function EventsTable({ events }: { events: Event[] }) {
  const tableButtons = [
    <Link href="?modal=create-client" key="create-client">
      <Button variant="outline">Create Client</Button>
    </Link>,
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTableProvider data={events}>
        <DataTable columns={clientColumns} tableButtons={tableButtons} />
        
        <CreateClientSheet />
      </DataTableProvider>
    </div>
  )
}
