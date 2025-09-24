"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useDashboardContext } from "@/contexts/dashboard.context";
import USDZViewer from "@/app/sections/renovation/components/USDZViewer";

const ImportPlanCard: React.FC = () => {
  const { currentProjectDisplayed } = useDashboardContext();
  const [firstPlan, setFirstPlan] = useState<{ name: string; path: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPlans = async () => {
      if (!currentProjectDisplayed?.id) {
        setFirstPlan(null);
        return;
      }
      const folder = `plans-${currentProjectDisplayed.id}`;
      const { data, error } = await supabase.storage.from("documents").list(folder);
      if (!error && data && data.length > 0) {
        setFirstPlan({ name: data[0].name, path: `${folder}/${data[0].name}` });
      } else {
        setFirstPlan(null);
      }
    };
    fetchPlans();
  }, [currentProjectDisplayed]);

  if (firstPlan) {
    return (
      <div className="flex flex-col h-full w-full min-h-[300px]">
        <div className="flex-1 w-full h-[350px]">
          <USDZViewer 
            documentPath={firstPlan.path} 
            documentName={firstPlan.name} 
            hideInfo={true} 
            disableScrollZoom={true} 
            showZoomButtons={true}
            initialCameraPosition={[0, 2, 8]}
            initialCameraRotation={[15, 0, 0]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full cursor-pointer">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="flex-1 bg-gray-100 dark:bg-gray-800 border-none shadow-none overflow-hidden relative flex items-center justify-center min-h-[300px]" style={{ borderRadius: 20 }}>
            {/*Rajouter le lock quand utilisateur n'a pas accès à l'import*/}
            {/*<Lock className="absolute top-4 left-4 text-gray-600 dark:text-gray-400" /> */}
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Button
                variant="outline"
                className="rounded-xl px-8 py-6 text-lg font-semibold bg-background shadow"
              >
                Commencer à importer votre plan avec LiDAR
              </Button>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[50vw] p-10 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white font-bold text-[36px]">Choisissez le plan à importer :</DialogTitle>
          </DialogHeader>
          <div className="mt-[50px] flex items-start">
            <div className="flex flex-col text-gray-900 dark:text-white font-medium text-[26px]">
              <p>
                Pour importer un plan <span className="font-bold">LiDAR</span>, utilisez l'application OmniCity Scan sur iOS.
              </p>
              <p className="mt-2 italic text-[14px] text-gray-600 dark:text-gray-400">(Uniquement disponible sur les iPhones et iPad Pro, 2020 ou supérieur)</p>
            </div>
            <div className="ml-10">
              <Image 
                src="/qr-scan.svg" 
                alt="QR code" 
                width={250} 
                height={250} 
                className="dark:invert"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportPlanCard; 