import {
  BedSingle,
  Microwave,
  Bath,
  Sofa,
  DoorOpen,
  WashingMachine,
  LampCeiling,
  Flower2,
  Bookmark,
  LucideIcon
} from "lucide-react"

export type NavigationItem = {
  category: string
  label: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { category: "chambre", label: "Chambre", icon: BedSingle },
  { category: "cuisine", label: "Cuisine", icon: Microwave },
  { category: "salle de bain", label: "Salle de bain", icon: Bath },
  { category: "salon", label: "Salon", icon: Sofa },
  { category: "entrée", label: "Entrée", icon: DoorOpen },
  { category: "buandrie", label: "Buandrie", icon: WashingMachine },
  { category: "luminaires", label: "Luminaires", icon: LampCeiling },
  { category: "plantes", label: "Plantes", icon: Flower2 },
]

export const collectionsItem: NavigationItem = {
  category: "collections",
  label: "Collections",
  icon: Bookmark
} 