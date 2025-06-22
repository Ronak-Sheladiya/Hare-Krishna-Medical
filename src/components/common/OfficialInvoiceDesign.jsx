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
    status = "Delivered",
  } = invoiceData;

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;
  const tax = calculatedTotal * 0.05;

  const createOfficialInvoiceHTML = () => {
    return `
      <div style="font-family: Arial, sans-serif; padding: ${forPrint ? "10px" : "20px"}; background: white; max-width: 210mm; margin: 0 auto; ${forPrint ? "height: auto; min-height: auto; transform: scale(0.95); transform-origin: top;" : ""}">
        <!-- Header Section - Official Design -->
        <div style="background: linear-gradient(135deg, #e63946 0%, #dc3545 100%); color: white; padding: 25px; border-radius: 15px 15px 0 0; margin-bottom: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <!-- Left Side - Company Info -->
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/invoice_hkm12345678-1-e0e726" alt="Logo" style="height: 70px; width: auto; margin-right: 20px; background: white; padding: 10px; border-radius: 10px;" onerror="this.src='https://via.placeholder.com/70x70?text=HKM';" />
                <div>
                  <h1 style="font-size: 28px; font-weight: bold; margin: 0; line-height: 1.2; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">HARE KRISHNA MEDICAL</h1>
                  <p style="font-size: 14px; margin: 5px 0; opacity: 0.9;">Your Trusted Health Partner</p>
                </div>
              </div>
              <div style="font-size: 12px; line-height: 1.6; opacity: 0.95;">
                <div>📍 3 Sahyog Complex, Man Sarovar circle</div>
                <div>🏙️ Amroli, 394107, Gujarat, India</div>
                <div>📞 +91 76989 13354 | +91 91060 18508</div>
                <div>�� harekrishnamedical@gmail.com</div>
              </div>
            </div>
            <!-- Right Side - Invoice Info -->
            <div style="text-align: right; min-width: 250px;">
              <h1 style="font-size: 42px; font-weight: bold; margin: 0 0 20px 0; text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">INVOICE</h1>
              <div style="background: rgba(255,255,255,0.95); color: #333; padding: 20px; border-radius: 10px; font-size: 13px; text-align: left; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Invoice No:</strong> ${invoiceId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Order No:</strong> ${orderId}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Date:</strong> ${orderDate}</div>
                <div style="margin-bottom: 8px;"><strong style="color: #e74c3c;">Time:</strong> ${orderTime}</div>
                <div><strong style="color: #e74c3c;">Status:</strong> <span style="background: #27ae60; color: white; padding: 4px 12px; border-radius: 15px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">${status}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div style="display: flex; gap: 20px; margin-bottom: 25px; margin-top: 0;">
          <!-- Bill To -->
          <div style="flex: 1; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 20px; border-radius: 0 0 0 15px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">📍 BILL TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${customerDetails.fullName}</div>
              <div>📧 ${customerDetails.email}</div>
              <div>📱 ${customerDetails.mobile}</div>
              <div>🏠 ${customerDetails.address}</div>
              <div>🏙️ ${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
            </div>
          </div>
          <!-- Ship To -->
          <div style="flex: 1; background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 0 0 15px 0;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🚚 SHIP TO:</h3>
            <div style="font-size: 13px; line-height: 1.8;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">${customerDetails.fullName}</div>
              <div>🏠 ${customerDetails.address}</div>
              <div>🏙️ ${customerDetails.city}, ${customerDetails.state} ${customerDetails.pincode}</div>
              <div style="margin-top: 12px;"><strong>💳 Payment:</strong> ${paymentMethod}</div>
              <div><strong>✅ Status:</strong> <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 8px;">${paymentStatus}</span></div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="margin-bottom: 25px;">
          <div style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 15px 25px; font-size: 18px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🛒 ORDERED ITEMS</div>
          <table style="width: 100%; border-collapse: collapse; border: 3px solid #9b59b6;">
            <thead>
              <tr style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white;">
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">S.No</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: left; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🏥 Description</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: center; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">Qty</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💰 Price (₹)</th>
                <th style="border: 2px solid #e67e22; padding: 15px 10px; font-size: 13px; font-weight: bold; text-align: right; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💵 Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr style="background-color: ${index % 2 === 0 ? "#f8f9fa" : "white"};">
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center; font-weight: bold; color: #9b59b6;">${index + 1}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px;">
                    <div style="font-weight: bold; color: #2c3e50; margin-bottom: 4px;">${item.name}</div>
                    <div style="color: #7f8c8d; font-size: 11px; font-style: italic;">🏢 ${item.company || "Medical Product"}</div>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: center;">
                    <span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">${item.quantity}</span>
                  </td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 12px; text-align: right; color: #27ae60; font-weight: bold;">₹${item.price.toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 12px 8px; font-size: 13px; text-align: right; font-weight: bold; color: #e74c3c;">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
          <div style="min-width: 350px;">
            <table style="width: 100%; border-collapse: collapse; border: 3px solid #e74c3c; border-radius: 10px; overflow: hidden;">
              <tbody>
                <tr>
                  <td style="background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%); border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #2c3e50;">📊 Subtotal:</td>
                  <td style="background: #ecf0f1; border: 1px solid #bdc3c7; padding: 12px 15px; font-size: 13px; text-align: right; color: #2c3e50; font-weight: bold;">₹${calculatedSubtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #d5f4e6 0%, #a2d9ce 100%); border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #27ae60;">🚚 Shipping:</td>
                  <td style="background: #d5f4e6; border: 1px solid #a2d9ce; padding: 12px 15px; font-size: 13px; text-align: right; color: #27ae60; font-weight: bold;">${shipping === 0 ? "FREE 🎉" : `₹${shipping.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #fdeaa7 0%, #f39c12 100%); border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; font-weight: bold; color: #f39c12;">📋 Tax (5%):</td>
                  <td style="background: #fdeaa7; border: 1px solid #f39c12; padding: 12px 15px; font-size: 13px; text-align: right; color: #f39c12; font-weight: bold;">₹${tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 16px; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">💎 TOTAL:</td>
                  <td style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border: 3px solid #c0392b; padding: 18px 15px; font-size: 18px; text-align: right; font-weight: bold; color: #fff; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">₹${calculatedTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%); color: white; padding: 25px; border-radius: 15px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1;">
              <h4 style="font-size: 18px; font-weight: bold; margin: 0 0 15px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">🙏 Thank You for Your Business! 🙏</h4>
              <div style="font-size: 12px; line-height: 1.8;">
                <div style="margin-bottom: 10px;"><strong style="color: #f39c12;">📋 Terms & Conditions:</strong></div>
                <div>✅ Payment due within 30 days</div>
                <div>❌ Goods once sold will not be taken back</div>
                <div>⚖️ Subject to Gujarat jurisdiction only</div>
                <div style="margin-top: 12px;"><strong style="color: #3498db;">📞 Contact:</strong> harekrishnamedical@gmail.com | +91 76989 13354</div>
              </div>
            </div>
            <div style="text-align: center; margin-left: 25px;">
              ${qrCode ? `<img src="${qrCode}" alt="QR Code" style="width: 90px; height: 90px; border: 3px solid #3498db; border-radius: 10px; padding: 5px; background: white;" />` : '<div style="width: 90px; height: 90px; border: 3px solid #3498db; border-radius: 10px; padding: 5px; background: white; display: flex; align-items: center; justify-content: center; color: #333; font-weight: bold;">QR CODE</div>'}
              <div style="font-size: 11px; margin-top: 8px; color: #ecf0f1;">📱 Scan for Online Verification</div>
            </div>
          </div>
        </div>

        <!-- Computer Generated Note -->
        <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #7f8c8d; background: #ecf0f1; padding: 12px; border-radius: 8px; border: 1px solid #bdc3c7;">
          🖥️ This is a computer generated invoice. No physical signature required.<br />
          📅 Generated on: ${new Date().toLocaleString()}
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
