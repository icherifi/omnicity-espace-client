"use client"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useProjectsContext } from "@/contexts/projects.context"

export default function ProjectsDataTable(props: {
    onlyInProgress?: boolean,
    onlyCompleted?: boolean
}) {
  const { projects } = useProjectsContext()

  return (
      <DataTable columns={columns} data={projects} onlyCompleted={props.onlyCompleted} onlyInProgress={props.onlyInProgress} />
  )
}
