'use client'

import { useCalendar } from '@/providers/calendar-provider'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import AddEventForm from './add-event-form'
import useDebounce from '@/hooks/use-debounce'

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
  const {
    state: { selectedDates, setSelectedDates },
  } = useCalendar()

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant={'outline'}
        className="md:hidden absolute top-12 right-4"
        onClick={() => setIsOpen(true)}
      >
        Edit Selected
      </Button>
      {isOpen && (
        <div className="absolute top-0 left-0 w-full h-full rounded-md z-50 flex md:hidden bg-background border-border border">
          <div className="absolute top-2 right-2">
            <Button variant="outline" size="icon" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
          </div>
          <div className="p-4">
            <AddEventForm />
          </div>
        </div>
      )}
    </>
  )
}
