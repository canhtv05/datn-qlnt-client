// import { useRef } from "react";
// import html2canvas from "html2canvas-pro";
// import { jsPDF } from "jspdf";

// export const usePrintPdf = (namePdf: string) => {
//   const printRef = useRef(null);

//   const handleDownloadPdf = async () => {
//     const element = printRef.current;
//     if (!element) return;

//     const canvas = await html2canvas(element, { backgroundColor: "#fff" });
//     const data = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       orientation: "l",
//       unit: "px",
//       format: "a4",
//     });

//     const imgProperties = pdf.getImageProperties(data);
//     const pdfWidth = pdf.internal.pageSize.getWidth();

//     const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

//     pdf.addImage(data, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
//     pdf.save(`${namePdf}.pdf`);
//   };

//   return { handleDownloadPdf, printRef };
// };

import { useRef } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const usePrintPdf = (namePdf: string) => {
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#fff",
      scale: 1.2,
    });
    const imgData = canvas.toDataURL("image/jpeg", 1);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    pdf.save(`${namePdf}.pdf`);
  };

  return { handleDownloadPdf, printRef };
};
