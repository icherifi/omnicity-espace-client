"use client"

import { Badge } from "@/components/ui/badge";
import { ProjectType } from "@/contexts/dashboard.context";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.

export const columns: ColumnDef<ProjectType>[] = [
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
      accessorKey: "id_bouquet",
      header: "ID bouquet",
      meta: { responsiveHidden: true }
    },
    {
      accessorKey: "id_design",
      header: "ID design",
      meta: { responsiveHidden: true } 
    },
    {
      accessorFn: (row) => (row.costEstimation.withAid + row.costEstimation.withoutAid).toLocaleString('fr-FR'),
      header: "Cout total",
      cell: ({ row }) => (
        <span>{(row.original.costEstimation.withAid + row.original.costEstimation.withoutAid).toLocaleString('fr-FR')}€</span>
      ),
    },
    {
      accessorKey: "costEstimation.withAid",
      header: "Aide totale",
      cell: ({ row }) => (
        <span>{row.original.costEstimation.withAid.toLocaleString('fr-FR')}€</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status} 
          className="mt-4 mb-4 text-black text-center"
        >
          {row.original.status === "completed" ? "Terminé" : "En cours..."}
        </Badge>
      ),
    }
  ];
  
