import React, { useState } from 'react';

const FormPage: React.FC = () => {
  const [dpe, setDpe] = useState('');
  const [error, setError] = useState(false);

  const dpeRegex = /^[0-9A-Z]{13}$/;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpeRegex.test(dpe)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="flex flex-col items-start gap-6 pt-8 pl-8 z-10 relative">
        <div className="w-[600px] max-w-full p-6 rounded-xl bg-gray-50 shadow border border-gray-200">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">📋</span>
            <h2 className="m-0 font-bold text-2xl">Pourquoi renseigner votre numéro DPE ?</h2>
          </div>
          <div className="text-gray-500 text-sm mb-3">
            DPE (Diagnostic de Performance Énergétique)
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-base text-gray-800">
            Le numéro DPE nous permet de récupérer automatiquement les informations énergétiques officielles de votre bien (consommation, émission de CO₂, recommandations de travaux, etc.).<br /><br />
            Cela nous aide à vous proposer une rénovation plus précise, plus éco-performante, et conforme à la législation actuelle.<br /><br />
            <span role="img" aria-label="clé">🔑</span> Pas d'inquiétude : ce numéro est public et ne donne pas accès à vos données personnelles.<br />
            <span role="img" aria-label="loupe">🔎</span> Vous le trouverez sur le rapport DPE ou sur l'annuaire des DPE de l'ADEME.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-[480px] max-w-full bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-2 mt-2">
          <h3 className="font-bold text-2xl mb-4">Entrez votre numéro DPE</h3>
          <input
            type="text"
            placeholder="Numéro DPE"
            value={dpe}
            onChange={e => setDpe(e.target.value.toUpperCase())}
            className="w-full p-3 rounded-md border border-gray-300 text-lg mb-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            maxLength={13}
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-md px-7 py-2 font-semibold text-lg transition-colors"
          >
            Soumettre
          </button>
          {error && (
            <div className="text-red-600 text-sm mt-1">
              *Le numéro DPE fourni n'est pas valide
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormPage;
