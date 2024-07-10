import React from 'react';
import EstimationItem from './EstimationItem';
import DownloadSection from './DownloadSection';
import PriceListContainer from './PriceListContainer';

interface EstimationCardProps {
  items: { title: string; content: string; }[];
  budget: number;
  total: number;
}

const EstimationCard: React.FC<EstimationCardProps> = ({ items, budget, total }) => {
  return (
    <section className="flex-col mx-auto font-medium text-black">
      <div className="w-100 flex-col bg-slate-100 shadow-[2px_-3px_4px_rgba(0,0,0,0.25)]">
        <div className="p-2">
          <h1 className="p-5 text-3xl tracking-tight leading-6">Estimation</h1>
          {items.map((item: { title: string; content: string; }, index: React.Key | null | undefined) => (
            <EstimationItem key={index} title={item.title}>
              <PriceListContainer/>
            </EstimationItem>
          ))}
        </div>
        <hr className="shrink-0 h-1 rounded-xl border border-solid bg-zinc-400 border-neutral-900 border-opacity-40" />
        <div className="p-2">
          <div className="flex gap-5 py-2">
            <p className="text-base leading-6">Budget (pour les aides )</p>
            <p className="text-lg leading-6">{budget} €</p>
          </div>
          <div className="flex gap-5 py-2">
            <p className="flex-auto text-xl leading-6">Totale ( sans les aides )</p>
            <p className="flex-auto text-lg leading-6">{total} €</p>
          </div>
          <div className="flex gap-1.5 self-center mt-11 text-3xl tracking-tight leading-6 whitespace-nowrap">
            <h2 className="grow my-auto">Téléchargement</h2>
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/26afa4fe3145d8f58b8193a559cbdab55587b2f55697e8f27d3b2ac5f42142fb?apiKey=74bccfb37e4243edb00646365d401f63&" className="shrink-0 w-11 aspect-square" alt="" />
          </div>
        </div>
        <DownloadSection />
      </div>
    </section>
  );
};

export default EstimationCard;