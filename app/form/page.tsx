"use client";
import React, { useState } from "react";
import SideNavigation from "./SideNavigation";
import PropertySelector from "./components/PropertySelector";
import InputField from "./components/InputField";
import IncomeSlider from "./components/IncomeSlider";
import QuestionWithOptions from "./components/QuestionWithOptions";
import EnergySourceCard from "./components/EnergySourceCard";
import SelectField from "./components/SelectField";
import { handleSubmit } from "./server-request";
import { useRouter } from "next/navigation";

type HandleResponseType = (questionId: string, response: any) => void;

const votreBienNode = (handleResponse: HandleResponseType) => {
  const householdSizeOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <div className="flex flex-col m-10 p-5 gap-2">
      <PropertySelector
        onChange={(response) => handleResponse("PropertySelector", response)}
      />
      <div className="flex gap-5 items-start self-stretch">
        <InputField
          label="Été construite"
          type="date"
          defaultValue="1956-05-12"
          onChange={(response) => handleResponse("ConstructionDate", response)}
        />
        <InputField
          label="Adresse"
          type="text"
          defaultValue="30, Boulevard Mcdonald"
          onChange={(response) => handleResponse("Address", response)}
        />
        <InputField
          label="Surface habitable (m²)"
          type="number"
          defaultValue="95"
          onChange={(response) =>
            handleResponse("Sa surface habitable (m\u00b2) :", response)
          }
        />
      </div>
      <div className="flex gap-4">
        <IncomeSlider
          onChange={(response) => handleResponse("Income", response)}
        />
        <QuestionWithOptions
          question="Nombre d'habitants composant votre foyer fiscal"
          options={householdSizeOptions}
          selectedOption="10-20 Ans"
          onChange={(response) => handleResponse("HouseholdSize", response)}
        />
      </div>
    </div>
  );
};

