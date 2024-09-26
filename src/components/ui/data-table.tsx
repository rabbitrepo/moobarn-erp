'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "./button"
import Link from 'next/link'
import { ChevronRight, ChevronLeft } from "lucide-react"
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {

  //Row
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({})

  const selectedRowIndices = Object.keys(rowSelection).map(Number)

  const selectedRow = selectedRowIndices
    .filter(index => index >= 0 && index < data.length)
    .map(index => data[index] as any);

    const totalAmount = selectedRow.reduce((total: number, item: any) => total + item.amount, 0);

  //React Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection
    }
  })

  return (
    <div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell: any) => (
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
      </div>

      {/* Pagination & Total */}
      <div className="flex justify-center items-center space-x-2 py-4">

        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            table.previousPage()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            table.nextPage()
          }}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        <div className="pl-8 text-muted-foreground">
          ยอดชำระ {totalAmount} บาท
        </div>

      </div>

      <div className="flex justify-center items-center space-x-8">
        <Link href="/payment">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" /> กลับ
          </Button>
        </Link>

        <Link href={totalAmount === 0 ? "" : `/payment/select/checkout?${new URLSearchParams({
          totalAmount: totalAmount
        })}`}>
          <Button variant={totalAmount == 0 ? "secondary" : "default"} className="pointer-events-none hover:disabled">
            ต่อไป <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
