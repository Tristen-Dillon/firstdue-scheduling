import React from 'react'
export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

import { headers } from 'next/headers'
import config from '@/payload.config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function AuthLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (user) {
    redirect('/')
  }

  return <>{children}</>
}
