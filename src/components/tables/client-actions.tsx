'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Client } from '@/payload-types'
import { useDataTable } from '@/providers/datatable-provider'
import { EllipsisVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface ClientActionsProps {
  client: Client
}

export default function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter()

  const { setData: setClients } = useDataTable<Client>()

  const [deleteLoading, setDeleteLoading] = React.useState(false)
  // const [lockLoading, setLockLoading] = React.useState(false)

  const handleDelete = async () => {
    setDeleteLoading(true)

    try {
      const response = await fetch(`/api/clients/${client.id}`, {
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
        return
      }
      console.error(data)
      toast.error('Error deleting client')
    } catch (error) {
      console.error(error)
      toast.error('Error deleting client')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleLock = () => {
    console.log('lock client')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center w-full h-full">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="children:cursor-pointer">
        <DropdownMenuItem onMouseDown={() => router.push(`?client=${client.id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem disabled={lockLoading}>Lock</DropdownMenuItem> */}
        <DropdownMenuItem disabled={deleteLoading} onClick={handleDelete} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
