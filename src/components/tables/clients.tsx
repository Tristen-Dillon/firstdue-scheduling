'use client'

import type { Client } from '@/payload-types'
import { DataTable } from '../ui/data-table'
import { clientColumns } from './columns/clients-columns'
import EditClientSheet from '../edit-client-sheet'
import { useState } from 'react'
import CreateClientSheet from '../create-client-sheet'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DataTableProvider } from '@/providers/datatable-provider'
import BulkClientAction from './bulk-client-action'
export default function ClientsTable({ clients }: { clients: Client[] }) {
  const tableButtons = [
    <Link href="?modal=create-client" key="create-client">
      <Button variant="outline">Create Client</Button>
    </Link>,
  ]

  return (
    <div className="container mx-auto py-10">
      <DataTableProvider data={clients}>
        <DataTable columns={clientColumns} selectionActionButton={BulkClientAction} tableButtons={tableButtons} />
        <EditClientSheet />
        <CreateClientSheet />
      </DataTableProvider>
    </div>
  )
}
