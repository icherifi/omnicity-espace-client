import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, className = "" }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="imageUpload" className="text-right">
        Importer une image
      </Label>
      <Input
        id="imageUpload"
        type="file"
        accept="image/*"
        className={`col-span-3 ${className}`}
        onChange={(e) => onImageChange(e.target.files?.[0] || null)}
      />
    </div>
  );
};

export default ImageUpload; 