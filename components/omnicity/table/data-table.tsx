"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { ProjectType } from "@/contexts/projects.context";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onlyInProgress?: boolean;
  onlyCompleted?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onlyCompleted,
  onlyInProgress,
}: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = useState<PaginationState>({
    pageSize: 5,
    pageIndex: 0,
  }); // Limite à 5 lignes par page

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: pageSize,
    },
  });

  const { currentProjectDisplayed, setCurrentProjectDisplayed } =
    useDashboardContext();

  useEffect(() => {
    // Fetch data or perform any asynchronous operations here
  }, []);

  return (
    <div className="flex flex-col">
      <div className="rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isHiddenOn2XL = (header.column.columnDef.meta as any)
                    ?.responsiveHidden;
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isHiddenOn2XL ? "hidden min-[1750px]:table-cell" : ""
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    currentProjectDisplayed && 
                    (row.original as { id: string }).id === currentProjectDisplayed.id
                      ? "selected"
                      : undefined
                  }
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setCurrentProjectDisplayed(row.original as ProjectType);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isHiddenOn2XL = (cell.column.columnDef.meta as any)
                      ?.responsiveHidden;
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          isHiddenOn2XL ? "hidden min-[1750px]:table-cell" : ""
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
