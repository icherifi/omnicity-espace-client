"use client";

import { Badge } from "@/components/ui/badge";
import { ProjectType } from "@/contexts/projects.context";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DataTableRowActions } from "./data-table-row-actions";
import { useEffect, useState } from "react";
import { getProjectImages } from "@/utils/handleProjectDetails";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

// This type is used to define the shape of our data.

export const columns: ColumnDef<ProjectType>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const [imageUrl, setImageUrl] = useState("/placeholder.svg");

      useEffect(() => {
        const fetchImage = async () => {
          try {
            const images = await getProjectImages(row.original.id);
            console.log("images", images);
            if (images.length > 0) {
              const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${row.original.id}/${images[0].name}`;
              console.log("imageUrl", imageUrl);
              setImageUrl(imageUrl);
            }
          } catch (error) {
            console.error("Error fetching images:", error);
          }
        };

        fetchImage();
      }, [row.original.id]);

      return (
        <Image
          src={imageUrl}
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
    accessorKey: "id_bouquet",
    header: "Energy",
    cell: ({ row }) =>
      row.original.id_bouquet ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500" />
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
