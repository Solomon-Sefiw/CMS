declare module 'html-docx-js/dist/html-docx' {
  const htmlDocx: {
    asBlob: (html: string) => Blob;
    asHTML: (html: string) => string;
  };
  export default htmlDocx;
}
