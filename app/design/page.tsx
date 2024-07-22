"use client";
import { UnityProvider, useUnity } from "./unityContext";

import LeftMenuProps from "./LeftMenu";
import Render from "./render";
import EstimationPage from "@/components/estimation/EstimationPage";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
};

export default function Design() {
  const supabase = createClient();
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await createClient().auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        const { data: account, error } = await createClient()
          .from("accounts")
          .select("admin")
          .eq("user", user.id)
          .single();

        if (!account || error) {
          console.error("Error fetching account:", error);
        }
        setIsCheckingUser(false); // Vérification terminée, utilisateur connecté et compte trouvé
      }
    };

    checkUser();
  }, [router]);
  if (isCheckingUser) {
    return <div>Loading...</div>; // Ou tout autre indicateur de chargement de votre choix
  }

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
