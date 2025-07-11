import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchFocus?: () => void;
  onSearchClose?: () => void;
  placeholder?: string;
  isFullscreen?: boolean;
  readOnly?: boolean;
}

export default function SearchBar({
  search,
  onSearchChange,
  onSearchFocus,
  onSearchClose,
  placeholder = "Ex: électricien 75001, plombier Paris, Entreprise ABC...",
  isFullscreen = false,
  readOnly = false
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        placeholder={placeholder}
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        onFocus={onSearchFocus}
        className={`pl-10 ${isFullscreen ? 'pr-12 rounded-xl py-3 text-lg' : 'rounded-xl py-3'}`}
        readOnly={readOnly}
        autoFocus={isFullscreen}
      />
      {isFullscreen && onSearchClose && (
        <button
          onClick={onSearchClose}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
} 