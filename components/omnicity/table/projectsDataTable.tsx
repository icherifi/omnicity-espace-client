"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useProjectsContext } from "@/contexts/projects.context";

export default function ProjectsDataTable(props: {
  onlyInProgress?: boolean;
  onlyCompleted?: boolean;
  author?: string | null;
  dateRange?: { from?: Date; to?: Date };
}) {
  const { projects } = useProjectsContext();

  let filteredProjects = projects;
  if (props.onlyInProgress) {
    filteredProjects = filteredProjects.filter(p => p.state !== "completed");
  }
  if (props.onlyCompleted) {
    filteredProjects = filteredProjects.filter(p => p.state === "completed");
  }
  if (props.author) {
    filteredProjects = filteredProjects.filter(
      p => `${p.firstName} ${p.lastName}` === props.author
    );
  }
  if (props.dateRange?.from && props.dateRange?.to) {
    filteredProjects = filteredProjects.filter(p => {
      const created = new Date(p.created_at ?? "");
      return created >= props.dateRange!.from! && created <= props.dateRange!.to!;
    });
  }

  return (
    <DataTable
      columns={columns}
      data={filteredProjects}
      onlyCompleted={props.onlyCompleted}
      onlyInProgress={props.onlyInProgress}
    />
  );
}
