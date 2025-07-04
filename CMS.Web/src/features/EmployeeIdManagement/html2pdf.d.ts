declare module "html2pdf.js" {
  const html2pdf: () => {
    from: (element: HTMLElement | string) => any;
    set: (opt: any) => any;
    save: () => void;
    outputPdf?: () => any;
  };
  export default html2pdf;
}
