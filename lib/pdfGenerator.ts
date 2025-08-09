import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePdf = async (elementId: string, fileName: string) => {
  const exportContainer = document.getElementById(elementId);
  if (!exportContainer) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  const pages = exportContainer.querySelectorAll('.report-page') as NodeListOf<HTMLElement>;
  if (pages.length === 0) {
    console.error('No pages found to export within the element.');
    return;
  }

  // Get app shell elements to hide them during capture
  const header = document.getElementById('app-header');
  const sidebar = document.getElementById('app-sidebar');
  const headerOriginalDisplay = header ? header.style.display : '';
  const sidebarOriginalDisplay = sidebar ? sidebar.style.display : '';
  if (header) header.style.display = 'none';
  if (sidebar) sidebar.style.display = 'none';
  
  // Hide on-page controls
  const controls = document.querySelector('.pdf-controls');
  const controlsOriginalDisplay = controls ? (controls as HTMLElement).style.display : '';
  if (controls) (controls as HTMLElement).style.display = 'none';

  try {
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const computedStyle = getComputedStyle(page);
      const backgroundColor = computedStyle.backgroundColor;

      const canvas = await html2canvas(page, {
        scale: 2, // Higher scale for better resolution
        useCORS: true,
        backgroundColor: backgroundColor,
        width: page.offsetWidth,
        height: page.offsetHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasRatio = canvasHeight / canvasWidth;
      
      let finalWidth = pdfWidth;
      let finalHeight = finalWidth * canvasRatio;

      if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight / canvasRatio;
      }
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      if (i > 0) {
        pdf.addPage([pdfWidth, pdfHeight], 'p');
      }

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    }
    
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
     // Restore original display styles
    if (header) header.style.display = headerOriginalDisplay;
    if (sidebar) sidebar.style.display = sidebarOriginalDisplay;
    if (controls) (controls as HTMLElement).style.display = controlsOriginalDisplay || 'flex';
  }
};