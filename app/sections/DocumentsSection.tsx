"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Eye,
  Download,
  Bookmark,
  MoreVertical,
} from "lucide-react";

export default function DocumentsSection() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const toggleBookmark = (name: string) => {
    setBookmarks((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedFiles");
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedFiles", JSON.stringify(bookmarks));
  }, [bookmarks]);

  return (
    <>
      <h1 className="text-4xl font-bold text-[#222] mb-6 mt-2">Documents</h1>
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="secondary"
          className="rounded-lg font-semibold px-6 py-2 text-base bg-gray-100 text-black hover:bg-gray-200"
        >
          Importer un document
        </Button>
        <Button
          className="bg-[#8C63FF] text-white font-semibold px-8 py-2 rounded-lg hover:bg-[#7a55e6] transition-colors"
          style={{ minWidth: 120 }}
        >
          Exporter
        </Button>
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <Accordion type="single" collapsible defaultValue="plans" className="space-y-4">
          <AccordionItem value="plans">
            <AccordionTrigger className="text-xl font-semibold bg-[#2C2F33] text-white px-6 py-4 rounded-lg data-[state=open]:rounded-b-none">
              Plans 2D/3D
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg px-0">
              <div className="py-2 space-y-2">
                {[
                  { name: "Plan_RDC.pdf", date: "22/05/2025" },
                  { name: "Plan_Etage.pdf", date: "22/05/2025" },
                  { name: "Visuel3D.pdf", date: "22/05/2025" },
                ].map((file) => {
                  const isBookmarked = bookmarks.includes(file.name);
                  return (
                  <div
                    key={file.name}
                    className="flex items-center bg-[#F4E9F0] mx-6 px-4 py-3 rounded-md"
                  >
                    <FileText className="w-5 h-5 text-[#222] mr-3" />
                    <span className="text-sm text-[#222] mr-8 whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                      {file.name}
                    </span>
                    <span className="text-sm text-[#444] mr-8 whitespace-nowrap">
                      {file.date}
                    </span>
                    <div className="flex items-center space-x-6 text-[#444]">
                      <Eye className="w-5 h-5 cursor-pointer" />
                      <Download className="w-5 h-5 cursor-pointer" />
                      <Bookmark
                        onClick={() => toggleBookmark(file.name)}
                        className="w-5 h-5 cursor-pointer"
                        color={isBookmarked ? "#8C63FF" : undefined}
                        fill={isBookmarked ? "#8C63FF" : "none"}
                        stroke={isBookmarked ? "#8C63FF" : "currentColor"}
                      />
                      <MoreVertical className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="devis">
            <AccordionTrigger className="text-xl font-semibold bg-[#2C2F33] text-white px-6 py-4 rounded-lg data-[state=open]:rounded-b-none">
              Devis & Estimations
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg"></AccordionContent>
          </AccordionItem>
          <AccordionItem value="photos">
            <AccordionTrigger className="text-xl font-semibold bg-[#2C2F33] text-white px-6 py-4 rounded-lg data-[state=open]:rounded-b-none">
              Photos
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg"></AccordionContent>
          </AccordionItem>
          <AccordionItem value="autres">
            <AccordionTrigger className="text-xl font-semibold bg-[#2C2F33] text-white px-6 py-4 rounded-lg data-[state=open]:rounded-b-none">
              Autres documents
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg"></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
} 