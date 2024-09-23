import React, { useRef } from "react";
import styles from './products.module.css';
import { useUnity } from "./unityContext";


type ProductCardProps = {
    image: string;
    title: string;
    colors: string[];
    details?: string[];
    price: number;
};

type IconProps = {
  src: string;
  alt: string;
  className: string;
};

type ColorOptionProps = {
  color: string;
  isSelected?: boolean;
};

const ColorOption: React.FC<ColorOptionProps> = ({ color, isSelected }) => (
  <div
    className={`shrink-0 rounded-full h-[13px] w-[13px] ${
      isSelected ? "border-2 border-white" : ""
    }`}
    style={{ backgroundColor: color }}
  />
);

const Icon: React.FC<IconProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

const handleClickCard = (title: string) => {
  console.log(`Clicked ${title}`); // Replace this with your navigation or click handling logic
  //sendMessage("GameController", "ChangeStyle", "Salon_Minimalist")
};

const ProductCard: React.FC<ProductCardProps> = ({ image, title, colors, details, price }) => {
  const { sendMessage } = useUnity();
  return (
  <div>
  <div
    className="flex gap-5 justify-between pt-5 pr-10 pb-1.5 pl-10 mt-6 rounded-md hover:border-sky-500 hover:border-solid bg-zinc-600 border-[3px] cursor-pointer"
  onClick={() => sendMessage("GameController", "UpdateMessage", "send")}
  >    
  <Icon src={image} alt={title} className="shrink-0 self-start mt-5 aspect-[0.83] w-[70px]" />
    <div className="flex flex-col">
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="mt-6 text-xs text-white">{colors.length} coloris disponibles</div>
      <div className="flex gap-1 items-start mt-1.5">
        {colors.map((color, index) => (
          <ColorOption key={index} color={color} isSelected={index === colors.length - 1} />
        ))}
      </div>
      {details && (
        <div className="mt-5 text-xs text-white">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              {detail}
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex flex-col self-end mt-5 text-sm font-bold text-white w-[61px]">
        <div>+ {price}€</div>
        <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/e60ac5a29440c29cb6d20b61e879d0396471af56d71a2cd56f4b7da53d3fd8e7?apiKey=858b66c2b4354cc3a906a614db0ca181&" alt="Add to cart" className="self-end aspect-[1.3] w-[30px]" />
      </div>
    </div>
  </div>
  </div>
  )
};


export default function SalonCards() {
  const scrollContainer = useRef(null);
  
  return (
    <div className="flex flex-col bg-grey-500 max-w-[400px]">
    <section className="flex relative flex-col p-7 fill-zinc-800">
      <div className="flex-col">
        <form className="flex gap-5 justify-between self-center px-3 py-3.5 text-base font-semibold text-center text-black whitespace-nowrap bg-white rounded-[100px]">
          <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/a24091b5385f425e1a50e5cf1129941398a72081a59dd2f841d429f8da0593f8?apiKey=858b66c2b4354cc3a906a614db0ca181&" alt="Search icon" className="shrink-0 w-5 aspect-square" />
          <label htmlFor="searchInput" className="sr-only">Recherche</label>
          <input id="searchInput" type="text" placeholder="Recherche" className="bg-transparent border-none outline-none" />
          <Icon src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f82e4c0769148cb3ce1c6b29f6c60825a8f8231bb9568eb55e13b3499c9fc3b?apiKey=858b66c2b4354cc3a906a614db0ca181&" alt="Filter icon" className="shrink-0 w-5 aspect-square" />
        </form>
        <hr className="shrink-0 mt-6 h-0.5 border border-solid bg-zinc-600 border-zinc-600" />
        <div className="flex items-center">
        <div ref={scrollContainer} className={`${styles.customScrollbar} p-2 flex gap-3 overflow-x-auto snap-x items-start mt-3.5 text-sm font-semibold text-center text-white whitespace-nowrap`}>            <button className="justify-center p-3 rounded-[100px] snap-start">Fauteuils</button>
            <button className="justify-center p-3 bg-zinc-500 rounded-[100px] snap-start">Canapés</button>
            <button className="justify-center p-3 bg-zinc-500 rounded-[100px] snap-start">Télévisions</button>
            <button className="justify-center p-3 bg-zinc-500 rounded-[100px] snap-start">Table</button>
            {/* Ajoutez plus de boutons si nécessaire */}
          </div>
        </div>
        <ProductCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/402610defbc2ba5fdc4ce25e1d7c5efe59eacb6c74535e683d95351dbfebc2e3?apiKey=858b66c2b4354cc3a906a614db0ca181&"
          title="Fauteuil confortable"
          colors={["#FF0000", "#40E0D0", "#808080"]}
          details={[
            "Matière : coton recylclé",
            "Dimensions : 69x69cm",
            "Avis :",
          ]}
          price={200}
        />
        <ProductCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/6e578ac3e50e61e21f6305e1f026a240edb6eae20987a0d91238980f9c0ee6db?apiKey=858b66c2b4354cc3a906a614db0ca181&"
          title="Fauteuil mou"
          colors={["#87CEEB", "#DDA0DD"]}
          price={100}
        />
        <ProductCard
          image="https://cdn.builder.io/api/v1/image/assets/TEMP/3922d5c309c82a092b9c74d8029ab3c6c64ac253e21cbf00ad97073aa5c2f0c4?apiKey=858b66c2b4354cc3a906a614db0ca181&"
          title="Fauteuil moderne"
          colors={["#FFA500"]}
          price={400}
        />
      </div>
    </section>
    </div>
  )};