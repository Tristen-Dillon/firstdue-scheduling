import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl } from './ui/form'
import { Input } from './ui/input'
import { TimePicker12Demo } from './timer-picker-demo'
import { Button } from './ui/button'
import { useCalendar } from '@/providers/calendar-provider'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
  startTime: z.date(),
  endTime: z.date(),
})

export default function EventForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { state, functions } = useCalendar()
  const { selectedDates } = state
  const { addEvent } = functions
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      startTime: new Date(),
      endTime: new Date(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    for (const date of selectedDates.sort((a, b) => a.getTime() - b.getTime())) {
      const res = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({
          title: values.title,
          date,
          startTime: values.startTime.getTime(),
          endTime: values.endTime.getTime(),
          filled: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        console.error('Failed to add event')
        toast.error('Failed to add event')
        continue
      }
      const data = await res.json()
      console.log(data)
      addEvent(data.doc)
    }
    toast.success('Events added')
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Event title" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <TimePicker12Demo date={field.value} setDate={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <TimePicker12Demo date={field.value} setDate={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            Add event
          </Button>
        </div>
      </form>
    </Form>
  )
}
