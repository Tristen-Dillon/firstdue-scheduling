'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Sidebar,
  SidebarBody,
  SidebarButton,
  SidebarLink,
  SidebarLinkGroupLabels,
} from '@/components/ui/sidebar'
import { Home, Calendar, PanelRightClose, LogOut, User } from 'lucide-react'
import { cn, logout } from '@/lib/utils'
import { useUser } from './user-provider'

interface SidebarProviderProps {
  children: React.ReactNode
}

interface SidebarContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = createContext<SidebarContextType>({
  open: false,
  setOpen: () => {},
})

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error('NEXT_PUBLIC_SITE_URL is not set')
}

export default function SidebarProvider({ children }: SidebarProviderProps) {
  const { user } = useUser()
  const linkGroups = [
    {
      label: 'Essentials',
      links: [
        {
          label: 'Home',
          href: process.env.NEXT_PUBLIC_SITE_URL!,
          icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: 'Schedule',
          href: '/',
          icon: (
            <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
      ],
    },
    {
      label: 'Customization',
      links: [
        {
          label: 'Profile',
          href: '/profile',
          icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
        },
        {
          label: 'My Events',
          href: '/my-events',
          icon: (
            <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
      ],
    },
  ]
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open && e.key === 'Escape') {
        setOpen(false)
      }
      if (e.key === '/' && e.ctrlKey) {
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown, { signal: abortController.signal })

    return () => {
      abortController.abort()
    }
  }, [open])

  return (
    <div
      className={cn(
        'rounded-md scroll-container flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen',
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody
          className="justify-between gap-10"
          style={{
            cursor: !open ? 'pointer' : 'default',
          }}
          onClick={() => {
            if (!open) {
              setOpen(true)
            }
          }}
        >
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mt-8 flex flex-col">
              <SidebarButton
                className="mb-10 w-full"
                icon={
                  <PanelRightClose
                    className={`text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 transition-all ${open ? 'rotate-180' : 'rotate-0'}`}
                  />
                }
                onClick={() => {
                  setOpen(!open)
                }}
              >
                <div className="flex w-full justify-between gap-2">
                  <p>Close Sidebar</p>
                  <p className="uppercase text-sm font-semibold text-gray-500 mr-2">CTRL + /</p>
                </div>
              </SidebarButton>
              <div className={`flex flex-col ${!open ? 'gap-2' : 'gap-10'}`}>
                {linkGroups.map((linkGroup, idx) => (
                  <SidebarLinkGroupLabels key={idx} label={linkGroup.label}>
                    {linkGroup.links.map((link, idx) => (
                      <SidebarLink key={idx} link={link} />
                    ))}
                  </SidebarLinkGroupLabels>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SidebarButton
              icon={<LogOut className="text-neutral-700 dark:text-neutral-200" />}
              onClick={() => {
                logout(user)
              }}
            >
              Logout
            </SidebarButton>
          </div>
        </SidebarBody>
      </Sidebar>
      <SidebarContext.Provider value={{ open, setOpen }}>
        <div className="flex flex-1">
          <div className="overflow-y-auto scroll-container p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
            {children}
          </div>
        </div>
      </SidebarContext.Provider>
    </div>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
