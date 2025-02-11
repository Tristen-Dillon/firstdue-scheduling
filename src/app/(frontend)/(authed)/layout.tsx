import React from 'react'
export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

import { getPayload, type TypedUser } from 'payload'
import { UserProvider } from '@/providers/user-provider'
import { headers } from 'next/headers'
import config from '@/payload.config'
import { redirect } from 'next/navigation'

export default async function AuthLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login')
  }

  return <UserProvider user={user as TypedUser}>{children}</UserProvider>
}
