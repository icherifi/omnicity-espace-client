declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
    };
    html2canvas?: {
      scale?: number;
      dpi?: number;
      letterRendering?: boolean;
      useCORS?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
      windowWidth?: number;
      windowHeight?: number;
      imageTimeout?: number;
      logging?: boolean;
    };
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
  }

  function html2pdf(): Html2PdfInstance;
  export = html2pdf;
} 