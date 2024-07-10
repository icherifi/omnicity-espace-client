import { useUnity } from "./unityContext";

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
  return (
    <div>
      <div className="flex p-2 mt-6 rounded-md hover:border-sky-500 hover:border-solid bg-zinc-600 border-[3px] cursor-pointer"
      onClick={() => {
        //sendMessage("GameController", "UpdateMessage", "send");
        console.log("Clicked on" + room);
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
    return <p>No assets available for this room.</p>;
  }
  return (
    <div className="flex flex-col bg-grey-500 h-screen overflow-y-auto w-[400px]">
      <section className="flex relative flex-col p-7 fill-zinc-800">
        <div className="flex-col">
          <form className="flex gap-5 justify-between self-center px-3 py-3.5 text-base font-semibold text-center text-black whitespace-nowrap bg-white rounded-[100px]">
            <Icon
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a24091b5385f425e1a50e5cf1129941398a72081a59dd2f841d429f8da0593f8?apiKey=858b66c2b4354cc3a906a614db0ca181&"
              alt="Search icon"
              className="shrink-0 w-5 aspect-square"
            />
            <label htmlFor="searchInput" className="sr-only">
              Recherche
            </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Recherche"
              className="bg-transparent border-none outline-none"
            />
            <Icon
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f82e4c0769148cb3ce1c6b29f6c60825a8f8231bb9568eb55e13b3499c9fc3b?apiKey=858b66c2b4354cc3a906a614db0ca181&"
              alt="Filter icon"
              className="shrink-0 w-5 aspect-square"
            />
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
