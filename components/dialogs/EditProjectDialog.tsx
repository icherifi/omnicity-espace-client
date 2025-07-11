"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProject } from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { ProjectType } from "@/types/project.types";

interface EditProjectDialogProps {
  project: ProjectType | null;
  onClose: () => void;
  onUpdated: () => void;
}

const statusOptions = [
  { value: "inprogress", label: "En cours..." },
  { value: "completed", label: "Terminé" },
  { value: "archived", label: "Archivé" },
];

const contractTypeOptions = [
  { value: "mandat_simple", label: "Mandat simple" },
  { value: "mandat_exclusif", label: "Mandat exclusif" },
];

const occupancyStatusOptions = [
  { value: "primaryOwner", label: "Propriétaire résidence principale" },
  { value: "secondaryOwner", label: "Propriétaire résidence secondaire" },
  { value: "ownerTenant", label: "Propriétaire bailleur" },
  { value: "tenant", label: "Locataire" },
];

export default function EditProjectDialog({ project, onClose, onUpdated }: EditProjectDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [contractType, setContractType] = useState("");
  const [size, setSize] = useState("");
  const [roomsNumber, setRoomsNumber] = useState("");
  const [floorsNumber, setFloorsNumber] = useState("");
  const [baseValue, setBaseValue] = useState("");
  const [fiscalIncome, setFiscalIncome] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [occupancyStatus, setOccupancyStatus] = useState("");
  const open = project !== null;

  useEffect(() => {
    if (project) {
      setFirstName(project.firstName || "");
      setLastName(project.lastName || "");
      setAddress(project.address || "");
      setDescription(project.description || "");
      setState(project.state || "inprogress");
      setContractType(project.contract_type || "");
      setSize(project.features?.size || "");
      setRoomsNumber(project.features?.roomsNumber || "");
      setFloorsNumber(project.features?.floorsNumber || "");
      setBaseValue(project.features?.baseValue || "");
      setFiscalIncome(project.features?.fiscalIncome || "");
      setHouseholdSize(project.features?.householdSize || "");
      setOccupancyStatus(project.features?.occupancyStatus || "");
    }
  }, [project]);

  const handleSubmit = async () => {
    if (!project) return;
    const token = await getToken();
    if (!token) return;

    const updatedData = {
      firstName,
      lastName,
      address,
      description,
      state,
      contract_type: contractType,
      features: {
        size,
        roomsNumber,
        floorsNumber,
        baseValue,
        fiscalIncome,
        householdSize,
        occupancyStatus,
      },
    };

    const success = await updateProject(
      project.id.toString(),
      updatedData,
      token
    );
    if (success) {
      onUpdated();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le projet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du projet</Label>
            <Textarea
              id="description"
              placeholder="Description du projet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractType">Type de contrat</Label>
            <Select value={contractType} onValueChange={setContractType}>
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Sélectionner un type de contrat" />
              </SelectTrigger>
              <SelectContent>
                {contractTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Caractéristiques du bien */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size">Surface (m²)</Label>
              <Input
                id="size"
                placeholder="Surface"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomsNumber">Nombre de pièces</Label>
              <Input
                id="roomsNumber"
                placeholder="Nombre de pièces"
                value={roomsNumber}
                onChange={(e) => setRoomsNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorsNumber">Nombre d'étages</Label>
              <Input
                id="floorsNumber"
                placeholder="Nombre d'étages"
                value={floorsNumber}
                onChange={(e) => setFloorsNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Informations financières */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseValue">Valeur du bien (€)</Label>
              <Input
                id="baseValue"
                placeholder="Valeur du bien"
                value={baseValue}
                onChange={(e) => setBaseValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fiscalIncome">Revenus fiscaux (€)</Label>
              <Input
                id="fiscalIncome"
                placeholder="Revenus fiscaux"
                value={fiscalIncome}
                onChange={(e) => setFiscalIncome(e.target.value)}
              />
            </div>
          </div>

          {/* Informations du ménage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="householdSize">Taille du ménage</Label>
              <Input
                id="householdSize"
                placeholder="Taille du ménage"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupancyStatus">Statut d'occupation</Label>
              <Select value={occupancyStatus} onValueChange={setOccupancyStatus}>
                <SelectTrigger id="occupancyStatus">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  {occupancyStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Statut du projet</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
