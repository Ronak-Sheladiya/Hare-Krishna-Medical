import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

// Generate QR code for invoice verification
export const generateInvoiceQR = async (orderId) => {
  try {
    const verifyUrl = `${window.location.origin}/invoice/${orderId}`;
    const qrDataURL = await QRCode.toDataURL(verifyUrl, {
      width: 120,
      margin: 2,
      color: {
        dark: "#1a202c",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    });
    return qrDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

// Centralized invoice view function - opens popup
export const viewInvoice = async (invoiceData, qrCode = null) => {
  try {
    // Generate QR code if not provided
    const invoiceQR = qrCode || (await generateInvoiceQR(invoiceData.orderId));

    // Create modal content
    const modalId = "invoice-view-modal";

    // Remove existing modal if any
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal HTML
    const modalHTML = `
      <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; border-radius: 12px; max-width: 90vw; max-height: 90vh; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <div style="background: #e63946; color: white; padding: 15px 20px; display: flex; justify-content: between; align-items: center;">
            <h3 style="margin: 0; font-size: 18px;">Invoice Details - ${invoiceData.invoiceId}</h3>
            <button id="close-invoice-modal" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; margin-left: auto;">&times;</button>
          </div>
          <div id="invoice-modal-content" style="padding: 0; max-height: 70vh; overflow-y: auto;">
            <!-- Invoice content will be inserted here -->
          </div>
          <div style="background: #f8f9fa; padding: 15px 20px; border-top: 1px solid #ddd; display: flex; gap: 10px; justify-content: flex-end;">
            <button id="print-from-modal" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              <span style="margin-right: 8px;">🖨️</span> Print
            </button>
            <button id="download-from-modal" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              <span style="margin-right: 8px;">📥</span> Download
            </button>
            <button id="close-invoice-modal-btn" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;">Close</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Import and render invoice component
    const OfficialInvoiceDesign = (
      await import("../components/common/OfficialInvoiceDesign.jsx")
    ).default;
    const React = (await import("react")).default;
    const { createRoot } = await import("react-dom/client");

    const modalContent = document.getElementById("invoice-modal-content");
    const root = createRoot(modalContent);

    root.render(
      React.createElement(OfficialInvoiceDesign, {
        invoiceData,
        qrCode: invoiceQR,
        forPrint: false,
      }),
    );

    // Add event listeners
    const closeModal = () => {
      const modal = document.getElementById(modalId);
      if (modal) {
        root.unmount();
        modal.remove();
      }
    };

    document.getElementById("close-invoice-modal").onclick = closeModal;
    document.getElementById("close-invoice-modal-btn").onclick = closeModal;
    document.getElementById(modalId).onclick = (e) => {
      if (e.target.id === modalId) closeModal();
    };

    // Add print and download handlers
    document.getElementById("print-from-modal").onclick = () =>
      printInvoice(invoiceData, invoiceQR);
    document.getElementById("download-from-modal").onclick = () =>
      downloadInvoice(invoiceData, invoiceQR);

    return true;
  } catch (error) {
    console.error("Error viewing invoice:", error);
    alert("Error viewing invoice. Please try again.");
    return false;
  }
};

// Centralized print function
export const printInvoice = async (invoiceData, qrCode = null) => {
  try {
    // Generate QR code if not provided
    const invoiceQR = qrCode || (await generateInvoiceQR(invoiceData.orderId));

    // Create temporary element for printing
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm";
    tempDiv.style.backgroundColor = "white";
    document.body.appendChild(tempDiv);

    // Import and render invoice component
    const OfficialInvoiceDesign = (
      await import("../components/common/OfficialInvoiceDesign.jsx")
    ).default;
    const React = (await import("react")).default;
    const { createRoot } = await import("react-dom/client");

    const root = createRoot(tempDiv);
    root.render(
      React.createElement(OfficialInvoiceDesign, {
        invoiceData,
        qrCode: invoiceQR,
        forPrint: true,
      }),
    );

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create print content with reduced height
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceId}</title>
          <style>
            @page { size: A4; margin: 0.2in; }
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              transform: scale(0.8);
              transform-origin: top left;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `;

    // Create temporary iframe for printing
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.top = "-10000px";
    printFrame.style.left = "-10000px";
    document.body.appendChild(printFrame);

    printFrame.contentDocument.write(printContent);
    printFrame.contentDocument.close();

    // Wait for content to load then print
    setTimeout(() => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
        root.unmount();
        document.body.removeChild(tempDiv);
      }, 1000);
    }, 500);

    return true;
  } catch (error) {
    console.error("Error printing invoice:", error);
    alert("Error printing invoice. Please try again.");
    return false;
  }
};

// Centralized download function
export const downloadInvoice = async (invoiceData, qrCode = null) => {
  try {
    // Generate QR code if not provided
    const invoiceQR = qrCode || (await generateInvoiceQR(invoiceData.orderId));

    // Create temporary element
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm";
    tempDiv.style.backgroundColor = "white";
    document.body.appendChild(tempDiv);

    // Import and render invoice component
    const OfficialInvoiceDesign = (
      await import("../components/common/OfficialInvoiceDesign.jsx")
    ).default;
    const React = (await import("react")).default;
    const { createRoot } = await import("react-dom/client");

    const root = createRoot(tempDiv);
    root.render(
      React.createElement(OfficialInvoiceDesign, {
        invoiceData,
        qrCode: invoiceQR,
        forPrint: true,
      }),
    );

    // Wait for rendering
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate PDF
    const canvas = await html2canvas(tempDiv, {
      scale: 2.5,
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      const scaleFactor = (pageHeight - 5) / imgHeight;
      const scaledWidth = imgWidth * scaleFactor;
      const scaledHeight = pageHeight - 5;
      const xOffset = (imgWidth - scaledWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 2.5, scaledWidth, scaledHeight);
    } else {
      const yOffset = (pageHeight - imgHeight) / 2;
      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
    }

    // Download with invoice ID as filename
    pdf.save(`${invoiceData.invoiceId}.pdf`);

    // Clean up
    root.unmount();
    document.body.removeChild(tempDiv);

    return true;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Error downloading invoice. Please try again.");
    return false;
  }
};

// Helper function to create invoice data from order
export const createInvoiceData = (order, customInvoiceId = null) => {
  return {
    invoiceId:
      customInvoiceId ||
      `INV${order.id?.slice(-6) || order.orderId?.slice(-6) || "123456"}`,
    orderId: order.id || order.orderId,
    orderDate: order.date || order.orderDate,
    orderTime: order.time || order.orderTime || "00:00:00",
    customerDetails: order.customerDetails || {
      fullName: order.customerName || "Customer",
      email: order.customerEmail || "",
      mobile: order.customerPhone || order.customerMobile || "",
      address: order.customerAddress || order.address || "",
      city: order.city || "Surat",
      state: order.state || "Gujarat",
      pincode: order.pincode || "395007",
    },
    items: order.items || [],
    subtotal: order.subtotal || 0,
    shipping: order.shipping || 0,
    total: order.total || 0,
    paymentMethod: order.paymentMethod || "Cash on Delivery",
    paymentStatus:
      order.paymentStatus ||
      (order.status === "Delivered" ? "Paid" : "Pending"),
    status: order.status || "Pending",
  };
};
