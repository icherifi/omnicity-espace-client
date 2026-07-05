import { ProjectType } from "@/types/project.types";

interface DocumentHeaderProps {
  currentProjectDisplayed: ProjectType;
}

export const DocumentHeader = ({
  currentProjectDisplayed,
}: DocumentHeaderProps) => (
  <div className="w-full bg-violet-500 text-white p-6 flex justify-between items-start">
    <div className="w-32">
      <img
        src="/logo.png"
        alt="Omnicity"
        className="w-[40px] h-[40px] object-contain"
      />
    </div>
    <div className="space-y-1 text-sm">
      <div className="flex gap-2">
        <span className="font-bold">Adresse :</span>
        <span>{currentProjectDisplayed?.address}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">Année de construction :</span>
        <span>Non renseigné</span>
      </div>
    </div>
  </div>
);
