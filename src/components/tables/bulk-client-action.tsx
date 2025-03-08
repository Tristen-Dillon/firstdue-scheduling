'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import type { Client } from '@/payload-types'
import type { Row } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { useDataTable } from '@/providers/datatable-provider'
import { toast } from 'sonner'

interface BulkClientActionProps {
  selectedRows: Row<Client>[]
}

export default function BulkClientAction({ selectedRows }: BulkClientActionProps) {
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  const { setData: setClients } = useDataTable<Client>()

  const onDelete = async () => {
    console.log('delete')
    setDeleteLoading(true)

    try {
      for (const row of selectedRows) {
        const response = await fetch(`/api/clients/${row.original.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          const client = data.doc as Client
          setClients((prevClients) => prevClients.filter((c) => c.id !== client.id))
          toast.success('Deleted client')
          continue
        }
        console.error(data)
        toast.error('Error deleting client')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error deleting client')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center justify-center w-full h-full">
        <Button variant={'outline'}>Bulk Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="children:cursor-pointer">
        <DropdownMenuItem
          disabled
          // onMouseDown={() => router.push(`?client=${client.id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem disabled={lockLoading}>Lock</DropdownMenuItem> */}
        <DropdownMenuItem disabled={deleteLoading} onClick={onDelete} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
