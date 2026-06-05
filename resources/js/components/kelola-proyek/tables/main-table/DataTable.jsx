import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
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
import { Checkbox } from "@/components/ui/checkbox"
import { EllipsisIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"



export function DataTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border mb-6">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead>
                <Checkbox />
              </TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-muted-foreground text-xs uppercase font-semibold tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
              <TableHead>
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <TableCell className="py-4">
                  <Checkbox />
                </TableCell>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => {
                      const id = row.original.id;
                      const url = id ? `/detil-proyek/${id}` : "/detil-proyek";
                      router.visit(url);
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="py-4">
                  <DropdownMenu className="w-auto">
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost"><EllipsisIcon className="rotate-90" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto" align="end">
                      <DropdownMenuLabel>Aksi proyek</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link href={row.original.id ? `/detil-proyek/${row.original.id}` : "/detil-proyek"}>
                            <EyeIcon /> Detail proyek
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem><PencilIcon /> Edit proyek</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive"><TrashIcon /> Hapus proyek</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
