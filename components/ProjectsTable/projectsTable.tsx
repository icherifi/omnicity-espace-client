"use client"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useProjectsContext } from "@/contexts/projects.context"

export default function ProjectsTable() {

  const { projects } = useProjectsContext()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={projects} />
    </div>
  )
}
