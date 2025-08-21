"use client";

import React from "react";
import { FileText, Eye, Download, Bookmark, Trash2 } from "lucide-react";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useSidebarContext } from "@/contexts/sidebar.context";

interface DocumentFile {
  name: string;
  path: string;
  updated_at?: string;
}

interface DocumentItemProps {
  file: DocumentFile;
  previewUrl?: string;
  isBookmarked: boolean;
  isSelected: boolean;
  onPreview: () => void;
  onDownload: () => void;
  onToggleBookmark: () => void;
  onDelete: () => void;
  onSelectChange: (checked: boolean) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  file,
  previewUrl,
  isBookmarked,
  isSelected,
  onPreview,
  onDownload,
  onToggleBookmark,
  onDelete,
  onSelectChange,
}) => {
  const { navigateToRenovation } = useAppRouter();
  const { currentProjectDisplayed } = useDashboardContext();

  const isPlanFile = (fileName: string) => {
    const planExtensions = [".usdz", ".glb", ".obj", ".fbx", ".json"];
    return planExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const handlePreviewClick = () => {
    if (isPlanFile(file.name)) {
      if (currentProjectDisplayed) {
        // Navigate to renovation section for 3D file previews
        navigateToRenovation(currentProjectDisplayed.id);
      }
    } else {
      onPreview();
    }
  };

  return (
    <div className="flex items-center bg-purple-50 dark:bg-purple-900/20 mx-6 px-4 py-3 rounded-md">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-10 h-10 object-cover rounded-sm mr-3 border border-gray-200 dark:border-gray-700"
        />
      ) : (
        <FileText className="w-5 h-5 text-gray-900 dark:text-white mr-3" />
      )}
      <span className="text-sm text-gray-900 dark:text-white mr-8 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
        {file.name}
      </span>
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-8 whitespace-nowrap">
        {file.updated_at
          ? new Date(file.updated_at).toLocaleDateString("fr-FR")
          : ""}
      </span>
      <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
        <div
          className="cursor-pointer hover:text-gray-900 dark:hover:text-white"
          onClick={handlePreviewClick}
          title={isPlanFile(file.name) ? "Voir en 3D" : "Aperçu"}
        >
          <Eye className="w-5 h-5" />
        </div>
        <Download
          className="w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white"
          onClick={onDownload}
        />
        <Bookmark
          onClick={onToggleBookmark}
          className="w-5 h-5 cursor-pointer hover:text-gray-900 dark:hover:text-white"
          color={isBookmarked ? "#8C63FF" : undefined}
          fill={isBookmarked ? "#8C63FF" : "none"}
          stroke={isBookmarked ? "#8C63FF" : "currentColor"}
        />
        <Trash2
          className="w-5 h-5 cursor-pointer hover:text-red-600 dark:hover:text-red-400"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default DocumentItem;
