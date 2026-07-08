"use client";

import { Badge } from "@/components/ui/badge";
import { ProjectType } from "@/types/project.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTableRowActions } from "./data-table-row-actions";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// This type is used to define the shape of our data.

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Image
          src={
            process.env.NEXT_PUBLIC_SUPABASE_URL +
              "/storage/v1/object/public/" +
              row.original.imageFullPath! || "/placeholder.svg"
          }
          height={64}
          width={64}
          alt="Property picture"
          className="aspect-square rounded-md object-cover"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <div>
        <div className="text-gray-900 dark:text-white">
          {row.original.firstName} {row.original.lastName}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {row.original.address}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "state",
    header: "Statut",
    cell: ({ row }) => (
      <Badge
        variant={row.original.state}
        className="mt-4 mb-4 text-gray-900 dark:text-white text-center"
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
      <span className="text-gray-900 dark:text-white">
        {row.original.costEstimation?.withoutAid
          ? `${Math.round(row.original.costEstimation?.withoutAid).toLocaleString("fr-FR")}€`
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Auteur",
    cell: ({ row }) => (
      <span className="text-gray-900 dark:text-white">{`${row.original.firstName} ${row.original.lastName}`}</span>
    ),
    meta: { responsiveHidden: true },
  },
  {
    accessorKey: "date",
    header: "Crée le",
    cell: ({ row }) => (
      <span className="text-gray-900 dark:text-white">
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString("fr-FR")
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "energyMixChoice",
    header: "Energy",
    cell: ({ row }) =>
      row.original.energyMixChoice ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
