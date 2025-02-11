import { AdminOnly } from '@/access/AdminOnly'
import { UserAuthenticated } from '@/access/UserAuthenticated'
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    read: UserAuthenticated,
    create: AdminOnly,
    update: AdminOnly,
    delete: AdminOnly,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'startTime',
      type: 'number',
      required: true,
    },
    {
      name: 'endTime',
      type: 'number',
      required: true,
    },
    {
      name: 'filled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'filledBy',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: false,
    },
  ],
}
