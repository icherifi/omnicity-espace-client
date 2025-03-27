interface ExportHeaderProps {
  onClose: () => void;
  onExport: () => void;
  isExporting: boolean;
}

export const ExportHeader = ({ onClose, onExport, isExporting }: ExportHeaderProps) => (
  <div className="sticky top-0 w-full h-16 bg-white flex justify-between items-center px-4 sm:px-6 border-b z-10 shadow-sm">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Aperçu du document</h2>
    <div className="flex gap-2 sm:gap-3">
      <button 
        onClick={onClose}
        className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-all text-sm sm:text-base"
      >
        Fermer
      </button>
      <button 
        onClick={onExport}
        disabled={isExporting}
        className="px-3 sm:px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-all flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
      >
        {isExporting ? (
          <span>Export en cours...</span>
        ) : (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Exporter en PDF</span>
            <span className="sm:hidden">PDF</span>
          </>
        )}
      </button>
    </div>
  </div>
); 