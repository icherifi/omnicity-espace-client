import { getEnergyLabelColor } from '../utils';
import { ProjectType } from "@/contexts/projects.context";

interface CurrentConditionProps {
  currentProjectDisplayed: ProjectType;
}

export const CurrentCondition = ({ currentProjectDisplayed }: CurrentConditionProps) => (
  <div className="bg-gray-50 mb-8 rounded-2xl p-4 sm:p-6">
    <h2 className="text-xl text-center font-bold mb-6">
      Condition actuelle de votre habitation
    </h2>
    <div className="flex justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Étiquette énergétique</h3>
        <div className="flex items-center gap-4">
          <div className={`text-white font-bold px-4 py-2 rounded ${getEnergyLabelColor(currentProjectDisplayed.actualEnergyRating)}`}>
            {currentProjectDisplayed.actualEnergyRating}
          </div>
          <div>
            <p>{currentProjectDisplayed.iziResponse?.CEP} à {currentProjectDisplayed.iziResponse!.CEP + 89} kwh/m2/an</p>
            <p>{currentProjectDisplayed.iziResponse?.EGES} à {currentProjectDisplayed.iziResponse!.EGES + 29} kgCO2/m2/an</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Confort</h3>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{currentProjectDisplayed.iziResponse?.confort === 2 ? "😊" : "😔"}</span>
          <span>Confort {currentProjectDisplayed.iziResponse?.confort === 2 ? "bien" : "moyen"}</span>
        </div>
      </div>
    </div>
  </div>
); 