import React from "react";

const OfficialInvoiceDesign = ({ invoiceData, qrCode, forPrint = false }) => {
  const {
    invoiceId,
    orderId,
    orderDate,
    orderTime,
    customerDetails,
    items = [],
    subtotal,
    shipping = 0,
    total,
    paymentMethod,
    paymentStatus,
    status = "Pending",
  } = invoiceData;

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;
  const tax = 0; // Tax included in product price

  const createOfficialInvoiceHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; padding: ${forPrint ? "5px" : "15px"}; background: white; max-width: 210mm; margin: 0 auto; ${forPrint ? "height: auto; min-height: auto; transform: scale(0.85); transform-origin: top;" : ""}">
        <!-- Header Section - Simple Design -->
        <div style="background: #e63946; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800" alt="Hare Krishna Medical Logo" style="height: 60px; width: auto; margin-right: 15px; background: white; padding: 8px; border-radius: 8px;" onerror="this.style.display='none';" />
                <div>
                  <h1 style="font-size: 24px; font-weight: bold; margin: 0; line-height: 1.2;">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 12px; margin: 3px 0; opacity: 0.9;">Your Trusted Health Partner</p>
                </div>
              </div>
              <div style="font-size: 11px; line-height: 1.4; opacity: 0.95;">
                <div>3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat</div>
                <div>Phone: +91 76989 13354 | +91 91060 18508</div>
                <div>Email: hkmedicalamroli@gmail.com</div>
              </div>
            </div>
            <!-- Right Side - Invoice Info -->
            <div style="text-align: right; min-width: 200px;">
              <h2 style="font-size: 28px; font-weight: bold; margin: 0 0 15px 0;">INVOICE</h2>
              <div style="background: rgba(255,255,255,0.95); color: #333; padding: 15px; border-radius: 8px; font-size: 12px; text-align: left;">
                <div style="margin-bottom: 6px;"><strong>Invoice:</strong> ${invoiceId}</div>
                <div style="margin-bottom: 6px;"><strong>Order:</strong> ${orderId}</div>
                <div style="margin-bottom: 6px;"><strong>Date:</strong> ${orderDate}</div>
                <div style="margin-bottom: 6px;"><strong>Time:</strong> ${orderTime}</div>
                <div><strong>Status:</strong> <span style="background: #27ae60; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${status}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
          <!-- Bill To -->
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
            <h4 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #3498db;">BILL TO</h4>
            <div style="font-size: 12px; line-height: 1.6; color: #333;">
              <div style="font-weight: bold; margin-bottom: 5px;">${customerDetails.fullName}</div>
              <div>${customerDetails.email}</div>
              <div>${customerDetails.mobile}</div>
              <div>${customerDetails.address}</div>
              <div>${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
            </div>
          </div>
          <!-- Ship To -->
          <div style="flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h4 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #27ae60;">SHIP TO</h4>
            <div style="font-size: 12px; line-height: 1.6; color: #333;">
              <div style="font-weight: bold; margin-bottom: 5px;">${customerDetails.fullName}</div>
              <div>${customerDetails.address}</div>
              <div>${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
              <div style="margin-top: 8px;"><strong>Payment:</strong> ${paymentMethod}</div>
              <div><strong>Status:</strong> <span style="background: #27ae60; color: white; padding: 1px 6px; border-radius: 8px; font-size: 10px;">${paymentStatus}</span></div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 20px;">
          <h4 style="background: #e63946; color: white; padding: 10px 15px; margin: 0 0 0 0; font-size: 14px; font-weight: bold;">ORDERED ITEMS</h4>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 10px 8px; font-size: 12px; font-weight: bold; text-align: center;">No.</th>
                <th style="border: 1px solid #ddd; padding: 10px 8px; font-size: 12px; font-weight: bold; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 10px 8px; font-size: 12px; font-weight: bold; text-align: center;">Qty</th>
                <th style="border: 1px solid #ddd; padding: 10px 8px; font-size: 12px; font-weight: bold; text-align: right;">Price (₹)</th>
                <th style="border: 1px solid #ddd; padding: 10px 8px; font-size: 12px; font-weight: bold; text-align: right;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                  <td style="border: 1px solid #ddd; padding: 10px 8px; font-size: 11px; text-align: center;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 10px 8px; font-size: 11px;">
                    <div style="font-weight: bold; margin-bottom: 2px;">${item.name}</div>
                    <div style="color: #666; font-size: 10px;">${item.company || "Medical Product"}</div>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 10px 8px; font-size: 11px; text-align: center;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 10px 8px; font-size: 11px; text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px 8px; font-size: 11px; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
          <div style="min-width: 300px;">
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
              <tbody>
                <tr>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; font-weight: bold;">Subtotal:</td>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; text-align: right; font-weight: bold;">₹${calculatedSubtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; font-weight: bold;">Shipping:</td>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; text-align: right; font-weight: bold;">${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; font-weight: bold;">Tax:</td>
                  <td style="background: #f8f9fa; border: 1px solid #ddd; padding: 8px 12px; font-size: 12px; text-align: right; font-weight: bold;">Included in product price</td>
                </tr>
                <tr>
                  <td style="background: #e63946; border: 1px solid #e63946; padding: 12px 12px; font-size: 14px; font-weight: bold; color: white;">TOTAL:</td>
                  <td style="background: #e63946; border: 1px solid #e63946; padding: 12px 12px; font-size: 14px; text-align: right; font-weight: bold; color: white;">₹${calculatedTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <div style="flex: 1;">
            <h5 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #333;">Thank You for Your Business!</h5>
            <div style="font-size: 11px; line-height: 1.5; color: #666;">
              <div><strong>Terms:</strong> Payment due within 30 days</div>
              <div>Goods once sold will not be taken back</div>
              <div>Subject to Gujarat jurisdiction only</div>
              <div style="margin-top: 8px;"><strong>Contact:</strong> hkmedicalamroli@gmail.com | +91 76989 13354</div>
            </div>
          </div>
          <div style="text-align: center; margin-left: 20px;">
            ${qrCode ? `<img src="${qrCode}" alt="QR Code" style="width: 120px; height: 120px; border: 2px solid #e63946; border-radius: 8px; padding: 3px; background: white;" />` : '<div style="width: 120px; height: 120px; border: 2px solid #e63946; border-radius: 8px; padding: 3px; background: white; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; font-weight: bold;">QR CODE</div>'}
            <div style="font-size: 10px; margin-top: 5px; color: #666;">Scan to Verify</div>
          </div>
        </div>

        <!-- Computer Generated Note -->
        <div style="text-align: center; margin-top: 10px; font-size: 10px; color: #888; background: #f8f9fa; padding: 8px; border-radius: 5px;">
          Computer generated invoice - No signature required | Generated: ${new Date().toLocaleString()}
        </div>
      </div>
    `;
  };

  return (
    <div
      dangerouslySetInnerHTML={{ __html: createOfficialInvoiceHTML() }}
      style={forPrint ? { height: "auto", minHeight: "auto" } : {}}
    />
  );
};

export default OfficialInvoiceDesign;
