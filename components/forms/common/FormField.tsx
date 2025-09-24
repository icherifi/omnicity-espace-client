import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  id: string;
  value: string | number | undefined;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  pattern?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  value,
  error,
  onChange,
  type = "text",
  placeholder,
  className = "",
  inputMode,
  pattern,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4 w-full">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <div className="col-span-3 space-y-1 w-full">
        <Input
          id={id}
          type={type}
          value={value as string | number}
          placeholder={placeholder}
          inputMode={inputMode}
          pattern={pattern}
          className={`${error ? "border-red-500" : ""} ${className}`}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FormField; 