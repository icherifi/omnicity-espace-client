import { ProjectType } from '@/types/project.types';

interface FinancialAidProps {
  project: ProjectType;
}

export const FinancialAid = ({ project }: FinancialAidProps) => {
  const totalAides = project.energyMixChoice?.montantAides!;
  const resteACharge = project.energyMixChoice?.resteACharge!;

  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-2xl font-bold text-[#0a1f33]">Aides</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm font-medium text-gray-500">JUSQU'À</div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fef9c3]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v12M6 12h12" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#eab308" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(totalAides).toLocaleString()} €</div>
            <div className="text-sm text-gray-500">Cumul des subventions</div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm font-medium text-gray-500">RESTE À CHARGE</div>

          <div className="flex items-center justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dbeafe]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v12M6 12h12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(resteACharge!).toLocaleString()} €</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 