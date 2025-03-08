'use client'

import type { Client } from '@/payload-types'

import { Sheet, SheetContent } from './ui/sheet'
import { useQueryState } from 'nuqs'
import ClientForm from './client-form'
import { useDataTable } from '@/providers/datatable-provider'

export default function CreateClientSheet() {
  const { setData: setClients } = useDataTable<Client>()
  const [modal, setModal] = useQueryState('modal')

  if (!modal || modal !== 'create-client') return null

  const onSubmitCallback = (client: Client) => {
    setClients((prevClients) => [...prevClients, client])
    setModal(null)
  }

  return (
    <Sheet open={!!modal} onOpenChange={() => setModal(null)}>
      <SheetContent>
        <ClientForm
          onSubmitCallback={onSubmitCallback}
          dialogHeader={'Create Client'}
          type="create"
        />
      </SheetContent>
    </Sheet>
  )
}
