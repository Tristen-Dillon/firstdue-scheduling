'use client'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import PhoneInput from '@/components/ui/phone-input'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from 'zod'
import type { Client } from '@/payload-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  phone: z
    .string()
    .min(1, { message: 'Phone is required' })
    .refine(
      (val) => {
        const cleaned = val.replace(/\D/g, '')
        return cleaned.length === 10
      },
      {
        message: 'Invalid Phone Number',
      },
    ),
  subscribed: z.boolean(),
})

interface ClientFormProps {
  client?: Client
  onSubmitCallback?: (client: Client) => void
  dialogHeader: string
  type: 'create' | 'edit'
}

export default function ClientForm({
  client,
  onSubmitCallback,
  dialogHeader,
  type,
}: ClientFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: client?.username ?? '',
      email: client?.email ?? '',
      firstName: client?.firstName ?? '',
      lastName: client?.lastName ?? '',
      address: client?.address ?? '',
      phone: client?.phone ?? '',
      subscribed: client?.subscribed ?? true,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const values = client
    let res: Response
    if (values && type === 'edit') {
      values.email = data.email.toLowerCase()
      values.firstName = data.firstName
      values.lastName = data.lastName
      values.address = data.address
      values.phone = data.phone
      values.fullName = `${data.firstName} ${data.lastName}`
      values.subscribed = data.subscribed
      res = await fetch(`/api/clients/${client?.id}`, {
        method: 'PATCH',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } else {
      res = await fetch('/api/clients/new', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    }
    if (res.ok) {
      if (onSubmitCallback) {
        const client = await res.json()
        onSubmitCallback(client)
      }
      toast.success('Profile updated')
    } else {
      toast.error('Failed to update profile')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            {dialogHeader}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-4">
            <div className="flex flex-col gap-4 ">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input disabled={type === 'edit'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="subscribed"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Subscribed</FormLabel>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </div>
                      <FormDescription>Whether you want to receive emails from us.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
