import { AdminOnly } from '@/access/AdminOnly'
import { UserAuthenticated } from '@/access/UserAuthenticated'
import type { Client } from '@/payload-types'
import type { CollectionConfig, PayloadRequest } from 'payload'

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
  endpoints: [
    {
      path: '/:id/fill',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        const user = req.user
        if (!user) {
          return new Response('Unauthorized', { status: 401 })
        }
        if (user.collection === 'admins') {
          return new Response('Admins cannot fill events', { status: 401 })
        }
        const id = req.routeParams?.id
        const event = await req.payload.findByID({
          collection: 'events',
          id: id as string,
        })
        if (!event) {
          return new Response('Event not found', { status: 404 })
        }
        event.filled = true
        event.filledBy = user.id
        const updatedEvent = await req.payload.update({
          collection: 'events',
          id: id as string,
          data: event,
        })

        return new Response(
          JSON.stringify({
            message: 'Event Filled',
            doc: updatedEvent,
          }),
          { status: 200 },
        )
      },
    },
    {
      path: '/:id/unfill',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        const user = req.user

        if (!user) {
          return new Response('Unauthorized', { status: 401 })
        }
        const id = req.routeParams?.id
        const event = await req.payload.findByID({
          collection: 'events',
          id: id as string,
        })

        if (!event) {
          return new Response('Event not found', { status: 404 })
        }

        if (user.collection !== 'admins') {
          if ((event.filledBy as Client).id !== user.id) {
            return new Response('You are not allowed to unfill this event', {
              status: 401,
            })
          }
        }

        event.filled = false
        event.filledBy = null

        const updatedEvent = await req.payload.update({
          collection: 'events',
          id: id as string,
          data: event,
        })

        return new Response(
          JSON.stringify({
            message: 'Event Unfilled',
            doc: updatedEvent,
          }),
          { status: 200 },
        )
      },
    },
  ],
}
