import React from "react";

interface DetailsPlaceProps {
  currentProjectDisplayed: {
    features?: {
      servicesAndAccessibility?: string[];
      outsite?: string[];
      additionalAres?: string[];
      hygiene?: string[];
    };
  };
}

const DetailsPlace: React.FC<DetailsPlaceProps> = ({
  currentProjectDisplayed,
}) => {
  return (
    <div>
      <div className="text-lg font-semibold">Caractéristiques</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="font-semibold">Services et accessibilité</div>
          <div className="grid gap-0.5 not-italic text-muted-foreground">
            {currentProjectDisplayed.features?.servicesAndAccessibility?.map(
              (service, i) => (
                <span key={i}>{service}</span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-semibold">Extérieur</div>
          <div className="grid gap-0.5 not-italic text-muted-foreground">
            {currentProjectDisplayed.features?.outsite?.map(
              (outsideElement, i) => (
                <span key={i}>{outsideElement}</span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-semibold">Surfaces annexes</div>
          <div className="grid gap-0.5 not-italic text-muted-foreground">
            {currentProjectDisplayed.features?.additionalAres?.map(
              (additionalArea, i) => (
                <span key={i}>{additionalArea}</span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-semibold">Hygiène</div>
          <div className="grid gap-0.5 not-italic text-muted-foreground">
            {currentProjectDisplayed.features?.hygiene?.map(
              (hygieneElement, i) => (
                <span key={i}>{hygieneElement}</span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPlace;
