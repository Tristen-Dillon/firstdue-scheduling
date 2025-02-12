'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useUser } from '@/providers/user-provider'
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
import { useQueryState } from 'nuqs'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
const formSchema = z.object({
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

export default function ProfileDialog() {
  const { user } = useUser()
  const [modal, setModal] = useQueryState('modal')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email,
      firstName: user?.collection === 'clients' ? user?.firstName : '',
      lastName: user?.collection === 'clients' ? user?.lastName : '',
      address: user?.collection === 'clients' ? user?.address : '',
      phone: user?.collection === 'clients' ? user?.phone : '',
      subscribed: user?.collection === 'clients' ? (user?.subscribed ?? false) : true,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user?.collection !== 'clients') {
      return
    }
    const values = user

    values.email = data.email.toLowerCase()
    values.firstName = data.firstName
    values.lastName = data.lastName
    values.address = data.address
    values.phone = data.phone
    values.fullName = `${data.firstName} ${data.lastName}`
    const res = await fetch(`/api/clients/${user?.id}`, {
      method: 'PATCH',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      setModal(null)
      toast.success('Profile updated')
    } else {
      toast.error('Failed to update profile')
    }
  }

  if (!modal) return null

  return (
    <Dialog open={modal === 'profile'} onOpenChange={() => setModal(null)}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className="border-b border-border px-6 py-4 text-base">
                Edit profile
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
                          <FormDescription>
                            Whether you want to receive emails from us.
                          </FormDescription>
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
      </DialogContent>
    </Dialog>
  )
}
