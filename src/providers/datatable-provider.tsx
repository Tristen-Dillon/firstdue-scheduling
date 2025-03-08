'use client'

import React from 'react'
import { createContext, useContext } from 'react'

interface DataTableProviderProps<T> {
  children: React.ReactNode
  data: T[]
}
interface DataTableProviderState<T> {
  data: T[]
  setData: React.Dispatch<React.SetStateAction<T[]>>
}
export const DataTableContext = createContext<DataTableProviderState<any> | null>(null)

export function DataTableProvider<T>({ children, data }: DataTableProviderProps<T>) {
  const [dataState, setDataState] = React.useState<T[]>(data)
  return (
    <DataTableContext.Provider value={{ data: dataState, setData: setDataState }}>
      {children}
    </DataTableContext.Provider>
  )
}

export function useDataTable<T>() {
  const context = useContext(DataTableContext)
  if (context === null) {
    throw new Error('useDataTable must be used within a DataTableProvider')
  }
  return context as DataTableProviderState<T>
}
