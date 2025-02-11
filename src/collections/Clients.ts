import { AdminOnly } from '@/access/AdminOnly'
import { ClientOrAdmin } from '@/access/ClientOrAdmin'
import type { CollectionConfig } from 'payload'
import type { Client } from '@/payload-types'
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY || !process.env.NEXT_PUBLIC_RESEND_AUDIENCE_ID) {
  throw new Error('RESEND_API_KEY and NEXT_PUBLIC_RESEND_AUDIENCE_ID must be set')
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'fullName',
  },
  access: {
    read: ClientOrAdmin,
    create: AdminOnly,
    update: ClientOrAdmin,
    delete: AdminOnly,
  },
  auth: true,
  fields: [
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
      name: 'email',
      type: 'email',
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
        console.log('originalDoc', originalDoc)
        console.log('newDoc', newDoc)
        newDoc.fullName = `${newDoc.firstName} ${newDoc.lastName}`
        const shouldUpdateResend =
          originalDoc.fullName !== newDoc.fullName || originalDoc.email !== newDoc.email
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
}