const isolationNode = (handleResponse: HandleResponseType) => {
  const isolationOptions = [
    "< 10 Ans",
    "10-20 Ans",
    "20 - 30 Ans",
    "30 - 40 Ans",
  ];
  const windowMaterialOptions = ["Bois/ Bois métal", "PVC", "Aluminium"];

  return (
    <div className="flex flex-col m-10 p-5 gap-2">
      <QuestionWithOptions
        question="Avez - vous dejà effectué des travaux d'isolation de vos murs?"
        options={isolationOptions}
        selectedOption="10-20 Ans"
        onChange={(response) => handleResponse("WallInsulation", response)}
      />
      <QuestionWithOptions
        question="Avez - vous dejà effectué des travaux d'isolation de vos planchers bas?"
        options={isolationOptions}
        selectedOption="10-20 Ans"
        onChange={(response) => handleResponse("FloorInsulation", response)}
      />
      <SelectField
        label="Quel type de vitrage avez-vous?"
        values={["Double vitrage", "Simple vitrage"]}
        onChange={(response) => handleResponse("GlazingType", response)}
      />
      <div className="mt-11 w-full flex gap-5 max-md:flex-col">
        <div className="flex gap-5">
          <div className="flex flex-col">
            <h3 className="text-sm tracking-normal leading-6 text-neutral-700">
              Quel est le matériau de vos fenetre?
            </h3>
            <div className="flex flex-col items-start p-2">
              {windowMaterialOptions.map((option, index) => (
                <div
                  key={option}
                  className={`flex gap-3.5 ${index > 0 ? "mt-4" : ""}`}
                >
                  <input
                    type="radio"
                    id={`windowMaterial${index}`}
                    name="windowMaterial"
                    className="w-6 h-6 rounded-full"
                    defaultChecked={index === 0}
                    onChange={() => handleResponse("WindowMaterial", option)}
                  />
                  {option}
                </div>
              ))}
            </div>
          </div>
          <section className="flex flex-col ml-5 w-3/5 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col">
              <label
                htmlFor="householdMembers"
                className="text-sm tracking-normal leading-6 text-neutral-700"
              >
                Nombre d' habitants composant votre foyer fiscal
              </label>
              <input
                type="number"
                id="householdMembers"
                className="mt-2 p-2 bg-white border border-solid border-neutral-200 rounded shadow-md"
                onChange={(e) =>
                  handleResponse("HouseholdMembers", e.target.value)
                }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const energieNode = (handleResponse: HandleResponseType) => {
  const energySources = [
    {
      name: "Eletricité",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2961978aceb83cde4c5fccd2cf38f0918e0083cd5d747c263b6ceefabe912013?apiKey=74bccfb37e4243edb00646365d401f63&",
    },
    {
      name: "Bois",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/8c3dad654c36135fcd9b0d159425ccc7a0a1412515aa9ecd5cee6c858bbcfd5f?apiKey=74bccfb37e4243edb00646365d401f63&",
    },
    {
      name: "Gaz ou propane",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/59d146521f4ff871c2359fe712cea98341b0d72bf0db7ae10c648c766cb19858?apiKey=74bccfb37e4243edb00646365d401f63&",
    },
    {
      name: "Fioul",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/b1081814d7139589eeb5558e6286c513833c0377cf4a0379fdf357753b086d1e?apiKey=74bccfb37e4243edb00646365d401f63&",
    },
    {
      name: "Charbon",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/c7ec2c75828bc454ef6d50cc8c7adb761f762e73c8118234176e8eeff7373d09?apiKey=74bccfb37e4243edb00646365d401f63&",
    },
  ];
  const heatingDevice = ["Pompe à chaleur air/eau", "Émetteurs électriques"];

  return (
    <section className="flex flex-col m-10 p-5 gap-2">
      <h2 className="text-sm tracking-normal leading-6 text-black">
        Quelle est la source d'énergie de chauffage principale?
      </h2>
      <div className="flex gap-5 justify-between mt-12 text-sm tracking-normal leading-6 text-black max-md:flex-wrap max-md:mt-10">
        <EnergySourceCard
          options={energySources}
          selectedOption="Eletricité"
          onChange={(response) => handleResponse("EnergySource", response)}
        />
      </div>
      <div className="flex gap-5 justify-between items-start mt-6 text-xs leading-4 text-black">
        <QuestionWithOptions
          question="Type de chauffage/chauffe-eau"
          options={heatingDevice}
          selectedOption="Pompe à chaleur air/eau"
          onChange={(response) => handleResponse("HeatingType", response)}
        />
      </div>
      <div className="flex gap-5 self-stretch mt-7 w-full text-sm max-md:flex-wrap max-md:max-w-full">
        <SelectField
          label="Quel appareil produit votre eau chaude sanitaire?"
          values={[
            "Mon systeme de chauffage",
            "Un chauffe-eau electrique",
            "Un chauffe-eau au gaz",
          ]}
          onChange={(response) => handleResponse("WaterHeater", response)}
        />
        <SelectField
          label="Type de ventilation"
          values={[
            "Ventillation naturelle",
            "Ventillation mecanique simple flux",
            "Ventillation mecanique double flux",
          ]}
          onChange={(response) => handleResponse("VentilationType", response)}
        />
      </div>
    </section>
  );
};

const Form = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [responses, setResponses] = useState({
    "Sa surface habitable (m²) :": "50",
    "L'année de construction du logement :": ["Entre 1989 et 2000"],
    "Sa forme :": ["Rectangulaire allongée"],
    "Le nombre de niveaux habités :": ["1"],
    "La maison est-elle mitoyenne ?": ["Non"],
    "Avez-vous déjà effectué des travaux d'isolation de vos murs ?": [
      "Je ne sais pas",
    ],
    "Le type de toiture :": ["Toit terrasse"],
    "Avez-vous déjà effectué des travaux d'isolation de votre toiture ?": [
      "Pas de travaux",
    ],
    "Quel est votre type de planchers bas ?": ["Terre plein"],
    "Avez-vous déjà effectué des travaux d'isolation de vos planchers bas ?": [
      "Je ne sais pas",
    ],
    "Comment est le vitrage de vos fenêtres ?": [
      "Double vitrage ancien (plus de 25 ans)",
    ],
    "Quel est le matériau de vos fenêtres ?": ["Aluminium"],
    "Quelle est la source d'énergie de chauffage principale ?": ["Electricité"],
    "Le type d'appareil de votre chauffage principal :": [
      "Convecteurs électriques",
    ],
    "Quel appareil produit votre eau chaude sanitaire ?": ["Ballon électrique"],
    "Possédez-vous un second type de chauffage ?": ["Non"],
    "Quel est le type de ventilation ?": ["Ventilation naturelle"],
    "Par rapport au logement, vous êtes ?": [
      "Propriétaire résidence principale",
    ],
    "Vous habitez": ["En Ile de France"],
    "Nombre d'habitants composant votre foyer fiscal": ["3"],
    "Revenu annuel moyen de votre foyer fiscal": ["Entre 41 493 € et 50 513 €"],
    "Code Postal": "77500",
  });

  const handleResponse: HandleResponseType = (questionId, response) => {
    setResponses({
      ...responses,
      [questionId]: response,
    });
    console.log(responses);
  };

  const renderSubmitButton = () => {
    return (
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const result = await handleSubmit(responses);

            // Construire l'URL avec les paramètres de requête
            const queryString = new URLSearchParams({
              data: JSON.stringify(result),
            }).toString();

            // Rediriger vers la page de résultats avec les données
            router.push(`/results?${queryString}`);
          } catch (error) {
            console.error("Error:", error);
          }
        }}
        className="flex justify-end"
      >
        <button className="px-12 py-4 mt-11 text-xl font-semibold tracking-tight leading-6 text-center whitespace-nowrap bg-blue-300 rounded-2xl text-slate-100">
          Valider
        </button>
      </form>
    );
  };

  const isolation = isolationNode(handleResponse);
  const energie = energieNode(handleResponse);
  const votreBien = votreBienNode(handleResponse);

  const renderPage = (): React.ReactNode => {
    switch (currentPage) {
      case 1:
        return <>{votreBien}</>;
      case 2:
        return <>{isolation}</>;
      case 3:
        return (
          <>
            {energie}
            {renderSubmitButton()}
          </>
        );
      default:
        return (
          <>
            {votreBien}
            {renderSubmitButton()}
          </>
        );
    }
  };

  return (
    <div className="m-5 flex-col items-center justify-center w-screen h-screen">
      <div className="self-start fixed pl-10 m-5">
        <SideNavigation setCurrentPage={setCurrentPage} />
      </div>
      <div className="mx-[400px]">{renderPage()}</div>
    </div>
  );
};

export default Form;
