import { ProjectType } from "@/contexts/projects.context";

interface DocumentHeaderProps {
  currentProjectDisplayed: ProjectType;
}

export const DocumentHeader = ({ currentProjectDisplayed }: DocumentHeaderProps) => (
  <div className="w-full bg-violet-500 text-white p-6 flex justify-between items-start">
    <div className="w-32">
      <img
        src={`${window.location.origin}/logo.png`}
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
        <span>{currentProjectDisplayed?.iziResponse?.inputQr?.["L'année de construction du logement :"]?.[0]}</span>
      </div>
    </div>
  </div>
); 