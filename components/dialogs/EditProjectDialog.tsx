"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function EditProjectDialog({
  project,
  onClose,
  onUpdated,
}: EditProjectDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [baseValue, setBaseValue] = useState<string>("");
  const open = project !== null;

  useEffect(() => {
    if (project) {
      setFirstName(project.firstName || "");
      setLastName(project.lastName || "");
      setAddress(project.address || "");
      setDescription(project.description || "");
      setState(project.state || "inprogress");
      setBaseValue(project.baseValue?.toString() || "");
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
      baseValue: Number(baseValue) || 0,
    };

    const success = await updateProject(project.id.toString(), updatedData);
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
            <Label htmlFor="baseValue">Valeur estimée du bien (€)</Label>
            <Input
              id="baseValue"
              type="number"
              placeholder="Valeur estimée du bien"
              value={baseValue}
              onChange={(e) => setBaseValue(e.target.value)}
            />
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
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>Enregistrer</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
