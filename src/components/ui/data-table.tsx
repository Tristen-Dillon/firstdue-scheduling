'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  type Row,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import React from 'react'
import { Input } from './input'
import { DataTableViewOptions } from './column-toggle'
import { DataTablePagination } from './pagination'
import { useDataTable } from '@/providers/datatable-provider'
import type { Client } from '@/payload-types'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  tableButtons?: React.ReactNode[]
  selectionActionButton?: ({ selectedRows }: { selectedRows: Row<TData>[] }) => React.ReactNode
  // selectionActionButton?: React.ReactElement<{
  //   selectedRows: Row<TData>[]
  // }>
}

export function DataTable<TData, TValue>({
  columns,
  tableButtons,
  selectionActionButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const { data: clients } = useDataTable<any>()

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between py-4 px-4">
        <div className="flex w-full items-center justify-between gap-2">
          <Input
            placeholder="Filter all columns..."
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm flex-grow"
          />
          <div className="mr-2">
            {typeof selectionActionButton === 'function'
              ? selectionActionButton({
                  selectedRows: table.getFilteredSelectedRowModel().rows,
                })
              : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tableButtons?.map((button) => button)}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="py-4 px-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
