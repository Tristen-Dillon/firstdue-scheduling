import { AdminOnly } from '@/access/AdminOnly'
import { ClientOrAdmin } from '@/access/ClientOrAdmin'
import type { CollectionConfig, PayloadRequest } from 'payload'
import type { Client } from '@/payload-types'
import { Resend } from 'resend'
import crypto from 'crypto'

if (!process.env.RESEND_API_KEY || !process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID) {
  throw new Error('RESEND_API_KEY and NEXT_PUBLIC_RESEND_AUDIENCE_ID must be set')
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  auth: {
    loginWithUsername: {
      allowEmailLogin: false,
      requireEmail: true,
    },
    maxLoginAttempts: 0,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: ClientOrAdmin,
    create: AdminOnly,
    update: ClientOrAdmin,
    delete: AdminOnly,
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'contactId',
      type: 'text',
      required: false,
      access: {
        create: ({ req }) => {
          return req.user?.collection === 'admins'
        },
        update: ({ req }) => {
          return req.user?.collection === 'admins'
        },
      },
    },
    {
      name: 'subscribed',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ originalDoc, req, context }) => {
        const newDoc = req.data as Client
        if (context.ignoreBeforeChange) {
          return newDoc
        }
        newDoc.fullName = `${newDoc.firstName} ${newDoc.lastName}`
        const shouldUpdateResend =
          originalDoc?.fullName !== newDoc?.fullName || originalDoc?.email !== newDoc?.email
        const resend = new Resend(process.env.RESEND_API_KEY)
        if (shouldUpdateResend) {
          if (originalDoc?.contactId) {
            const deleted = await resend.contacts.remove({
              id: originalDoc?.contactId,
              audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
            })
            if (deleted.error) {
              console.error(deleted.error)
            }
          }
          const contact = await resend.contacts.create({
            email: newDoc.email,
            firstName: newDoc.firstName,
            lastName: newDoc.lastName,
            audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
          })
          if (contact.error) {
            console.error(contact.error)
          }
          if (contact.data) {
            newDoc.contactId = contact.data.id
          }
        }
        if (originalDoc?.subscribed !== newDoc.subscribed) {
          await resend.contacts.update({
            id: newDoc.contactId!,
            audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
            unsubscribed: !newDoc.subscribed,
          })
        }
        return newDoc
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          const resend = new Resend(process.env.RESEND_API_KEY)
          const contact = await resend.contacts.create({
            email: doc.email,
            firstName: doc.name,
            lastName: doc.name,
            unsubscribed: !doc.subscribed,
            audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
          })
          if (contact.error) {
            console.error(contact.error)
          }
          if (contact.data) {
            doc.contactId = contact.data.id
          }
          if (doc.firstName && doc.lastName) {
            doc.fullName = `${doc.firstName} ${doc.lastName}`
          }
          setTimeout(async () => {
            await req.payload.update({
              collection: 'clients',
              id: doc.id,
              data: doc,
              context: {
                ignoreBeforeChange: true,
              },
            })
          }, 1000)
          return doc
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.contacts.remove({
          id: doc.contactId,
          audienceId: process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID!,
        })
      },
    ],
  },
  endpoints: [
    {
      path: '/new',
      method: 'post',
      handler: async (req: PayloadRequest) => {
        const user = req.user
        const body = await req.json?.()

        if (!user || user.collection !== 'admins') {
          return new Response('Unauthorized', { status: 401 })
        }

        const { username, email, firstName, lastName, phone, address, subscribed } = body
        const hash = crypto.createHash('sha256')
        hash.update(process.env.PAYLOAD_SECRET + username)
        const password = hash.digest('hex').substring(0, 12)
        const client = await req.payload.create({
          collection: 'clients',
          data: {
            username,
            email,
            firstName,
            lastName,
            phone,
            address,
            subscribed,
            password: password,
          },
          context: {
            ignoreBeforeChange: true,
          },
        })
        return new Response(JSON.stringify(client), { status: 200 })
      },
    },
  ],
}
