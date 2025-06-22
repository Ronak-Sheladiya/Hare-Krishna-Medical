import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const ProfessionalInvoice = ({
  invoiceData,
  qrCode = null,
  forPrint = false,
}) => {
  const [generatedQR, setGeneratedQR] = useState("");
  const [isPrintReady, setIsPrintReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const qrText = `Invoice: ${invoiceId}\nOrder: ${orderId}\nAmount: ₹${total}\nVerify: https://harekrishan.medical/verify/${invoiceId}`;
        const qrDataURL = await QRCode.toDataURL(qrText, {
          width: 100,
          margin: 1,
          color: {
            dark: "#1a202c",
            light: "#ffffff",
          },
        });
        setGeneratedQR(qrDataURL);
        setIsPrintReady(true);
      } catch (error) {
        console.error("QR generation error:", error);
        setIsPrintReady(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (invoiceId && orderId) {
      generateQR();
    } else {
      setIsLoading(false);
      setIsPrintReady(true);
    }
  }, [invoiceId, orderId, total]);

  // Calculate totals
  const calculatedSubtotal =
    subtotal ||
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedTotal = total || calculatedSubtotal + shipping;

  const generateInvoiceHTML = () => {
    return `
      <div style="
        max-width: 210mm;
        margin: 0 auto;
        padding: 20px;
        background: white;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        color: #333;
        line-height: 1.6;
      ">
        <!-- Header Section -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 25px;
          border-bottom: 4px solid #e63946;
        ">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <img src="https://cdn.builder.io/api/v1/assets/ec4b3f82f1ac4275b8bfc1756fcac420/medical_logo-e586be?format=webp&width=800" 
                   alt="Hare Krishna Medical" 
                   style="width: 90px; height: 90px; object-fit: contain; margin-right: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
                   onerror="this.style.display='none';" />
              <div>
                <h1 style="
                  font-size: 32px;
                  font-weight: 800;
                  color: #e63946;
                  margin: 0 0 8px 0;
                  letter-spacing: -0.8px;
                ">HARE KRISHNA MEDICAL</h1>
                <p style="
                  font-size: 14px;
                  color: #718096;
                  font-weight: 500;
                  margin: 0;
                  font-style: italic;
                ">Your Trusted Healthcare Partner</p>
              </div>
            </div>
            
            <div style="
              background: linear-gradient(135deg, #f8f9fa 0%, #edf2f7 100%);
              padding: 20px;
              border-radius: 12px;
              border-left: 5px solid #e63946;
              font-size: 11px;
              line-height: 1.6;
            ">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="display: flex; align-items: center; color: #4a5568;">
                  <span style="margin-right: 8px; color: #e63946; font-weight: bold;">📍</span>
                  3 Sahyog Complex, Man Sarovar Circle
                </div>
                <div style="display: flex; align-items: center; color: #4a5568;">
                  <span style="margin-right: 8px; color: #e63946; font-weight: bold;">🏙️</span>
                  Amroli, Surat - 394107, Gujarat
                </div>
                <div style="display: flex; align-items: center; color: #4a5568;">
                  <span style="margin-right: 8px; color: #e63946; font-weight: bold;">📞</span>
                  +91 76989 13354
                </div>
                <div style="display: flex; align-items: center; color: #4a5568;">
                  <span style="margin-right: 8px; color: #e63946; font-weight: bold;">📧</span>
                  harekrishnamedical@gmail.com
                </div>
              </div>
            </div>
          </div>
          
          <div style="text-align: right; min-width: 300px;">
            <h2 style="
              font-size: 48px;
              font-weight: 800;
              color: #1a202c;
              margin: 0 0 25px 0;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
              letter-spacing: -1px;
            ">INVOICE</h2>
            
            <div style="
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              padding: 25px;
              border-radius: 12px;
              border: 2px solid #e63946;
              box-shadow: 0 8px 25px rgba(230, 57, 70, 0.2);
              font-size: 12px;
            ">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600; color: #2d3748;">Invoice:</span>
                <span style="font-weight: 500; color: #4a5568;">${invoiceId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600; color: #2d3748;">Order:</span>
                <span style="font-weight: 500; color: #4a5568;">${orderId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600; color: #2d3748;">Date:</span>
                <span style="font-weight: 500; color: #4a5568;">${orderDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-weight: 600; color: #2d3748;">Time:</span>
                <span style="font-weight: 500; color: #4a5568;">${orderTime}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600; color: #2d3748;">Status:</span>
                <span style="
                  background: linear-gradient(135deg, #38a169, #2f855a);
                  color: white;
                  padding: 6px 14px;
                  border-radius: 20px;
                  font-size: 10px;
                  font-weight: 700;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                ">${status}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information Section -->
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 50px;
        ">
          <div style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            border-top: 6px solid #e63946;
            box-shadow: 0 8px 25px rgba(230, 57, 70, 0.1);
            transition: all 0.3s ease;
          ">
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f1f5f9;
            ">
              <span style="font-size: 18px; margin-right: 10px; color: #4a5568;">📋</span>
              <span style="
                font-size: 16px;
                font-weight: 700;
                color: #2d3748;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Bill To</span>
            </div>
            
            <div style="
              font-size: 18px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 15px;
              letter-spacing: -0.2px;
            ">${customerDetails.fullName}</div>
            
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Email:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.email}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Phone:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.mobile}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Address:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.address}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">City:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.city}, ${customerDetails.state}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">PIN:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.pincode}</span>
              </div>
            </div>
          </div>
          
          <div style="
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 30px;
            border-top: 6px solid #343a40;
            box-shadow: 0 8px 25px rgba(52, 58, 64, 0.1);
            transition: all 0.3s ease;
          ">
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 20px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f1f5f9;
            ">
              <span style="font-size: 18px; margin-right: 10px; color: #4a5568;">🚚</span>
              <span style="
                font-size: 16px;
                font-weight: 700;
                color: #2d3748;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">Ship To</span>
            </div>
            
            <div style="
              font-size: 18px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 15px;
              letter-spacing: -0.2px;
            ">${customerDetails.fullName}</div>
            
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Address:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.address}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">City:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.city}, ${customerDetails.state}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">PIN:</span>
                <span style="color: #2d3748; font-weight: 500;">${customerDetails.pincode}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Payment:</span>
                <span style="color: #2d3748; font-weight: 500;">${paymentMethod}</span>
              </div>
              <div style="display: flex; align-items: flex-start;">
                <span style="font-weight: 600; color: #4a5568; min-width: 80px;">Status:</span>
                <span style="
                  background: linear-gradient(135deg, #38a169, #2f855a);
                  color: white;
                  padding: 4px 10px;
                  border-radius: 16px;
                  font-size: 10px;
                  font-weight: 700;
                  text-transform: uppercase;
                ">${paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Section -->
        <div style="margin-bottom: 50px;">
          <div style="
            background: linear-gradient(135deg, #e63946, #dc3545);
            color: white;
            padding: 20px 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          ">
            <h3 style="
              font-size: 18px;
              font-weight: 700;
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 1px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            ">
              <span>🛒</span>
              <span>Medical Products & Services</span>
            </h3>
          </div>
          
          <table style="
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 12px 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          ">
            <thead>
              <tr style="background: linear-gradient(135deg, #f7fafc, #edf2f7);">
                <th style="
                  padding: 18px 15px;
                  text-align: center;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e2e8f0;
                  color: #2d3748;
                  width: 60px;
                ">#</th>
                <th style="
                  padding: 18px 15px;
                  text-align: left;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e2e8f0;
                  color: #2d3748;
                ">Description</th>
                <th style="
                  padding: 18px 15px;
                  text-align: center;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e2e8f0;
                  color: #2d3748;
                  width: 80px;
                ">Qty</th>
                <th style="
                  padding: 18px 15px;
                  text-align: right;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e2e8f0;
                  color: #2d3748;
                  width: 120px;
                ">Unit Price</th>
                <th style="
                  padding: 18px 15px;
                  text-align: right;
                  font-weight: 700;
                  font-size: 11px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  border-bottom: 2px solid #e2e8f0;
                  color: #2d3748;
                  width: 120px;
                ">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item, index) => `
                <tr style="
                  ${index % 2 === 1 ? "background: #fafbfc;" : "background: white;"}
                  border-bottom: 1px solid #f1f5f9;
                ">
                  <td style="
                    padding: 20px 15px;
                    text-align: center;
                    font-weight: 700;
                    color: #e63946;
                    font-size: 14px;
                  ">${index + 1}</td>
                  <td style="padding: 20px 15px; font-size: 12px;">
                    <div style="
                      font-weight: 600;
                      color: #1a202c;
                      margin-bottom: 6px;
                      font-size: 13px;
                      line-height: 1.3;
                    ">${item.name}</div>
                    <div style="
                      font-size: 10px;
                      color: #718096;
                      font-style: italic;
                      font-weight: 500;
                    ">${item.company || "Medical Product"}</div>
                  </td>
                  <td style="
                    padding: 20px 15px;
                    text-align: center;
                  ">
                    <span style="
                      background: linear-gradient(135deg, #e63946, #dc3545);
                      color: white;
                      padding: 6px 12px;
                      border-radius: 16px;
                      font-size: 11px;
                      font-weight: 700;
                      display: inline-block;
                      min-width: 35px;
                      box-shadow: 0 2px 4px rgba(230, 57, 70, 0.3);
                    ">${item.quantity}</span>
                  </td>
                  <td style="
                    padding: 20px 15px;
                    text-align: right;
                    font-weight: 600;
                    font-size: 12px;
                    color: #4a5568;
                  ">₹${item.price.toFixed(2)}</td>
                  <td style="
                    padding: 20px 15px;
                    text-align: right;
                    font-weight: 700;
                    font-size: 12px;
                    color: #38a169;
                  ">₹${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 50px;">
          <div style="
            min-width: 400px;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 25px;
              font-size: 13px;
              border-bottom: 1px solid #f1f5f9;
              background: linear-gradient(135deg, #f7fafc, #edf2f7);
            ">
              <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span>📊</span>
                <span>Subtotal</span>
              </span>
              <span style="font-weight: 700;">₹${calculatedSubtotal.toFixed(2)}</span>
            </div>
            
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 25px;
              font-size: 13px;
              border-bottom: 1px solid #f1f5f9;
              background: linear-gradient(135deg, #f0fff4, #dcfce7);
            ">
              <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span>🚚</span>
                <span>Shipping & Handling</span>
              </span>
              <span style="font-weight: 700; ${shipping === 0 ? "color: #38a169;" : ""}">
                ${shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
              </span>
            </div>
            
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 25px;
              font-size: 13px;
              border-bottom: 1px solid #f1f5f9;
              background: linear-gradient(135deg, #fffbeb, #fef3c7);
            ">
              <span style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span>📋</span>
                <span>Tax (GST)</span>
              </span>
              <span style="font-weight: 700; color: #3182ce;">Included in Price</span>
            </div>
            
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 25px;
              font-size: 16px;
              background: linear-gradient(135deg, #e63946, #dc3545);
              color: white;
              font-weight: 700;
            ">
              <span style="display: flex; align-items: center; gap: 8px;">
                <span>💎</span>
                <span>TOTAL AMOUNT</span>
              </span>
              <span>₹${calculatedTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 3px solid #f1f5f9;
        ">
          <div>
            <div style="margin-bottom: 30px;">
              <h4 style="
                font-size: 16px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 15px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <span>📋</span>
                <span>Terms & Conditions</span>
              </h4>
              <ul style="
                list-style: none;
                padding: 0;
                margin: 0;
              ">
                <li style="
                  margin-bottom: 8px;
                  font-size: 11px;
                  line-height: 1.5;
                  color: #4a5568;
                  position: relative;
                  padding-left: 20px;
                ">
                  <span style="
                    content: '●';
                    color: #e63946;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 0;
                  ">●</span>
                  Payment is due within 30 days from the invoice date
                </li>
                <li style="
                  margin-bottom: 8px;
                  font-size: 11px;
                  line-height: 1.5;
                  color: #4a5568;
                  position: relative;
                  padding-left: 20px;
                ">
                  <span style="
                    content: '●';
                    color: #e63946;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 0;
                  ">●</span>
                  Returns are accepted only for damaged items within 7 days
                </li>
                <li style="
                  margin-bottom: 8px;
                  font-size: 11px;
                  line-height: 1.5;
                  color: #4a5568;
                  position: relative;
                  padding-left: 20px;
                ">
                  <span style="
                    content: '●';
                    color: #e63946;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 0;
                  ">●</span>
                  This invoice is computer-generated and legally valid
                </li>
                <li style="
                  margin-bottom: 8px;
                  font-size: 11px;
                  line-height: 1.5;
                  color: #4a5568;
                  position: relative;
                  padding-left: 20px;
                ">
                  <span style="
                    content: '●';
                    color: #e63946;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 0;
                  ">●</span>
                  Subject to Gujarat jurisdiction for legal disputes
                </li>
                <li style="
                  margin-bottom: 8px;
                  font-size: 11px;
                  line-height: 1.5;
                  color: #4a5568;
                  position: relative;
                  padding-left: 20px;
                ">
                  <span style="
                    content: '●';
                    color: #e63946;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    top: 0;
                  ">●</span>
                  All prices are inclusive of applicable taxes
                </li>
              </ul>
            </div>
            
            <div style="
              background: linear-gradient(135deg, #f7fafc, #edf2f7);
              padding: 20px;
              border-radius: 10px;
              border-left: 4px solid #e63946;
            ">
              <div style="
                font-weight: 700;
                color: #2d3748;
                font-size: 12px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 6px;
              ">
                <span>📞</span>
                <span>Contact Information</span>
              </div>
              <div style="
                font-size: 10px;
                color: #4a5568;
                line-height: 1.6;
              ">
                <strong>Support:</strong> harekrishnamedical@gmail.com<br>
                <strong>Phone:</strong> +91 76989 13354<br>
                <strong>Emergency:</strong> +91 91060 18508<br>
                <strong>Hours:</strong> Mon-Sat, 9:00 AM - 8:00 PM
              </div>
            </div>
          </div>
          
          <div style="
            text-align: center;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            height: fit-content;
          ">
            <div style="
              font-size: 12px;
              font-weight: 700;
              color: #2d3748;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            ">
              <span>📱</span>
              <span>Verification QR</span>
            </div>
            ${
              generatedQR
                ? `<img src="${generatedQR}" alt="QR Code" style="width: 100px; height: 100px; margin: 0 auto 15px; border: 2px solid #f1f5f9; border-radius: 8px; display: block;" />`
                : '<div style="width: 100px; height: 100px; margin: 0 auto 15px; border: 2px dashed #cbd5e0; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #f7fafc; color: #718096; font-size: 10px; font-weight: 600;">QR Code</div>'
            }
            <div style="
              font-size: 9px;
              color: #718096;
              line-height: 1.4;
              font-weight: 500;
            ">
              Scan this QR code to verify<br>
              invoice authenticity and<br>
              access online copy
            </div>
          </div>
        </div>

        <!-- Bottom Notes -->
        <div style="
          margin-top: 40px;
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        ">
          <div style="
            font-size: 10px;
            color: #718096;
            line-height: 1.6;
          ">
            <span style="font-weight: 700; color: #2d3748;">🖥️ This is a computer-generated invoice - No signature required</span><br>
            Generated on: ${new Date().toLocaleString()} | 
            Invoice ID: ${invoiceId} | 
            <span style="font-weight: 700; color: #2d3748;">🔒 This document is protected and verified</span><br>
            <strong>Hare Krishna Medical</strong> - Licensed Medical Store - Gujarat, India
          </div>
        </div>
      </div>
    `;
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        background: "white",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Invoice Content */}
      <div
        style={{
          padding: "20px",
          background: "white",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: generateInvoiceHTML() }} />
      </div>
    </div>
  );
};

export default ProfessionalInvoice;
