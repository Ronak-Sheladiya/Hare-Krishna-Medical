const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    // Validate email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("⚠️ Email service: EMAIL_USER or EMAIL_PASS not configured");
    }

    // Create transporter using correct nodemailer method
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Enhanced connection options for better reliability
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      pool: true, // Enable connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14, // send maximum 14 emails per second
    });

    // Configure transporter events for better error handling
    this.transporter.on("error", (error) => {
      console.error("📧 Email transporter error:", error);
    });

    this.transporter.on("idle", () => {
      console.log("📧 Email transporter is idle");
    });

    // Log email configuration status
    console.log("📧 Professional Email Service Configuration:");
    console.log(`   - Host: ${process.env.EMAIL_HOST || "smtp.gmail.com"}`);
    console.log(`   - Port: ${process.env.EMAIL_PORT || 587}`);
    console.log(
      `   - User: ${process.env.EMAIL_USER ? "✅ Configured" : "❌ Not configured"}`,
    );
    console.log(
      `   - Pass: ${process.env.EMAIL_PASS ? "✅ Configured" : "❌ Not configured"}`,
    );
  }

  // Enhanced email template with professional red theme
  getEmailTemplate(content, type = "general") {
    const websiteUrl =
      process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app";

    return `
      <!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Hare Krishna Medical Store</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          /* Reset and base styles */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

          /* Responsive design */
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; margin: 0 !important; }
            .content-padding { padding: 20px !important; }
            .features-grid { flex-direction: column !important; }
            .feature-item { min-width: 100% !important; margin-bottom: 15px !important; }
            .contact-info { flex-direction: column !important; gap: 10px !important; }
            .button-container { padding: 15px !important; }
            .main-button { width: 100% !important; padding: 18px 30px !important; font-size: 16px !important; }
            .logo-container { width: 80px !important; height: 80px !important; }
            .company-name { font-size: 24px !important; }
            .otp-box { padding: 25px !important; }
            .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
          }

          @media only screen and (max-width: 480px) {
            .content-padding { padding: 15px !important; }
            .logo-container { width: 70px !important; height: 70px !important; }
            .company-name { font-size: 20px !important; }
            .main-button { padding: 15px 25px !important; font-size: 14px !important; }
            .otp-code { font-size: 28px !important; letter-spacing: 6px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); min-height: 100vh;">

        <!-- Outer Table for Full Email Width -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); min-height: 100vh;">
          <tr>
            <td style="padding: 20px 10px;">

              <!-- Main Email Container -->
              <div class="container" style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 12px 40px rgba(230, 57, 70, 0.15), 0 4px 15px rgba(0,0,0,0.1); overflow: hidden;">

                <!-- Professional Header with Enhanced Red Gradient -->
                <div style="background: linear-gradient(135deg, #e63946 0%, #dc2626 25%, #b91c1c 50%, #991b1b 75%, #7f1d1d 100%); position: relative; overflow: hidden;">
                  <!-- Sophisticated Background Pattern -->
                  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 200\"><defs><pattern id=\"medical-pattern\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"white\" opacity=\"0.05\"/><path d=\"M20 10v20M10 20h20\" stroke=\"white\" stroke-width=\"0.5\" opacity=\"0.03\"/></pattern></defs><rect width=\"200\" height=\"200\" fill=\"url(%23medical-pattern)\"/></svg>'); opacity: 0.1;"></div>

                  <!-- Header Content -->
                  <div class="content-padding" style="position: relative; padding: 45px 40px; text-align: center; color: #ffffff;">

                    <!-- Enhanced Logo Section -->
                    <div class="logo-container" style="background: rgba(255, 255, 255, 0.98); border-radius: 50%; padding: 20px; width: 120px; height: 120px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(0,0,0,0.2), 0 0 0 4px rgba(255,255,255,0.1), 0 0 0 8px rgba(255,255,255,0.05);">
                      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #e63946, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        🏥
                      </div>
                    </div>

                    <!-- Enhanced Company Name -->
                    <h1 class="company-name" style="margin: 0 0 10px 0; font-family: 'Segoe UI', sans-serif; font-size: 32px; font-weight: 700; text-shadow: 0 3px 6px rgba(0,0,0,0.3); letter-spacing: 1.5px; line-height: 1.2;">
                      HARE KRISHNA MEDICAL STORE
                    </h1>

                    <!-- Elegant Divider -->
                    <div style="width: 100px; height: 3px; background: rgba(255,255,255,0.9); margin: 0 auto 15px; border-radius: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>

                    <!-- Professional Tagline -->
                    <p style="margin: 0 0 20px 0; font-size: 18px; opacity: 0.95; font-style: italic; font-weight: 300;">Your Trusted Healthcare & Wellness Partner</p>

                    <!-- Professional Badge -->
                    <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); border-radius: 25px; padding: 10px 25px; backdrop-filter: blur(10px);">
                      <span style="font-size: 14px; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">🏥 Professional Medical Services Since 2020</span>
                    </div>
                  </div>
                </div>

                <!-- Dynamic Content Area -->
                <div class="content-padding" style="padding: 45px 40px;">
                  ${content}
                </div>

                <!-- Professional Invoice-Themed Footer -->
                <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%); color: #ffffff; padding: 35px 40px; position: relative; overflow: hidden;">

                  <!-- Footer Background Pattern -->
                  <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"invoice-pattern\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><rect width=\"20\" height=\"20\" fill=\"none\" stroke=\"white\" stroke-width=\"0.1\" opacity=\"0.03\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23invoice-pattern)\"/></svg>'); opacity: 0.1;"></div>

                  <!-- Footer Content -->
                  <div style="position: relative;">

                    <!-- Invoice Header -->
                    <div style="text-align: center; border-bottom: 2px solid rgba(255,255,255,0.2); padding-bottom: 25px; margin-bottom: 25px;">
                      <h3 style="margin: 0 0 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; color: #ffffff; font-weight: 600;">
                        📄 OFFICIAL MEDICAL INVOICE & VERIFICATION
                      </h3>
                      <p style="margin: 0; font-size: 14px; opacity: 0.9; font-style: italic;">
                        Certified Healthcare Provider | License No: MED-2020-HK-394107
                      </p>
                    </div>

                    <!-- Business Details in Invoice Format -->
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 30px; margin-bottom: 25px;">

                      <!-- Left Column: Business Address -->
                      <div style="flex: 1; min-width: 250px;">
                        <h4 style="margin: 0 0 15px 0; color: #e63946; font-size: 16px; font-weight: 600; border-bottom: 1px solid rgba(230,57,70,0.3); padding-bottom: 5px;">
                          📍 REGISTERED OFFICE
                        </h4>
                        <div style="font-size: 13px; line-height: 1.6; opacity: 0.9;">
                          <p style="margin: 0 0 5px 0;"><strong>Hare Krishna Medical Store</strong></p>
                          <p style="margin: 0 0 5px 0;">3 Sahyog Complex, Man Sarovar Circle</p>
                          <p style="margin: 0 0 5px 0;">Amroli, Gujarat - 394107, India</p>
                          <p style="margin: 0 0 5px 0;"><strong>GST:</strong> 24XXXXX1234X1XX</p>
                          <p style="margin: 0;"><strong>Drug License:</strong> GJ-MED-2020-001</p>
                        </div>
                      </div>

                      <!-- Right Column: Contact Information -->
                      <div style="flex: 1; min-width: 250px;">
                        <h4 style="margin: 0 0 15px 0; color: #e63946; font-size: 16px; font-weight: 600; border-bottom: 1px solid rgba(230,57,70,0.3); padding-bottom: 5px;">
                          📞 CONTACT DETAILS
                        </h4>
                        <div style="font-size: 13px; line-height: 1.6; opacity: 0.9;">
                          <p style="margin: 0 0 5px 0;"><strong>Primary:</strong> +91 76989 13354</p>
                          <p style="margin: 0 0 5px 0;"><strong>Secondary:</strong> +91 91060 18508</p>
                          <p style="margin: 0 0 5px 0;"><strong>Email:</strong> hkmedicalamroli@gmail.com</p>
                          <p style="margin: 0 0 5px 0;"><strong>Website:</strong> ${websiteUrl}</p>
                          <p style="margin: 0;"><strong>Instagram:</strong> @harekrishna_medical</p>
                        </div>
                      </div>
                    </div>

                    <!-- Professional Certifications -->
                    <div style="background: rgba(230,57,70,0.1); border: 1px solid rgba(230,57,70,0.3); border-radius: 10px; padding: 20px; margin-bottom: 25px;">
                      <h4 style="margin: 0 0 12px 0; color: #e63946; font-size: 14px; font-weight: 600; text-align: center;">
                        🏆 PROFESSIONAL CERTIFICATIONS & ACCREDITATIONS
                      </h4>
                      <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; font-size: 12px; color: #ffffff;">
                        <span style="background: rgba(40,167,69,0.2); padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(40,167,69,0.3);">✓ Licensed Medical Store</span>
                        <span style="background: rgba(40,167,69,0.2); padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(40,167,69,0.3);">✓ ISO 9001:2015 Certified</span>
                        <span style="background: rgba(40,167,69,0.2); padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(40,167,69,0.3);">✓ FDA Approved Products</span>
                        <span style="background: rgba(40,167,69,0.2); padding: 5px 12px; border-radius: 15px; border: 1px solid rgba(40,167,69,0.3);">✓ Expert Consultation</span>
                      </div>
                    </div>

                    <!-- Legal & Verification Notice -->
                    <div style="border-top: 2px solid rgba(255,255,255,0.2); padding-top: 20px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; opacity: 0.8; font-weight: 500;">
                        🔒 This email is digitally verified and contains confidential medical information
                      </p>
                      <p style="margin: 0 0 8px 0; font-size: 11px; opacity: 0.7;">
                        © 2024 Hare Krishna Medical Store. All rights reserved. | Privacy Policy | Terms of Service
                      </p>
                      <p style="margin: 0; font-size: 10px; opacity: 0.6; font-style: italic;">
                        Designed with ❤️ for your health and wellness | Email ID: ${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).substr(2, 9).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(email, fullName) {
    console.log("📧 Sending professional welcome email to:", email);

    const websiteUrl =
      process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app";

    const welcomeContent = `
      <!-- Personalized Welcome Message -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; position: relative; overflow: hidden;">
          <!-- Decorative Elements -->
          <div style="position: absolute; top: -15px; right: -15px; width: 50px; height: 50px; background: #e63946; border-radius: 50%; opacity: 0.1;"></div>
          <div style="position: absolute; bottom: -15px; left: -15px; width: 30px; height: 30px; background: #e63946; border-radius: 50%; opacity: 0.1;"></div>

          <h2 style="color: #e63946; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(230,57,70,0.1);">
            🎉 Welcome to Our Medical Family!
          </h2>
          <p style="color: #6b7280; font-size: 18px; line-height: 1.7; margin: 0 0 15px 0;">
            Dear <strong style="color: #e63946; font-size: 22px; text-shadow: 0 1px 2px rgba(230,57,70,0.1);">${fullName}</strong>,
          </p>
          <p style="color: #6b7280; font-size: 17px; line-height: 1.7; margin: 0;">
            We are absolutely delighted to welcome you to <strong style="color: #e63946;">Hare Krishna Medical Store</strong> –
            where professional healthcare meets excellence. Thank you for choosing us as your trusted medical partner.
          </p>
        </div>
      </div>

      <!-- Professional Services Overview -->
      <div style="margin: 40px 0;">
        <h3 style="color: #e63946; margin-bottom: 30px; font-family: 'Segoe UI', sans-serif; font-size: 26px; text-align: center; font-weight: 600; text-shadow: 0 2px 4px rgba(230,57,70,0.1);">
          🏥 Our Professional Healthcare Services
        </h3>

        <!-- Services Grid -->
        <div class="features-grid" style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: space-between; margin-bottom: 30px;">

          <!-- Service 1 -->
          <div class="feature-item" style="flex: 1; min-width: 280px; background: linear-gradient(135deg, #ffffff, #fafafa); border: 3px solid #e63946; border-radius: 15px; padding: 30px; box-shadow: 0 8px 25px rgba(230,57,70,0.1); text-align: center; transition: transform 0.3s ease;">
            <div style="background: linear-gradient(135deg, #e63946, #dc2626); color: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; box-shadow: 0 6px 20px rgba(230,57,70,0.3);">🏥</div>
            <h4 style="color: #1f2937; margin: 0 0 12px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">Premium Medical Products</h4>
            <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6;">Access our extensive catalog of authenticated medicines, medical equipment, and health supplements</p>
          </div>

          <!-- Service 2 -->
          <div class="feature-item" style="flex: 1; min-width: 280px; background: linear-gradient(135deg, #ffffff, #fafafa); border: 3px solid #e63946; border-radius: 15px; padding: 30px; box-shadow: 0 8px 25px rgba(230,57,70,0.1); text-align: center; transition: transform 0.3s ease;">
            <div style="background: linear-gradient(135deg, #e63946, #dc2626); color: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; box-shadow: 0 6px 20px rgba(230,57,70,0.3);">🛒</div>
            <h4 style="color: #1f2937; margin: 0 0 12px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">Seamless Online Ordering</h4>
            <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6;">Place orders effortlessly through our professional platform with secure payment processing</p>
          </div>
        </div>

        <div class="features-grid" style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: space-between;">

          <!-- Service 3 -->
          <div class="feature-item" style="flex: 1; min-width: 280px; background: linear-gradient(135deg, #ffffff, #fafafa); border: 3px solid #e63946; border-radius: 15px; padding: 30px; box-shadow: 0 8px 25px rgba(230,57,70,0.1); text-align: center; transition: transform 0.3s ease;">
            <div style="background: linear-gradient(135deg, #e63946, #dc2626); color: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; box-shadow: 0 6px 20px rgba(230,57,70,0.3);">📦</div>
            <h4 style="color: #1f2937; margin: 0 0 12px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">Real-Time Order Tracking</h4>
            <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6;">Monitor your orders with instant notifications, SMS updates, and real-time delivery tracking</p>
          </div>

          <!-- Service 4 -->
          <div class="feature-item" style="flex: 1; min-width: 280px; background: linear-gradient(135deg, #ffffff, #fafafa); border: 3px solid #e63946; border-radius: 15px; padding: 30px; box-shadow: 0 8px 25px rgba(230,57,70,0.1); text-align: center; transition: transform 0.3s ease;">
            <div style="background: linear-gradient(135deg, #e63946, #dc2626); color: white; width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px; box-shadow: 0 6px 20px rgba(230,57,70,0.3);">📄</div>
            <h4 style="color: #1f2937; margin: 0 0 12px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">Professional Digital Records</h4>
            <p style="color: #6b7280; margin: 0; font-size: 15px; line-height: 1.6;">Access professional invoices, prescription history, and complete order management system</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Call to Action -->
      <div style="text-align: center; margin: 50px 0;">
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px;">
          <h3 style="color: #e63946; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 24px; font-weight: 600;">Ready to Experience Professional Healthcare?</h3>
          <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 17px; line-height: 1.7;">
            Explore our comprehensive medical store and discover why thousands of customers trust us for their healthcare needs across Gujarat.
          </p>

          <div class="button-container" style="margin-bottom: 20px;">
            <a href="${websiteUrl}"
               class="main-button"
               style="display: inline-block; background: linear-gradient(135deg, #e63946, #dc2626); color: #ffffff; text-decoration: none; padding: 20px 45px; border-radius: 35px; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(230,57,70,0.4); transition: all 0.3s ease; border: 3px solid transparent; text-transform: uppercase; letter-spacing: 1px;">
              🌐 Explore Our Medical Store
            </a>
          </div>

          <p style="color: #9ca3af; margin: 0; font-size: 14px; font-style: italic;">
            Join thousands of satisfied customers who trust us for their healthcare needs
          </p>
        </div>
      </div>

      <!-- Professional Support Information -->
      <div style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); border: 3px solid #e63946; border-radius: 20px; padding: 35px; margin: 40px 0; text-align: center;">
        <h4 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">📞 24/7 Professional Healthcare Support</h4>
        <p style="color: #6b7280; margin: 0 0 30px 0; line-height: 1.7; font-size: 17px;">
          Our certified medical professionals and customer care team are available round-the-clock to provide expert guidance, answer your queries, and ensure the best healthcare experience.
        </p>

        <div class="contact-info" style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
          <div style="text-align: center; background: #ffffff; border-radius: 15px; padding: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); min-width: 220px; border: 2px solid #f3f4f6;">
            <div style="color: #e63946; font-size: 28px; margin-bottom: 12px;">📞</div>
            <strong style="color: #1f2937; font-size: 17px; display: block; margin-bottom: 8px;">Professional Helpline</strong>
            <span style="color: #e63946; font-weight: 600; font-size: 16px;">+91 76989 13354</span>
          </div>

          <div style="text-align: center; background: #ffffff; border-radius: 15px; padding: 25px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); min-width: 220px; border: 2px solid #f3f4f6;">
            <div style="color: #e63946; font-size: 28px; margin-bottom: 12px;">📧</div>
            <strong style="color: #1f2937; font-size: 17px; display: block; margin-bottom: 8px;">Email Support</strong>
            <span style="color: #e63946; font-weight: 600; font-size: 16px;">hkmedicalamroli@gmail.com</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Professional Credentials -->
      <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 15px; padding: 30px; margin: 35px 0; text-align: center;">
        <h4 style="color: #047857; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">🏆 Why Choose Hare Krishna Medical Store?</h4>
        <div style="display: flex; justify-content: center; gap: 25px; flex-wrap: wrap; font-size: 15px; color: #047857; font-weight: 500;">
          <span style="background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3);">✓ Government Licensed Medical Store</span>
          <span style="background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3);">✓ 100% Authentic Products</span>
          <span style="background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3);">✓ Expert Medical Consultation</span>
          <span style="background: rgba(16,185,129,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(16,185,129,0.3);">✓ Same-Day Delivery Available</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "🌟 Welcome to Hare Krishna Medical Store - Your Trusted Healthcare Partner",
      html: this.getEmailTemplate(welcomeContent, "welcome"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Professional welcome email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending welcome email to",
        email,
        ":",
        error.message,
      );
      await this.logEmailError(error, "welcome", email);
      throw error;
    }
  }

  async sendVerificationEmail(email, fullName, otp) {
    console.log("📧 Sending professional OTP verification email to:", email);

    const otpContent = `
      <!-- Personalized OTP Message -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 30px; font-weight: 700;">
          📧 Email Verification Required
        </h2>
        <p style="color: #6b7280; font-size: 18px; line-height: 1.7; margin: 0 0 15px 0;">
          Dear <strong style="color: #e63946; font-size: 20px;">${fullName}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 17px; line-height: 1.7; margin: 0;">
          Thank you for registering with <strong style="color: #e63946;">Hare Krishna Medical Store</strong>.
          To complete your registration and secure your account, please verify your email address using the OTP below:
        </p>
      </div>

      <!-- Enhanced OTP Display -->
      <div class="otp-box" style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%); padding: 40px; border-radius: 20px; margin: 35px 0; text-align: center; border: 4px solid #e63946; box-shadow: 0 12px 35px rgba(230,57,70,0.2); position: relative; overflow: hidden;">

        <!-- Decorative Background -->
        <div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: #e63946; border-radius: 50%; opacity: 0.1;"></div>
        <div style="position: absolute; bottom: -20px; left: -20px; width: 60px; height: 60px; background: #e63946; border-radius: 50%; opacity: 0.1;"></div>

        <!-- OTP Header -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #e63946; margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">Your Verification Code</h3>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Enter this code to verify your email address</p>
        </div>

        <!-- OTP Code -->
        <div class="otp-code" style="background: linear-gradient(135deg, #ffffff, #f9fafb); border: 3px solid #e63946; border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: inset 0 2px 10px rgba(230,57,70,0.1);">
          <h2 style="color: #e63946; margin: 0; font-size: 48px; letter-spacing: 15px; font-family: 'Courier New', monospace; font-weight: 700; text-shadow: 0 3px 6px rgba(230,57,70,0.2);">${otp}</h2>
        </div>

        <!-- Validity Info -->
        <p style="color: #e63946; margin: 0; font-weight: 600; font-size: 16px;">
          ⏰ Valid for 10 minutes only
        </p>
      </div>

      <!-- Security Notice -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">🔒 Important Security Information:</h4>
        <ul style="margin: 0; color: #92400e; line-height: 1.7; padding-left: 20px;">
          <li><strong>This OTP expires in 10 minutes</strong> for your account security</li>
          <li>Never share this code with anyone, including our staff</li>
          <li>If you didn't request this verification, please ignore this email</li>
          <li>Our team will never ask for your OTP via phone or email</li>
        </ul>
      </div>

      <!-- Post-Verification Benefits -->
      <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #047857; font-size: 18px; font-weight: 600;">🏥 After Email Verification, You Can:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">🛍️ Shop Premium Products</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Browse our extensive medical catalog</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">📄 Professional Invoicing</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Receive digital invoices & receipts</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">📦 Order Tracking</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Real-time delivery updates</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">🩺 Expert Consultation</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Access to medical professionals</p>
          </div>
        </div>
      </div>

      <!-- Help & Support -->
      <div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 3px solid #8b5cf6; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #5b21b6; font-size: 18px; font-weight: 600;">Need Help with Verification?</h4>
        <p style="margin: 0 0 20px 0; color: #5b21b6; line-height: 1.6;">
          Our customer support team is available 24/7 to assist you with the verification process.
        </p>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <span style="background: rgba(139,92,246,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(139,92,246,0.3); color: #5b21b6; font-weight: 500;">📞 +91 76989 13354</span>
          <span style="background: rgba(139,92,246,0.1); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(139,92,246,0.3); color: #5b21b6; font-weight: 500;">📧 hkmedicalamroli@gmail.com</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Email Verification OTP - Hare Krishna Medical Store",
      html: this.getEmailTemplate(otpContent, "otp"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Professional OTP email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending verification OTP email to",
        email,
        ":",
        error.message,
      );
      await this.logEmailError(error, "otp", email);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, fullName, resetToken) {
    console.log("📧 Sending professional password reset email to:", email);

    const primaryDomain =
      process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app";
    const resetUrl = `${primaryDomain}/reset-password/${resetToken}`;

    const resetContent = `
      <!-- Reset Message -->
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 30px; font-weight: 700;">
          🔐 Password Reset Request
        </h2>
        <p style="color: #6b7280; font-size: 18px; line-height: 1.7; margin: 0 0 15px 0;">
          Hello <strong style="color: #e63946; font-size: 20px;">${fullName}</strong>,
        </p>
        <p style="color: #6b7280; font-size: 17px; line-height: 1.7; margin: 0;">
          We received a request to reset your password for your <strong style="color: #e63946;">Hare Krishna Medical Store</strong> account.
          If this was you, click the button below to create a new secure password:
        </p>
      </div>

      <!-- Reset Button -->
      <div style="text-align: center; margin: 40px 0;">
        <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px;">
          <h3 style="color: #e63946; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">
            Click Below to Reset Your Password
          </h3>

          <div class="button-container" style="margin: 30px 0;">
            <a href="${resetUrl}"
               class="main-button"
               style="display: inline-block; background: linear-gradient(135deg, #e63946, #dc2626); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(230,57,70,0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
              🔑 Reset My Password
            </a>
          </div>

          <p style="color: #9ca3af; margin: 0; font-size: 14px; font-style: italic;">
            Secure password reset with military-grade encryption
          </p>
        </div>
      </div>

      <!-- Security Notice */
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">⏰ Important Security Notice:</h4>
        <ul style="margin: 0; color: #92400e; line-height: 1.7; padding-left: 20px;">
          <li><strong>This password reset link expires in 1 hour</strong> for your security</li>
          <li>If you didn't request this reset, please ignore this email - your account remains secure</li>
          <li>For additional security, we recommend using a strong, unique password</li>
          <li>Never share your password with anyone, including our staff</li>
        </ul>
      </div>

      <!-- Alternative Method -->
      <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">Alternative Method:</h4>
        <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 15px;">
          If the button doesn't work, copy and paste this secure link in your browser:
        </p>
        <div style="background: #ffffff; border: 2px solid #e63946; border-radius: 10px; padding: 15px; word-break: break-all; font-family: 'Courier New', monospace; font-size: 13px; color: #e63946; font-weight: 500;">
          ${resetUrl}
        </div>
      </div>

      <!-- Security Tips -->
      <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #047857; font-size: 18px; font-weight: 600;">🛡️ Account Security Best Practices:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
          <div style="background: rgba(16,185,129,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">🔒 Strong Password</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Use 8+ characters with numbers, letters & symbols</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">🚫 Don't Share</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Never share your password with anyone</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">🖥️ Secure Logout</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Always log out from shared devices</p>
          </div>
          <div style="background: rgba(16,185,129,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3);">
            <strong style="color: #047857;">📱 Regular Updates</strong>
            <p style="margin: 5px 0 0 0; color: #047857; font-size: 13px;">Update your password periodically</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Password Reset Request - Hare Krishna Medical Store",
      html: this.getEmailTemplate(resetContent, "reset"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Professional password reset email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending password reset email to",
        email,
        ":",
        error.message,
      );
      await this.logEmailError(error, "reset", email);
      throw error;
    }
  }

  async sendOrderConfirmation(email, fullName, order) {
    console.log("📧 Sending professional order confirmation email to:", email);

    const websiteUrl =
      process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app";

    const orderContent = `
      <!-- Order Confirmation Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 20px; padding: 35px; position: relative; overflow: hidden;">
          <!-- Success Icon -->
          <div style="background: #10b981; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px rgba(16,185,129,0.3);">✅</div>

          <h2 style="color: #047857; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 32px; font-weight: 700;">
            Order Confirmed Successfully!
          </h2>
          <p style="color: #047857; font-size: 18px; margin: 0 0 10px 0;">
            Thank you for your order, <strong style="font-size: 20px;">${fullName}</strong>!
          </p>
          <p style="color: #047857; font-size: 16px; margin: 0; font-weight: 500;">
            Order #<strong style="font-size: 18px; letter-spacing: 1px;">${order.orderId}</strong>
          </p>
        </div>
      </div>

      <!-- Order Summary -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0;">
        <h3 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 24px; font-weight: 600; text-align: center;">
          📋 Order Summary & Details
        </h3>

        <!-- Order Info Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">ORDER ID</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px; font-family: 'Courier New', monospace;">${order.orderId}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">ORDER DATE</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">TOTAL AMOUNT</strong>
            <span style="color: #e63946; font-weight: 700; font-size: 20px;">₹${(order.total || order.totalAmount).toLocaleString("en-IN")}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">PAYMENT METHOD</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${order.paymentMethod}</span>
          </div>
        </div>
      </div>

      <!-- Items Ordered -->
      <div style="margin: 40px 0;">
        <h3 style="color: #e63946; margin-bottom: 25px; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600; text-align: center;">
          🛒 Items in Your Order
        </h3>

        <div style="background: #ffffff; border: 3px solid #f3f4f6; border-radius: 15px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.05);">
          ${order.items
            .map(
              (item, index) => `
            <div style="padding: 25px; ${index < order.items.length - 1 ? "border-bottom: 2px solid #f9fafb;" : ""} background: ${index % 2 === 0 ? "#ffffff" : "#fafafa"};">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                <div style="flex: 1; min-width: 200px;">
                  <h4 style="color: #1f2937; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${item.name}</h4>
                  <div style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                    <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 6px; margin-right: 10px;">Qty: ${item.quantity}</span>
                    <span style="background: #e5e7eb; padding: 4px 8px; border-radius: 6px;">Rate: ₹${item.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="background: linear-gradient(135deg, #e63946, #dc2626); color: white; padding: 8px 16px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(230,57,70,0.2);">
                    ₹${(item.quantity * item.price).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <!-- Order Tracking CTA -->
      <div style="text-align: center; margin: 40px 0;">
        <div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 3px solid #8b5cf6; border-radius: 20px; padding: 35px;">
          <h3 style="color: #5b21b6; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">
            🚀 Track Your Order in Real-Time
          </h3>
          <p style="color: #5b21b6; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
            Get instant updates on your order status, shipping details, and delivery progress through our professional tracking system.
          </p>

          <div class="button-container">
            <a href="${websiteUrl}/user/orders"
               class="main-button"
               style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(139,92,246,0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
              📱 Track My Order
            </a>
          </div>
        </div>
      </div>

      <!-- Order Process Timeline -->
      <div style="background: linear-gradient(135d, #f0fdf4, #dcfce7); border: 3px solid #22c55e; border-radius: 15px; padding: 30px; margin: 35px 0;">
        <h4 style="margin: 0 0 20px 0; color: #15803d; font-size: 20px; font-weight: 600; text-align: center;">📬 What Happens Next?</h4>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="background: rgba(34,197,94,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(34,197,94,0.3); text-align: center;">
            <div style="color: #15803d; font-size: 24px; margin-bottom: 8px;">📦</div>
            <strong style="color: #15803d; font-size: 14px; display: block; margin-bottom: 5px;">Order Processing</strong>
            <p style="margin: 0; color: #15803d; font-size: 12px;">We're preparing your order</p>
          </div>

          <div style="background: rgba(34,197,94,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(34,197,94,0.3); text-align: center;">
            <div style="color: #15803d; font-size: 24px; margin-bottom: 8px;">🚚</div>
            <strong style="color: #15803d; font-size: 14px; display: block; margin-bottom: 5px;">Quality Check & Shipping</strong>
            <p style="margin: 0; color: #15803d; font-size: 12px;">Quality verification & dispatch</p>
          </div>

          <div style="background: rgba(34,197,94,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(34,197,94,0.3); text-align: center;">
            <div style="color: #15803d; font-size: 24px; margin-bottom: 8px;">📧</div>
            <strong style="color: #15803d; font-size: 14px; display: block; margin-bottom: 5px;">Email Notifications</strong>
            <p style="margin: 0; color: #15803d; font-size: 12px;">Real-time updates via email</p>
          </div>

          <div style="background: rgba(34,197,94,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(34,197,94,0.3); text-align: center;">
            <div style="color: #15803d; font-size: 24px; margin-bottom: 8px;">🎉</div>
            <strong style="color: #15803d; font-size: 14px; display: block; margin-bottom: 5px;">Safe Delivery</strong>
            <p style="margin: 0; color: #15803d; font-size: 12px;">Enjoy your medical products!</p>
          </div>
        </div>
      </div>

      <!-- Customer Support -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">📞 Need Help with Your Order?</h4>
        <p style="margin: 0 0 20px 0; color: #92400e; line-height: 1.6;">
          Our professional customer support team is available 24/7 to assist you with any questions about your order.
        </p>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500;">📞 +91 76989 13354</span>
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500;">📧 hkmedicalamroli@gmail.com</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Order Confirmation #${order.orderId} - Hare Krishna Medical Store`,
      html: this.getEmailTemplate(orderContent, "order"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Professional order confirmation email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending order confirmation email to",
        email,
        ":",
        error.message,
      );
      await this.logEmailError(error, "order", email);
      throw error;
    }
  }

  // Enhanced error logging
  async logEmailError(error, emailType, recipient) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      type: emailType,
      recipient: recipient,
      error: error.message,
      code: error.code,
      command: error.command,
    };

    console.error("📧 Email Error Log:", JSON.stringify(errorLog, null, 2));

    // Log specific error types
    if (error.code === "EAUTH") {
      console.error(
        "🔐 Authentication failed - check EMAIL_USER and EMAIL_PASS",
      );
    } else if (error.code === "ECONNECTION") {
      console.error("🌐 Connection failed - check EMAIL_HOST and EMAIL_PORT");
    } else if (error.code === "ETIMEDOUT") {
      console.error("⏰ Connection timeout - check network connectivity");
    }
  }

  // Enhanced connection testing
  async testConnection() {
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error(
          "❌ Email service: Missing EMAIL_USER or EMAIL_PASS environment variables",
        );
        return false;
      }

      console.log("🔄 Testing professional email service connection...");

      // Test SMTP connection with timeout
      const testPromise = this.transporter.verify();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 30000),
      );

      await Promise.race([testPromise, timeoutPromise]);

      console.log("✅ Email service connection successful!");
      console.log(`   - Host: ${process.env.EMAIL_HOST || "smtp.gmail.com"}`);
      console.log(`   - Port: ${process.env.EMAIL_PORT || 587}`);
      console.log(`   - User: ${process.env.EMAIL_USER}`);
      console.log(`   - Connection pooling: Enabled`);
      console.log(`   - Rate limiting: 14 emails/second`);

      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:");
      console.error(`   - Error: ${error.message}`);
      console.error(`   - Code: ${error.code || "Unknown"}`);

      // Provide helpful error messages
      if (error.code === "EAUTH") {
        console.error(
          "   - Issue: Authentication failed. Check EMAIL_USER and EMAIL_PASS",
        );
        console.error(
          "   - Tip: For Gmail, use an App Password instead of your regular password",
        );
        console.error(
          "   - Guide: https://support.google.com/mail/answer/185833",
        );
      } else if (error.code === "ECONNECTION" || error.code === "ENOTFOUND") {
        console.error(
          "   - Issue: Connection failed. Check EMAIL_HOST and EMAIL_PORT",
        );
        console.error(
          "   - Current settings:",
          process.env.EMAIL_HOST || "smtp.gmail.com",
          ":",
          process.env.EMAIL_PORT || 587,
        );
      } else if (
        error.code === "ETIMEDOUT" ||
        error.message.includes("timeout")
      ) {
        console.error(
          "   - Issue: Connection timeout. Check network connectivity and firewall settings",
        );
      } else if (error.code === "ESECURITY") {
        console.error(
          "   - Issue: Security error. Enable 'Less secure app access' or use App Password",
        );
      }

      return false;
    }
  }

  async sendOrderStatusUpdate(email, fullName, order, newStatus) {
    console.log(
      `📧 Sending order status update to: ${email} - Status: ${newStatus}`,
    );

    const statusMessages = {
      processing: "Your order is being processed by our medical team",
      shipped: "Your order has been shipped and is on its way",
      delivered: "Your order has been delivered successfully",
      cancelled: "Your order has been cancelled as requested",
    };

    const statusIcons = {
      processing: "⚙️",
      shipped: "🚚",
      delivered: "📦",
      cancelled: "❌",
    };

    const statusColors = {
      processing: "#f59e0b",
      shipped: "#3b82f6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };

    const statusContent = `
      <!-- Status Update Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, ${statusColors[newStatus]}20, ${statusColors[newStatus]}10); border: 3px solid ${statusColors[newStatus]}40; border-radius: 20px; padding: 35px;">
          <div style="background: ${statusColors[newStatus]}; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px ${statusColors[newStatus]}30;">${statusIcons[newStatus]}</div>

          <h2 style="color: ${statusColors[newStatus]}; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700;">
            Order Status Updated
          </h2>
          <p style="color: #6b7280; font-size: 18px; margin: 0 0 10px 0;">
            Hello <strong style="color: #e63946;">${fullName}</strong>,
          </p>
          <p style="color: #6b7280; font-size: 16px; margin: 0;">
            Your order #<strong style="color: ${statusColors[newStatus]}; font-family: 'Courier New', monospace;">${order.orderId}</strong> status has been updated
          </p>
        </div>
      </div>

      <!-- Status Details -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0; text-align: center;">
        <h3 style="color: #e63946; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">
          Current Status: <span style="color: ${statusColors[newStatus]}; text-transform: uppercase;">${newStatus}</span>
        </h3>
        <p style="color: #6b7280; font-size: 17px; line-height: 1.6; margin: 0;">
          ${statusMessages[newStatus]}
        </p>
      </div>

      ${
        newStatus === "shipped"
          ? `
        <!-- Shipping Information -->
        <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 3px solid #3b82f6; border-radius: 15px; padding: 25px; margin: 30px 0;">
          <h4 style="margin: 0 0 15px 0; color: #1d4ed8; font-size: 18px; font-weight: 600;">🚚 Shipping Information</h4>
          <p style="margin: 0; color: #1d4ed8; line-height: 1.6;">
            Your order is now on its way! You can track the shipment status in your dashboard.
            We'll notify you once it's delivered safely.
          </p>
        </div>
      `
          : ""
      }

      ${
        newStatus === "delivered"
          ? `
        <!-- Delivery Confirmation -->
        <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 15px; padding: 25px; margin: 30px 0;">
          <h4 style="margin: 0 0 15px 0; color: #047857; font-size: 18px; font-weight: 600;">🎉 Delivery Completed!</h4>
          <p style="margin: 0 0 15px 0; color: #047857; line-height: 1.6;">
            Your order has been delivered successfully! We hope you're satisfied with your medical products.
          </p>
          <p style="margin: 0; color: #047857; font-size: 14px;">
            Please rate your experience and leave a review if you have a moment. Your feedback helps us serve you better.
          </p>
        </div>
      `
          : ""
      }

      <!-- Track Order Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.PRIMARY_DOMAIN || "https://hk-medical.vercel.app"}/user/orders"
           style="display: inline-block; background: linear-gradient(135deg, #e63946, #dc2626); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(230,57,70,0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
          📱 View Order Details
        </a>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📦 Order Update #${order.orderId} - ${statusMessages[newStatus]}`,
      html: this.getEmailTemplate(statusContent, "status"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Order status update email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending order status update email:",
        error.message,
      );
      await this.logEmailError(error, "status", email);
      throw error;
    }
  }

  async sendInvoiceEmail(email, fullName, invoice, pdfBuffer) {
    console.log(`📧 Sending professional invoice email to: ${email}`);

    const invoiceContent = `
      <!-- Invoice Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135d, #f0fdf4, #dcfce7); border: 3px solid #22c55e; border-radius: 20px; padding: 35px;">
          <div style="background: #22c55e; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px rgba(34,197,94,0.3);">📄</div>

          <h2 style="color: #15803d; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700;">
            Professional Invoice Generated
          </h2>
          <p style="color: #15803d; font-size: 18px; margin: 0 0 10px 0;">
            Dear <strong style="font-size: 20px;">${fullName}</strong>,
          </p>
          <p style="color: #15803d; font-size: 16px; margin: 0;">
            Your official invoice is ready for download and viewing
          </p>
        </div>
      </div>

      <!-- Invoice Details -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0;">
        <h3 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600; text-align: center;">
          📋 Invoice Summary
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">INVOICE NUMBER</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px; font-family: 'Courier New', monospace;">${invoice.invoiceNumber}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">INVOICE DATE</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${new Date(invoice.createdAt).toLocaleDateString("en-IN")}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">TOTAL AMOUNT</strong>
            <span style="color: #e63946; font-weight: 700; font-size: 20px;">₹${invoice.totalAmount.toLocaleString("en-IN")}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2); text-align: center;">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">ORDER ID</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px; font-family: 'Courier New', monospace;">${invoice.orderId}</span>
          </div>
        </div>
      </div>

      <!-- Download Links -->
      <div style="text-align: center; margin: 40px 0;">
        <div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 3px solid #8b5cf6; border-radius: 20px; padding: 35px;">
          <h3 style="color: #5b21b6; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">
            📱 Access Your Invoice
          </h3>
          <p style="color: #5b21b6; margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">
            Your professional invoice is attached to this email and also available in your dashboard for future reference.
          </p>

          <a href="${process.env.FRONTEND_URL}/user/invoices"
             style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 30px; font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 18px; box-shadow: 0 10px 30px rgba(139,92,246,0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
            📄 View All Invoices
          </a>
        </div>
      </div>

      <!-- Professional Notes -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">📌 Important Invoice Information:</h4>
        <ul style="margin: 0; color: #92400e; line-height: 1.7; padding-left: 20px;">
          <li>This is an official tax invoice from Hare Krishna Medical Store</li>
          <li>Keep this invoice for your records and tax purposes</li>
          <li>Contact us if you need any modifications or have questions</li>
          <li>All products are covered under our quality guarantee</li>
        </ul>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `📄 Invoice #${invoice.invoiceNumber} - Hare Krishna Medical Store`,
      html: this.getEmailTemplate(invoiceContent, "invoice"),
      attachments: pdfBuffer
        ? [
            {
              filename: `invoice-${invoice.invoiceNumber}.pdf`,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Professional invoice email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error("❌ Error sending invoice email:", error.message);
      await this.logEmailError(error, "invoice", email);
      throw error;
    }
  }

  async sendContactFormEmail(formData) {
    console.log(`📧 Sending contact form submission from: ${formData.email}`);

    const contactContent = `
      <!-- Contact Form Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 3px solid #3b82f6; border-radius: 20px; padding: 35px;">
          <div style="background: #3b82f6; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px rgba(59,130,246,0.3);">📝</div>

          <h2 style="color: #1d4ed8; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700;">
            New Contact Form Submission
          </h2>
          <p style="color: #1d4ed8; font-size: 16px; margin: 0;">
            From: <strong>${formData.name}</strong> | ${new Date().toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <!-- Contact Details -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0;">
        <h3 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600;">
          📋 Contact Information
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2);">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">FULL NAME</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${formData.name}</span>
          </div>

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2);">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">EMAIL ADDRESS</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px; word-break: break-all;">${formData.email}</span>
          </div>

          ${
            formData.phone
              ? `
          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2);">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">PHONE NUMBER</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${formData.phone}</span>
          </div>
          `
              : ""
          }

          <div style="background: rgba(230,57,70,0.1); padding: 20px; border-radius: 12px; border: 2px solid rgba(230,57,70,0.2);">
            <strong style="color: #e63946; font-size: 14px; display: block; margin-bottom: 8px;">SUBJECT</strong>
            <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${formData.subject}</span>
          </div>
        </div>
      </div>

      <!-- Message Content -->
      <div style="background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 3px solid #22c55e; border-radius: 15px; padding: 30px; margin: 30px 0;">
        <h4 style="margin: 0 0 20px 0; color: #15803d; font-size: 20px; font-weight: 600;">💬 Message Content:</h4>
        <div style="background: #ffffff; border: 2px solid #a7f3d0; border-radius: 10px; padding: 20px; font-family: 'Segoe UI', sans-serif; line-height: 1.7; color: #374151; font-size: 16px;">
          ${formData.message.replace(/\n/g, "<br>")}
        </div>
      </div>

      <!-- Action Required -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">⚡ Action Required</h4>
        <p style="margin: 0 0 20px 0; color: #92400e; line-height: 1.6;">
          Please respond to this customer inquiry within 24 hours to maintain our professional service standards.
        </p>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <a href="mailto:${formData.email}" style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500; text-decoration: none;">📧 Reply to Customer</a>
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500;">📞 ${formData.phone || "Phone not provided"}</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Contact Form - Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🔔 New Contact: ${formData.subject} - ${formData.name}`,
      html: this.getEmailTemplate(contactContent, "contact"),
      replyTo: formData.email,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Professional contact form email sent successfully`);
      return result;
    } catch (error) {
      console.error("❌ Error sending contact form email:", error.message);
      await this.logEmailError(error, "contact", formData.email);
      throw error;
    }
  }

  async sendMessageConfirmationEmail(email, fullName, message) {
    console.log(`📧 Sending message confirmation to: ${email}`);

    const confirmationContent = `
      <!-- Confirmation Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 20px; padding: 35px;">
          <div style="background: #10b981; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px rgba(16,185,129,0.3);">��</div>

          <h2 style="color: #047857; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700;">
            Message Received Successfully
          </h2>
          <p style="color: #047857; font-size: 18px; margin: 0 0 10px 0;">
            Thank you, <strong style="font-size: 20px;">${fullName}</strong>!
          </p>
          <p style="color: #047857; font-size: 16px; margin: 0;">
            We have received your message and will respond within 24 hours
          </p>
        </div>
      </div>

      <!-- Message Summary -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0;">
        <h3 style="color: #e63946; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600; text-align: center;">
          📝 Your Message Summary
        </h3>
        <div style="background: #ffffff; border: 2px solid #fecaca; border-radius: 10px; padding: 20px; font-family: 'Segoe UI', sans-serif; line-height: 1.7; color: #374151; font-size: 16px;">
          ${message.replace(/\n/g, "<br>")}
        </div>
      </div>

      <!-- What's Next -->
      <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 3px solid #3b82f6; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #1d4ed8; font-size: 18px; font-weight: 600;">📞 What Happens Next?</h4>
        <ul style="margin: 0; color: #1d4ed8; line-height: 1.7; padding-left: 20px;">
          <li>Our professional team will review your message within 2-4 hours</li>
          <li>We'll respond with detailed information and solutions</li>
          <li>For urgent medical queries, call us directly at +91 76989 13354</li>
          <li>You can track all communications in your dashboard</li>
        </ul>
      </div>

      <!-- Emergency Contact -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">🚨 Need Immediate Assistance?</h4>
        <p style="margin: 0 0 20px 0; color: #92400e; line-height: 1.6;">
          For urgent medical questions or emergencies, contact us immediately through our 24/7 helpline.
        </p>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500;">📞 +91 76989 13354</span>
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500;">📞 +91 91060 18508</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Message Received - We'll Respond Within 24 Hours",
      html: this.getEmailTemplate(confirmationContent, "confirmation"),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Message confirmation email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error(
        "❌ Error sending message confirmation email:",
        error.message,
      );
      await this.logEmailError(error, "confirmation", email);
      throw error;
    }
  }

  async sendMessageReplyEmail(
    email,
    customerName,
    originalSubject,
    originalMessage,
    replyMessage,
    adminName,
  ) {
    console.log(`📧 Sending message reply to: ${email}`);

    const replyContent = `
      <!-- Reply Header -->
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 3px solid #3b82f6; border-radius: 20px; padding: 35px;">
          <div style="background: #3b82f6; color: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 36px; box-shadow: 0 8px 25px rgba(59,130,246,0.3);">💬</div>

          <h2 style="color: #1d4ed8; margin: 0 0 15px 0; font-family: 'Segoe UI', sans-serif; font-size: 28px; font-weight: 700;">
            We've Responded to Your Message!
          </h2>
          <p style="color: #1d4ed8; font-size: 18px; margin: 0 0 10px 0;">
            Dear <strong style="font-size: 20px;">${customerName}</strong>,
          </p>
          <p style="color: #1d4ed8; font-size: 16px; margin: 0;">
            Our professional team has responded to your inquiry
          </p>
        </div>
      </div>

      <!-- Original Message Reference -->
      <div style="background: linear-gradient(135deg, #f9fafb, #f3f4f6); border: 3px solid #d1d5db; border-radius: 15px; padding: 30px; margin: 35px 0;">
        <h3 style="color: #374151; margin: 0 0 20px 0; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: 600;">
          📝 Your Original Message
        </h3>
        <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 15px;">
          <strong style="color: #374151; font-size: 16px; display: block; margin-bottom: 10px;">Subject:</strong>
          <span style="color: #6b7280; font-size: 15px;">${originalSubject}</span>
        </div>
        <div style="background: #ffffff; border: 2px solid #e5e7eb; border-radius: 10px; padding: 20px;">
          <strong style="color: #374151; font-size: 16px; display: block; margin-bottom: 10px;">Your Message:</strong>
          <div style="color: #6b7280; font-size: 15px; line-height: 1.6; font-style: italic;">
            ${originalMessage.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>

      <!-- Professional Reply -->
      <div style="background: linear-gradient(135deg, #fef2f2, #fee2e2); border: 3px solid #fecaca; border-radius: 20px; padding: 35px; margin: 35px 0;">
        <h3 style="color: #e63946; margin: 0 0 25px 0; font-family: 'Segoe UI', sans-serif; font-size: 22px; font-weight: 600; text-align: center;">
          💼 Our Professional Response
        </h3>

        <div style="background: #ffffff; border: 3px solid #e63946; border-radius: 15px; padding: 25px; box-shadow: 0 6px 20px rgba(230,57,70,0.1);">
          <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #fecaca;">
            <strong style="color: #e63946; font-size: 16px;">From:</strong>
            <span style="color: #374151; font-size: 16px; margin-left: 10px; font-weight: 500;">${adminName}</span>
          </div>

          <div style="color: #374151; font-size: 16px; line-height: 1.7;">
            ${replyMessage.replace(/\n/g, "<br>")}
          </div>
        </div>
      </div>

      <!-- Further Communication -->
      <div style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 3px solid #10b981; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #047857; font-size: 18px; font-weight: 600;">💬 Need Further Assistance?</h4>
        <p style="margin: 0 0 20px 0; color: #047857; line-height: 1.6;">
          If you have any follow-up questions or need additional support, please don't hesitate to reach out to us.
        </p>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 20px;">
          <a href="mailto:hkmedicalamroli@gmail.com?subject=Re: ${originalSubject}"
             style="background: rgba(16,185,129,0.2); padding: 10px 20px; border-radius: 25px; border: 2px solid rgba(16,185,129,0.4); color: #047857; font-weight: 500; text-decoration: none; transition: all 0.3s ease;">📧 Reply to This Email</a>
          <span style="background: rgba(16,185,129,0.2); padding: 10px 20px; border-radius: 25px; border: 2px solid rgba(16,185,129,0.4); color: #047857; font-weight: 500;">📞 +91 76989 13354</span>
        </div>
      </div>

      <!-- Professional Service Hours -->
      <div style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 3px solid #8b5cf6; border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h4 style="margin: 0 0 15px 0; color: #5b21b6; font-size: 18px; font-weight: 600; text-align: center;">⏰ Professional Support Hours</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="background: rgba(139,92,246,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(139,92,246,0.3); text-align: center;">
            <strong style="color: #5b21b6; font-size: 14px; display: block; margin-bottom: 5px;">Phone Support</strong>
            <p style="margin: 0; color: #5b21b6; font-size: 13px;">Mon-Sat: 9 AM - 8 PM</p>
          </div>
          <div style="background: rgba(139,92,246,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(139,92,246,0.3); text-align: center;">
            <strong style="color: #5b21b6; font-size: 14px; display: block; margin-bottom: 5px;">Email Support</strong>
            <p style="margin: 0; color: #5b21b6; font-size: 13px;">24/7 Response within 24 hours</p>
          </div>
          <div style="background: rgba(139,92,246,0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(139,92,246,0.3); text-align: center;">
            <strong style="color: #5b21b6; font-size: 14px; display: block; margin-bottom: 5px;">Emergency</strong>
            <p style="margin: 0; color: #5b21b6; font-size: 13px;">Call: +91 76989 13354</p>
          </div>
        </div>
      </div>

      <!-- Satisfaction Survey -->
      <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 3px solid #f59e0b; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
        <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 18px; font-weight: 600;">⭐ Help Us Improve</h4>
        <p style="margin: 0 0 20px 0; color: #92400e; line-height: 1.6;">
          Your feedback helps us provide better service. How satisfied are you with our response?
        </p>
        <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500; font-size: 14px;">⭐⭐⭐⭐⭐ Excellent</span>
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500; font-size: 14px;">⭐⭐⭐⭐ Good</span>
          <span style="background: rgba(245,158,11,0.2); padding: 8px 16px; border-radius: 20px; border: 1px solid rgba(245,158,11,0.4); color: #92400e; font-weight: 500; font-size: 14px;">⭐⭐⭐ Average</span>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"${adminName} - Hare Krishna Medical" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Re: ${originalSubject} - Response from Hare Krishna Medical`,
      html: this.getEmailTemplate(replyContent, "reply"),
      replyTo: process.env.EMAIL_USER,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        `✅ Message reply email sent successfully to ${email}:`,
        result.messageId,
      );
      return result;
    } catch (error) {
      console.error("❌ Error sending message reply email:", error.message);
      await this.logEmailError(error, "reply", email);
      throw error;
    }
  }

  // Generic send email method for custom emails
  async sendEmail(options) {
    try {
      if (!options.to) {
        throw new Error("Recipient email is required");
      }

      const mailOptions = {
        from: `"Hare Krishna Medical Store" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject:
          options.subject || "Notification from Hare Krishna Medical Store",
        html: options.html || options.message || "No content provided",
        ...(options.replyTo && { replyTo: options.replyTo }),
        ...(options.attachments && { attachments: options.attachments }),
      };

      console.log(`📧 Sending custom email to: ${options.to}`);
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Custom email sent successfully:`, result.messageId);

      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      console.error("❌ Error sending custom email:", error.message);
      await this.logEmailError(error, "custom", options.to);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();

module.exports = emailService;
