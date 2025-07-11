import { ProjectType } from '@/types/project.types';
import Image from 'next/image';
import { getAidCategoryInfo, getTauxForGain, getIncomeLimit } from './utils';

interface FinancialAidProps {
  project: ProjectType;
}

export const FinancialAid = ({ project }: FinancialAidProps) => {
  const totalAides = project.energyMixChoice?.montantAides!;
  const resteACharge = project.energyMixChoice?.resteACharge!;
  const category = project.energyMixChoice?.categoriesAides?.toLowerCase() || 'bleu';
  const catInfo = getAidCategoryInfo(category);

  const gainClasses = (project.energyMixChoice as any)?.gainClasses || 2;
  const gainGroup = gainClasses >= 4 ? 4 : gainClasses === 3 ? 3 : 2;
  const tauxInfo = getTauxForGain(catInfo, gainGroup);

  const persons = parseInt((project as ProjectType).features?.householdSize ?? '2',10) || 2;
  const incomeLimit = getIncomeLimit(catInfo, persons);

  return (
    <div className="w-full border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 rounded-2xl bg-green-50 dark:bg-green-900/20 flex flex-col items-center justify-between p-8 min-h-[240px]">
        <div className="w-full flex flex-col items-center">
          <span className="text-gray-600 dark:text-gray-300 font-semibold text-lg mb-2 w-full text-left">Aides publiques</span>
          <Image src="/aidleft.svg" alt="Aides" width={80} height={80} className="mb-4" />
          <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{Math.round(totalAides).toLocaleString()}€</div>
          {tauxInfo && (
            <div className="w-full text-center text-gray-700 dark:text-gray-300 text-base mt-2 mb-0">
              {tauxInfo.taux}% jusqu'à {tauxInfo.plafond.toLocaleString()}€ (gain {tauxInfo.gain} classes DPE)
            </div>
          )}
          {catInfo && (
            <div className="w-full text-center text-xs text-gray-500 dark:text-gray-400 mt-1">Le montant total des aides ≤ {catInfo.maxAidPercent}% du coût total TTC</div>
          )}
        </div>
      </div>

      <div
        className="flex-1 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex flex-col items-center justify-between p-8 min-h-[240px]"
      >
        <div className="w-full flex flex-col items-center">
          <span className="font-semibold text-lg mb-2 w-full text-left text-gray-900 dark:text-white">Reste à charge</span>
          <Image src="/aidright.svg" alt="Financement" width={80} height={80} className="mb-4" />
          <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">{Math.round(resteACharge).toLocaleString()}€</div>
          {catInfo && (
            <div className="w-full text-center text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-2">
              <div className="font-semibold">Catégorie d'aide : {catInfo.label}</div>
              {incomeLimit && (
                <div>Revenus fiscaux ≤ {incomeLimit.toLocaleString()}€ ({persons} pers.)</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 