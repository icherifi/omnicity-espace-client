import { Search, Settings2 } from "lucide-react";
import { useUnity } from "./unityContext";
import { Input } from "@/components/ui/input";
import { useDesignPageContext } from "@/contexts/designPage.context";

const assetsData = require("./assets.json");

type CardsProps = {
  room: string;
};
type AssetProps = {
  image: string;
  title: string;
  price: number;
  unicityPath: string;
  room: string;
};

type IconProps = {
  src: string;
  alt: string;
  className: string;
};

const Icon: React.FC<IconProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

const AssetCard: React.FC<AssetProps> = ({ image, title, price, unicityPath, room }) => {
  const { sendMessage } = useUnity();
  const { selectedAssets, setSelectedAssets } = useDesignPageContext()
  const { costEstimation, setCostEstimation } = useDesignPageContext()
  return (
    <div>
      <div className="flex p-2 mt-6 rounded-md hover:border-sky-500 hover:border-solid bg-zinc-600 border-[3px] cursor-pointer"
      onClick={() => {
        const filteredAssets = selectedAssets.filter(asset => asset.roomType !== room);
        const existingAsset = selectedAssets.find(asset => asset.roomType === room);
        const updatedCostEstimation = {
          withAid: costEstimation.withAid + price - (existingAsset ? existingAsset.price : 0),
          withoutAid: costEstimation.withoutAid + price - (existingAsset ? existingAsset.price : 0)
        };

        const newAsset = {
          title: title,
          roomType: room,
          price: price
        };

        setSelectedAssets([...filteredAssets, newAsset]);

        setCostEstimation(updatedCostEstimation);
        if (room === "salon")
          sendMessage("GameController", "ChangeStyleSalon", unicityPath);
        else if (room === "cuisine")
          sendMessage("GameController", "ChangeStyleCuisine", unicityPath);
      }}
      >
        <Icon src={image} alt={title} className="shrink-0 self-start" />
      </div>
    </div>
  );
};

const Cards: React.FC<CardsProps> = ({ room }) => {
  const assetCards = assetsData[room];
  if (!assetCards || assetCards.length === 0) {
    return <div className="flex h-screen bg-slate-50">
      <p className="p-8">No assets available for this room.</p>
    </div>;
  }
  return (
    <div className="flex flex-col bg-slate-50 h-screen overflow-y-auto w-[400px]">
      <section className="flex relative flex-col p-7 fill-zinc-800">
        <div className="flex-col">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Recherche"
                  className="w-full appearance-none bg-background pl-8 shadow-none"
                />
                <Settings2 className="w-4 h-4 hover:cursor-pointer absolute right-2.5 top-2.5 text-muted-foreground"/>
              </div>
            </form>
          <div>
            <hr className="shrink-0 mt-6 h-0.5 border border-solid bg-zinc-600 border-zinc-600" />
            {assetCards.map((cardData: AssetProps) => (
              <AssetCard {...cardData} room={room} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cards;
