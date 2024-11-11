"use client";

import { Badge } from "@/components/ui/badge";
import { ProjectType } from "@/contexts/dashboard.context";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTableRowActions } from "./data-table-row-actions";

// This type is used to define the shape of our data.

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={"/placeholder.svg"}
        height={64}
        width={64}
        alt="Property picture"
        className="aspect-square rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div>
        <div>{row.original.name}</div>
        <div className="text-sm text-gray-500">{row.original.address}</div>
      </div>
    ),
  },
  {
    accessorKey: "state",
    header: "Statut",
    cell: ({ row }) => (
      <Badge
        variant={row.original.state}
        className="mt-4 mb-4 text-black text-center"
      >
        {row.original.state === "completed" ? "Terminé" : "En cours..."}
      </Badge>
    ),
  },
  {
    accessorFn: (row) =>
      row.costEstimation?.withoutAid?.toLocaleString("fr-FR"),
    header: "Cout total",
    cell: ({ row }) => (
      <span>
        {row.original.costEstimation?.withoutAid?.toLocaleString("fr-FR")}€
      </span>
    ),
  },
  {
    accessorKey: "authorName",
    header: "Auteur",
    cell: ({ row }) => <span>{row.original.authorName}</span>,
    meta: { responsiveHidden: true },
  },
  {
    accessorKey: "date",
    header: "Crée le",
    cell: ({ row }) => (
      <span>
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString("fr-FR")
          : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
