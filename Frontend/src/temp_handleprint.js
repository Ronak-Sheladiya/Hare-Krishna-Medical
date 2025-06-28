// COMPREHENSIVE PRINT FUNCTIONALITY - UPDATED WITH PRINTING STATE
const handlePrint = () => {
  if (pdfUrl) {
    setPrinting(true);
    // Create print window immediately without asking permission
    const printWindow = window.open(
      pdfUrl,
      "_blank",
      "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes",
    );

    if (printWindow) {
      printWindow.document.title = `Invoice ${invoice?.invoiceId} - Print`;

      const setupPrintHandlers = () => {
        const afterPrint = () => {
          setTimeout(() => {
            printWindow.close();
            setPrinting(false);
          }, 3000); // Updated close time
        };

        printWindow.addEventListener("afterprint", afterPrint);
        printWindow.addEventListener("beforeunload", () => {
          printWindow.close();
          setPrinting(false);
        });
      };

      // Faster PDF loading and printing
      printWindow.onload = () => {
        setTimeout(() => {
          setupPrintHandlers();
          printWindow.focus();
          printWindow.print();
        }, 200); // Further reduced for faster printing
      };

      // Faster fallback
      setTimeout(() => {
        try {
          setupPrintHandlers();
          printWindow.focus();
          printWindow.print();
        } catch (error) {
          console.log("Fallback print trigger:", error);
        }
      }, 3000); // Updated fallback time

      // Faster auto-close
      setTimeout(() => {
        if (printWindow && !printWindow.closed) {
          printWindow.close();
          setPrinting(false);
        }
      }, 10000); // Extended auto-close time
    } else {
      setPrinting(false);
    }
  } else if (pdfGenerating) {
    // Wait for PDF generation to complete instead of showing warning
    setPrinting(true);
    const checkPdfReady = setInterval(() => {
      if (pdfUrl) {
        clearInterval(checkPdfReady);
        handlePrint(); // Recursively call once PDF is ready
      } else if (!pdfGenerating) {
        clearInterval(checkPdfReady);
        setPrinting(false);
        alert("PDF generation failed. Please try again.");
      }
    }, 500);
  } else {
    alert("PDF not available. Regenerating...");
    generateInvoicePDF();
  }
};
