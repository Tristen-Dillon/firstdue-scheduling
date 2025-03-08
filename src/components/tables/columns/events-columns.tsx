'use client'

import type { Client } from '@/payload-types'
import { ColumnDef } from '@tanstack/react-table'
import ClientActions from '../client-actions'
import { DataTableColumnHeader } from '@/components/ui/column-header'
import { selectDef } from '@/components/ui/select-def'

export const clientColumns: ColumnDef<Client>[] = [
  selectDef<Client>(),
  {
    id: 'Full Name',
    accessorKey: 'firstName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="First Name" />,
  },
  {
    id: 'Last Name',
    accessorKey: 'lastName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Name" />,
  },
  {
    id: 'Email',
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    id: 'Phone',
    accessorKey: 'phone',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      const phone = row.original.phone
      const formatted = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      return <span>{formatted}</span>
    },
  },
  {
    id: 'Address',
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
  },
  {
    id: 'Subscribed',
    accessorKey: 'subscribed',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subscribed" />,
  },
  {
    id: 'Actions',
    accessorKey: 'actions',
    header: () => <div className="w-full flex items-center justify-center">Actions</div>,
    cell: ({ row }) => {
      return <ClientActions client={row.original} />
    },
    enableHiding: false,
    enableSorting: false,
  },
]
