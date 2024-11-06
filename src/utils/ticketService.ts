import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateQRData = (bookingId: string, ticketType: string): string => {
  return JSON.stringify({
    bookingId,
    ticketType,
    timestamp: Date.now(),
    version: '1.0'
  });
};

export const generatePDF = async (ticketElement: HTMLElement): Promise<Blob> => {
  const canvas = await html2canvas(ticketElement, {
    scale: 2,
    logging: false,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob');
};

export const validateTicket = (qrData: string): boolean => {
  try {
    const data = JSON.parse(qrData);
    return !!(data.bookingId && data.ticketType && data.timestamp);
  } catch {
    return false;
  }
};