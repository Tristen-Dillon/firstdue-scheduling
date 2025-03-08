'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useUser } from '@/providers/user-provider'
import { useQueryState } from 'nuqs'
import ClientForm from './client-form'
import type { Client } from '@/payload-types'

export default function ProfileDialog() {
  const [modal, setModal] = useQueryState('modal')
  const { user } = useUser()

  if (!modal || user?.collection !== 'clients') return null

  return (
    <Dialog open={modal === 'profile'} onOpenChange={() => setModal(null)}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <ClientForm
          client={user as Client}
          onSubmitCallback={() => setModal(null)}
          dialogHeader={'Edit Profile'}
          type="edit"
        />
      </DialogContent>
    </Dialog>
  )
}
