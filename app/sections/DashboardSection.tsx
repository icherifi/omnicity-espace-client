"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleUser, File, Info, Sun, Moon, Lock, FileText } from "lucide-react";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { getEnergyLabelColor } from "@/components/details/utils";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme.context";
import { createClient } from "@/utils/supabase/client";

function getPerfBadge(note: number | undefined) {
  if (note === 1)
    return {
      label: "Bien",
      color: "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
    };
  if (note === 2)
    return {
      label: "Moyen",
      color: "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900",
    };
  if (note === 3)
    return {
      label: "Mauvais",
      color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900",
    };
  return {
    label: "-",
    color: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
  };
}

function getChauffageNote(chauffage: any) {
  const keys = ["ApCh1", "ApCh2", "ECS"];
  const notes = keys.map(key => chauffage?.EtatInitial?.[key]?.Note).filter(n => n != null);
  if (!notes.length) return undefined;
  return Math.round(notes.reduce((a, b) => a + b, 0) / notes.length);
}

export default function DashboardSection() {
  const { currentProjectDisplayed } = useDashboardContext();

  if (!currentProjectDisplayed) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Sélectionnez ou créez un projet pour commencer.
      </div>
    );
  }

  const {
    clientName,
    name,
    address,
    contractType,
    created_at,
    features,
    monthlyRevenue,
    avancment,
    targetedEnergyRating,
    iziResponse,
  } = currentProjectDisplayed as any;

  const avanc = avancment ?? 70;
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); 
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center flex-row justify-end gap-4 mb-4">
        <Button onClick={() => router.push(`/projects/${currentProjectDisplayed.id}`)} variant="outline" size={"lg"} className="w-fit rounded-[12px]">Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
        <p className="text-figma-secondary-color text-center text-[20px] font-bold leading-[26.4px]">
          {currentProjectDisplayed?.authorName ?? "John Doe"}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-center p-2">
              <Sun className="h-4 w-4 mr-2" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 ml-2" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <main className="flex flex-col xl:flex-row gap-6 p-6">
        <div className="flex flex-col gap-6 w-full xl:w-1/2">
          <div className="flex flex-col h-full cursor-pointer">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="flex-1 bg-[#E5E5E5] border-none shadow-none overflow-hidden relative flex items-center justify-center" style={{ borderRadius: 20 }}>
                  <Lock className="absolute top-4 left-4" />
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
                  <DialogTitle className="text-[#030712] font-bold text-[36px]">Choisissez le plan à importer :</DialogTitle>
                </DialogHeader>
                <div className="mt-[50px] flex items-start">
                  <div className="flex flex-col text-[#030712] font-medium text-[26px]">
                    <p>
                      Pour importer un plan <span className="font-bold">LiDAR</span>, utilisez l'application OmniCity Scan sur iOS.
                    </p>
                    <p className="mt-2 italic text-[14px]">(Uniquement disponible sur les iPhones et iPad Pro, 2020 ou supérieur)</p>
                  </div>
                  <Image src="/qr-scan.svg" alt="QR code" width={250} height={250} className="ml-10" />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none bg-card shadow-sm rounded-[16px] p-0">
            <CardHeader className="px-8 pt-8 pb-0">
              <CardTitle className="text-3xl font-bold text-foreground mb-6">Détails du Projet</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pt-4 pb-8">
              <div className="grid grid-cols-2 gap-y-2 text-base text-foreground">
                <span className="font-semibold">Client</span>
                <span>{clientName || "–"}</span>
                <span className="font-semibold">Projet</span>
                <span>{name || "–"}</span>
                <span className="font-semibold">Adresse</span>
                <span>{address || "–"}</span>
                <span className="font-semibold">Contrat</span>
                <span>{contractType || "–"}</span>
                <span className="font-semibold">Créé le</span>
                <span>{created_at ? new Date(created_at).toLocaleDateString() : "–"}</span>
                <span className="font-semibold">Coût du bien</span>
                <span>{features?.baseValue ? `${features.baseValue.toLocaleString("fr-FR")} €` : "–"}</span>
                <span className="font-semibold">Surface</span>
                <span>{features?.size ? `${features.size.toLocaleString("fr-FR")} m²` : "–"}</span>
                <span className="font-semibold">Revenus</span>
                <span>{monthlyRevenue ? `${monthlyRevenue.toLocaleString("fr-FR")} €/mois` : "–"}</span>
              </div>
              <div className="flex justify-end mt-2 mb-4">
                <span className="text-sm text-gray-500 italic cursor-pointer">Modifier</span>
              </div>
              <div className="mt-4">
                <p className="font-semibold mb-2 text-base text-foreground">Pourcentage de complétion du projet</p>
                <div className="relative w-full">
                  <Progress value={avanc} className="h-[38px] rounded-[10px] bg-[#ede7f6]" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-foreground select-none">
                    {avanc}%
                  </span>
                </div>
              </div>
              <div className="mt-4 border rounded-lg flex items-center justify-between px-4 py-2 bg-card text-foreground text-base">
                <span className="font-semibold">Prochaine étape recommandée&nbsp;:</span>
                <span className="underline cursor-pointer">Prendre contact avec un designer d'intérieur</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 w-full xl:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Card className="relative flex-1 flex flex-col border-black border border-solid bg-card shadow-sm rounded-[16px] p-0">
              <CardHeader className="pb-4 px-6 pt-6">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold text-foreground">Actuel</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
                        <Info className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl p-0 pb-6">
                      <div className="flex flex-row items-stretch w-full">
                        <div className="flex-1 p-8 flex flex-col justify-center">
                          <h2 className="text-3xl font-bold mb-6 leading-tight">Diagnostic de Performance Énergétique (DPE)</h2>
                          <p className="text-lg mb-8">Le DPE donne des informations sur la performance énergétique et climatique d'un logement ou d'un bâtiment.</p>
                          <a href="https://www.service-public.fr/particuliers/vosdroits/F16096" target="_blank" rel="noreferrer" className="text-xs underline text-foreground mt-2 w-fit">En savoir plus</a>
                        </div>
                        <div className="flex flex-col items-center pr-8 pt-8">
                          <svg
                            width="210"
                            height="320"
                            viewBox="0 0 296 406"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g fontWeight="bold" fontSize="24">
                              <g transform="translate(0,0)">
                                <path
                                  d="M136.416 0H0V58H136.416L156 29L136.416 0Z"
                                  fill="#21803D"
                                />
                                <text x="18" y="38" fill="white">A</text>
                              </g>
                              <g transform="translate(0,58)">
                                <path
                                  d="M160.416 0H0V58H160.416L180 29L160.416 0Z"
                                  fill="#59AB3F"
                                />
                                <text x="18" y="38" fill="white">B</text>
                              </g>
                              <g transform="translate(0,116)">
                                <path
                                  d="M184.416 0H0V58H184.416L204 29L184.416 0Z"
                                  fill="#A5C140"
                                />
                                <text x="18" y="38" fill="white">C</text>
                              </g>
                              <g transform="translate(0,174)">
                                <path
                                  d="M206.416 0H0V58H206.416L226 29L206.416 0Z"
                                  fill="#F1D11D"
                                />
                                <text x="18" y="38" fill="white">D</text>
                              </g>
                              <g transform="translate(0,232)">
                                <path
                                  d="M229.416 0H0V58H229.416L249 29L229.416 0Z"
                                  fill="#F27C11"
                                />
                                <text x="18" y="38" fill="white">E</text>
                              </g>
                              <g transform="translate(0,290)">
                                <path
                                  d="M252.416 0H0V58H252.416L272 29L252.416 0Z"
                                  fill="#E93B19"
                                />
                                <text x="18" y="38" fill="white">F</text>
                              </g>
                              <g transform="translate(0,348)">
                                <path
                                  d="M276.416 0H0V58H276.416L296 29L276.416 0Z"
                                  fill="#B91C1C"
                                />
                                <text x="18" y="38" fill="white">G</text>
                              </g>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0 pb-0">
                <div className="bg-red-100 dark:bg-red-800 mx-6 rounded-xl p-6 flex flex-col items-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-foreground dark:text-white">{iziResponse?.etiquetteInitial || "G"}</span>
                  <p className="font-semibold text-foreground dark:text-white">Étiquette énergétique</p>
                  <ul className="text-sm list-disc list-inside text-foreground dark:text-white">
                    <li>{iziResponse?.CEP || 660} kWh/m²/an</li>
                    <li>{iziResponse?.EGES || 145} kgCO₂/m²/an</li>
                  </ul>
                </div>
                <div className="space-y-4 text-sm mx-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Isolation</span>
                    {(() => {
                      const note = iziResponse?.performanceEnergetique?.murs?.EtatInitial?.Note;
                      const badge = getPerfBadge(note);
                      return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                    })()}
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Chauffage</span>
                    {(() => {
                      const note = getChauffageNote(iziResponse?.performanceEnergetique?.chauffage);
                      const badge = getPerfBadge(note);
                      return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                    })()}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ventilation</span>
                    {(() => {
                      const note = iziResponse?.performanceEnergetique?.ventilation?.EtatInitial?.Note;
                      const badge = getPerfBadge(note);
                      return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                    })()}
                  </div>
                </div>
                <div className="bg-[#1E232E] text-white rounded-b-[16px] mt-6 p-4 flex justify-between text-sm font-semibold">
                  <span>Avant : {iziResponse?.coutAvant ? `${iziResponse.coutAvant}€/mois` : "600€/mois"}</span>
                  <span className="ml-4">Après : {iziResponse?.coutApres ? `${iziResponse.coutApres}€/mois` : "250€/mois"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 flex flex-col border-black border border-solid bg-card shadow-sm rounded-[16px] p-0">
              <CardHeader className="pb-4 px-6 pt-6">
                <CardTitle className="text-2xl font-bold text-foreground">Visé</CardTitle>
              </CardHeader>
              <CardContent className="p-0 pb-0 flex flex-col h-full">
                <div className="bg-green-100 dark:bg-green-800 mx-6 rounded-xl p-6 flex flex-col items-center gap-2 mb-6">
                  <span className="text-5xl font-bold text-foreground dark:text-white">{targetedEnergyRating || "C"}</span>
                  <p className="font-semibold text-foreground dark:text-white">Étiquette énergétique</p>
                  <ul className="text-sm list-disc list-inside text-foreground dark:text-white">
                    <li>{iziResponse?.targetCEP || 160} kWh/m²/an</li>
                    <li>{iziResponse?.targetEGES || 24} kgCO₂/m²/an</li>
                  </ul>
                </div>
                <div className="space-y-4 text-sm mx-6 flex-1">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Isolation</span>
                    <span className="flex items-center gap-2">
                      {(() => {
                        const note = iziResponse?.performanceEnergetique?.murs?.EtatInitial?.Note;
                        const badge = getPerfBadge(note);
                        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Chauffage</span>
                    <span className="flex items-center gap-2">
                      {(() => {
                        const note = getChauffageNote(iziResponse?.performanceEnergetique?.chauffage);
                        const badge = getPerfBadge(note);
                        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ventilation</span>
                    <span className="flex items-center gap-2">
                      {(() => {
                        const note = iziResponse?.performanceEnergetique?.ventilation?.EtatInitial?.Note;
                        const badge = getPerfBadge(note);
                        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>{badge.label}</span>;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="bg-[#1E232E] text-white rounded-b-[16px] mt-6 p-4 flex justify-between text-sm font-semibold">
                  <span>Coût total des travaux</span>
                  <span>{currentProjectDisplayed.energyMixChoice?.coutTotal ? `${Math.round(currentProjectDisplayed.energyMixChoice.coutTotal).toLocaleString("fr-FR")} €` : "42 000€"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-black border border-solid bg-card shadow-sm rounded-[16px] p-0">
            <CardHeader className="px-8 pt-8 pb-0">
              <CardTitle className="text-3xl font-bold text-foreground mb-10">Bilan de votre projet de rénovation</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pt-4 pb-8">
              <p className="text-base mb-8 text-foreground">
                Vous avez opté pour le plan <span className="font-semibold">suivant&nbsp;:</span>
              </p>
              <div className="flex justify-between font-semibold mb-4 text-base text-foreground">
                <span>Détail</span>
                <span>Montant</span>
              </div>
              <div className="space-y-6 text-base text-foreground">
                <div className="flex justify-between">
                  <span>Coût estimé des travaux</span>
                  <span className="font-semibold">{currentProjectDisplayed.energyMixChoice?.coutTotal ? `${Math.round(currentProjectDisplayed.energyMixChoice.coutTotal).toLocaleString("fr-FR")} €` : "42 000 €"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="whitespace-pre-line">Aides potentielles{"\n"}(MaPrimeRénov', CEE...)</span>
                  <span className="font-semibold text-green-600">-{currentProjectDisplayed.energyMixChoice?.montantAides ? `${Math.round(currentProjectDisplayed.energyMixChoice.montantAides).toLocaleString("fr-FR")} €` : "16 000 €"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coût restant à charge</span>
                  <span className="font-semibold">{currentProjectDisplayed.energyMixChoice?.resteACharge ? `${Math.round(currentProjectDisplayed.energyMixChoice.resteACharge).toLocaleString("fr-FR")} €` : "26 000 €"}</span>
                </div>
              </div>
              <Separator className="my-4 bg-border" />
              <div className="flex items-start text-xs gap-2 mt-2">
                <svg className="mt-[2px]" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="6" fill="#AF80FF"/>
                </svg>
                <span className="text-foreground">
                  Le + : Jusqu'à 38&nbsp;% de vos travaux pris en charge par les aides publiques.
                  <a href="#" className="underline ml-1">En savoir plus</a>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 