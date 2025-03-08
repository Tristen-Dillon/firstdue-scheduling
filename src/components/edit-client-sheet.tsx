'use client'

import type { Client } from '@/payload-types'

import { Sheet, SheetContent } from './ui/sheet'
import { parseAsInteger, useQueryState } from 'nuqs'
import ClientForm from './client-form'
import { useDataTable } from '@/providers/datatable-provider'

export default function EditClientSheet() {
  const { data: clients, setData: setClients } = useDataTable<Client>()
  const [client, setClient] = useQueryState('client', parseAsInteger)
  const selectedClient = clients.find((c) => c.id === client)

  if (!client || !selectedClient) return null

  const onSubmitCallback = () => {
    setClients((prevClients) =>
      prevClients.map((c) => (c.id === selectedClient.id ? selectedClient : c)),
    )
    setClient(null)
  }

  return (
    <Sheet open={!!client} onOpenChange={() => setClient(null)}>
      <SheetContent>
        <ClientForm
          client={selectedClient}
          onSubmitCallback={onSubmitCallback}
          dialogHeader={'Edit Client'}
          type="edit"
        />
      </SheetContent>
    </Sheet>
  )
}
