import React from 'react'
export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="h-screen" suppressHydrationWarning>
      <body className="h-full">
        <main className="h-full">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              {children}
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
