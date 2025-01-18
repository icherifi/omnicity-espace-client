import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Category {
  label: string;
}

interface CategorySelectorProps {
  categories: Category[];
  activeCategory: string;
  onCategorySelect: (label: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  return (
    <nav className="grid gap-4 text-sm text-muted-foreground">
      {categories.map((category, i) => (
        <div
          key={i}
          onClick={() => onCategorySelect(category.label)}
          className={`${
            activeCategory === category.label && "font-semibold text-primary"
          } hover:cursor-pointer`}
        >
          {category.label}
        </div>
      ))}
      <div className="flex flex-col">
        <p className="p-2 font-bold pl-0 mb-2 text-base">Choix du bouquet</p>
        <RadioGroup defaultValue="balanced">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="simplicity" id="r1" />
            <Label htmlFor="r1">Simplicité</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="balanced" id="r2" />
            <Label htmlFor="r2">Equilibrée</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="efficient" id="r3" />
            <Label htmlFor="r3">Performante</Label>
          </div>
        </RadioGroup>
      </div>
    </nav>
  );
};

export default CategorySelector;
