'use client';
import { UnityProvider, useUnity} from "./unityContext";

import LeftMenuProps from "./LeftMenu";
import Render from "./render";
import EstimationPage from "@/components/estimation/EstimationPage";

const ButtonNew = () => {
  const { sendMessage } = useUnity();
  return (
    <button
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-300 text-white px-4 py-2"
      onClick={() => {
        sendMessage("GameController", "LoadPlanEvent", "send");
      }}
    >
      Importer un plan
    </button>
  );
}

export default async function Design() {
  
  return (
    <div className="static bg-unitybg">
      <div>
        <UnityProvider>
          <div className="absolute left-0">
            <LeftMenuProps />
          </div>
          <div className="p-3 absolute right-0">
            <EstimationPage />
          </div>
          <div className="flex-1">{<Render />}</div>
          <ButtonNew />  
        </UnityProvider>
      </div>

    </div>
  );
}
