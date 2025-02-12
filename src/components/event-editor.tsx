'use client'

import { useCalendar } from '@/providers/calendar-provider'
import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import AddEventForm from './add-event-form'

export default function EventEditor() {
  const { mode, state } = useCalendar()

  if (mode === 'view') {
    return null
  }
  const { selectedDates } = state

  if (selectedDates.length === 0) {
    return null
  }

  return (
    <>
      <DesktopEventEditor />
      <MobileEventEditor />
    </>
  )
}

function DesktopEventEditor() {
  const { state } = useCalendar()
  const { selectedDates } = state
  const { setSelectedDates } = state

  const isVisible = selectedDates.length > 0

  return (
    <motion.div
      layout
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: isVisible ? '100%' : 0, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="hidden md:flex max-w-xl w-full h-full bg-background border-border border rounded-md"
    >
      <div className="absolute top-2 right-2">
        <Button variant="outline" size="icon" onClick={() => setSelectedDates([])}>
          <X />
        </Button>
      </div>
      <div className="p-4">
        <AddEventForm />
      </div>
    </motion.div>
  )
}

function MobileEventEditor() {
  const { state } = useCalendar()
  const { setSelectedDates } = state

  return (
    <div className="absolute top-0 left-0 w-full h-full rounded-md z-50 flex md:hidden bg-blue-500">
      <div className="absolute top-2 right-2">
        <Button variant="outline" size="icon" onClick={() => setSelectedDates([])}>
          <X />
        </Button>
      </div>
    </div>
  )
}
