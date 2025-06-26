const Letterhead = require("../models/Letterhead");
const User = require("../models/User");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

class LetterheadController {
  // Get all letterheads (Admin only)
  async getAllLetterheads(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        letterType,
        startDate,
        endDate,
        search,
      } = req.query;

      // Build filter
      const filter = {};

      if (status) filter.status = status;
      if (letterType) filter.letterType = letterType;

      // Date range filter
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      // Search filter
      if (search) {
        filter.$or = [
          { letterId: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { "recipient.firstName": { $regex: search, $options: "i" } },
          { "recipient.lastName": { $regex: search, $options: "i" } },
          { "host.name": { $regex: search, $options: "i" } },
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const [letterheads, totalLetterheads] = await Promise.all([
        Letterhead.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate("createdBy", "fullName email"),
        Letterhead.countDocuments(filter),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalLetterheads / limit);

      res.json({
        success: true,
        letterheads,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalLetterheads,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Get letterheads error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch letterheads",
        error: error.message,
      });
    }
  }

  // Get single letterhead by ID
  async getLetterheadById(req, res) {
    try {
      const { id } = req.params;

      const letterhead = await Letterhead.findById(id).populate(
        "createdBy",
        "fullName email",
      );

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      res.json({
        success: true,
        letterhead,
      });
    } catch (error) {
      console.error("Get letterhead by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch letterhead",
        error: error.message,
      });
    }
  }

  // Create new letterhead
  async createLetterhead(req, res) {
    try {
      const {
        letterType,
        title,
        context,
        recipient,
        subject,
        content,
        header,
        footer,
        host,
        language,
        notes,
      } = req.body;

      // Validate required fields
      if (!letterType || !title || !subject || !content || !host) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Create new letterhead
      const letterhead = new Letterhead({
        letterType,
        title,
        context,
        recipient,
        subject,
        content,
        header,
        footer,
        host,
        language,
        notes,
        createdBy: req.user.id,
      });

      await letterhead.save();

      // Populate the created letterhead
      await letterhead.populate("createdBy", "fullName email");

      res.status(201).json({
        success: true,
        message: "Letterhead created successfully",
        letterhead,
      });
    } catch (error) {
      console.error("Create letterhead error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create letterhead",
        error: error.message,
      });
    }
  }

  // Update letterhead
  async updateLetterhead(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData.letterId;
      delete updateData.createdBy;
      delete updateData.qrCode;
      delete updateData.qrCodeData;

      const letterhead = await Letterhead.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate("createdBy", "fullName email");

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      res.json({
        success: true,
        message: "Letterhead updated successfully",
        letterhead,
      });
    } catch (error) {
      console.error("Update letterhead error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update letterhead",
        error: error.message,
      });
    }
  }

  // Delete letterhead
  async deleteLetterhead(req, res) {
    try {
      const { id } = req.params;

      const letterhead = await Letterhead.findByIdAndDelete(id);

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      res.json({
        success: true,
        message: "Letterhead deleted successfully",
      });
    } catch (error) {
      console.error("Delete letterhead error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete letterhead",
        error: error.message,
      });
    }
  }

  // Generate PDF for letterhead
  async generateLetterheadPDF(req, res) {
    try {
      const { id } = req.params;

      const letterhead = await Letterhead.findById(id).populate(
        "createdBy",
        "fullName email",
      );

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      // Create PDF
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="letterhead-${letterhead.letterId}.pdf"`,
      );

      doc.pipe(res);

      // Add letterhead content to PDF
      await this.addLetterheadToPDF(doc, letterhead);

      doc.end();
    } catch (error) {
      console.error("Generate PDF error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF",
        error: error.message,
      });
    }
  }

  // Helper method to add letterhead content to PDF
  async addLetterheadToPDF(doc, letterhead) {
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;

    // Red theme colors
    const redColor = "#e63946";
    const lightRed = "#fff5f5";

    // Header with red background
    doc.rect(0, 0, pageWidth, 120).fill(redColor);

    // Company Header in white text
    doc
      .fontSize(20)
      .font("Times-Bold")
      .fillColor("white")
      .text("HARE KRISHNA MEDICAL STORE", margin, 30, {
        width: pageWidth - 2 * margin - 100, // Leave space for QR code
        align: "center",
      });

    doc
      .fontSize(10)
      .font("Times-Roman")
      .text(
        "3 Sahyog Complex, Man Sarovar circle, Amroli, 394107, Gujarat",
        margin,
        55,
        {
          width: pageWidth - 2 * margin - 100,
          align: "center",
        },
      );

    doc.text(
      "Phone: +91 76989 13354 | Email: hkmedicalamroli@gmail.com",
      margin,
      70,
      {
        width: pageWidth - 2 * margin - 100,
        align: "center",
      },
    );

    doc.text("GST No: 24XXXXX1234Z1Z5 | Drug License: GJ-XXX-XXX", margin, 85, {
      width: pageWidth - 2 * margin - 100,
      align: "center",
    });

    // QR Code (top-right)
    if (letterhead.qrCode) {
      try {
        const qrBuffer = Buffer.from(letterhead.qrCode.split(",")[1], "base64");
        doc.image(qrBuffer, pageWidth - 130, 20, { width: 80, height: 80 });
      } catch (error) {
        console.error("QR Code insertion error:", error);
      }
    }

    // Header content
    if (letterhead.header) {
      doc
        .fontSize(12)
        .font("Times-Bold")
        .fillColor("white")
        .text(letterhead.header, margin, 100, {
          width: pageWidth - 2 * margin,
          align: "center",
        });
    }

    // Reset text color to black
    doc.fillColor("black");

    // Reference and Date section (right-aligned)
    const startY = 140;
    doc
      .fontSize(12)
      .font("Times-Bold")
      .fillColor(redColor)
      .text(`Ref: ${letterhead.letterId}`, pageWidth - 200, startY, {
        width: 150,
        align: "right",
      });

    doc.text(
      `Date: ${new Date(letterhead.createdAt).toLocaleDateString("en-GB")}`,
      pageWidth - 200,
      startY + 15,
      {
        width: 150,
        align: "right",
      },
    );

    // Letter meta information box
    doc.fillColor("black");
    doc.rect(margin, startY + 40, pageWidth - 2 * margin, 60).fill(lightRed);
    doc.rect(margin, startY + 40, pageWidth - 2 * margin, 60).stroke(redColor);

    doc
      .fontSize(11)
      .font("Times-Bold")
      .fillColor(redColor)
      .text("Letter Type:", margin + 10, startY + 50)
      .font("Times-Roman")
      .fillColor("black")
      .text(
        letterhead.letterType.charAt(0).toUpperCase() +
          letterhead.letterType.slice(1),
        margin + 80,
        startY + 50,
      );

    doc
      .font("Times-Bold")
      .fillColor(redColor)
      .text("Subject:", margin + 10, startY + 65)
      .font("Times-Roman")
      .fillColor("black")
      .text(letterhead.subject, margin + 60, startY + 65, {
        width: pageWidth - 2 * margin - 70,
      });

    doc
      .font("Times-Bold")
      .fillColor(redColor)
      .text("To:", pageWidth - 200, startY + 50)
      .font("Times-Roman")
      .fillColor("black")
      .text(letterhead.recipientFullName, pageWidth - 180, startY + 50, {
        width: 160,
      });

    if (letterhead.recipient.designation) {
      doc
        .font("Times-Bold")
        .fillColor(redColor)
        .text("Designation:", pageWidth - 200, startY + 65)
        .font("Times-Roman")
        .fillColor("black")
        .text(letterhead.recipient.designation, pageWidth - 130, startY + 65, {
          width: 110,
        });
    }

    doc.y = startY + 120;

    // Context and greeting
    const contextText = {
      respected: "Respected",
      dear: "Dear",
      to_whom_it_may_concern: "To Whom It May Concern",
    };

    doc
      .fontSize(12)
      .font("Times-Bold")
      .fillColor("black")
      .text(
        `${contextText[letterhead.context]} ${letterhead.recipientFullName},`,
        margin,
      );

    doc.moveDown(1);

    // Main content
    const cleanContent = letterhead.content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ");

    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(cleanContent, margin, doc.y, {
        width: pageWidth - 2 * margin,
        align: "justify",
        lineGap: 3,
      });

    doc.moveDown(2);

    // Closing
    doc.text("Thank you for your time and consideration.", margin);
    doc.moveDown(1);
    doc.text("Sincerely,", margin);
    doc.moveDown(3);

    // Footer with red border
    const footerY = doc.y + 50;
    doc.rect(0, footerY, pageWidth, 2).fill(redColor);

    // Signature section (right side)
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text("_____________________", pageWidth - 200, footerY + 20, {
        width: 150,
        align: "center",
      });

    doc
      .font("Times-Bold")
      .fillColor(redColor)
      .text(`${letterhead.host.name}`, pageWidth - 200, footerY + 35, {
        width: 150,
        align: "center",
      });

    doc
      .font("Times-Roman")
      .fillColor("black")
      .text(`${letterhead.host.designation}`, pageWidth - 200, footerY + 50, {
        width: 150,
        align: "center",
      });

    doc.text("Hare Krishna Medical Store", pageWidth - 200, footerY + 65, {
      width: 150,
      align: "center",
    });

    // Footer content (left side)
    if (letterhead.footer) {
      doc
        .fontSize(10)
        .font("Times-Roman")
        .fillColor("#666")
        .text(letterhead.footer, margin, footerY + 20, {
          width: 300,
        });
    }

    // Verification note
    doc
      .fontSize(9)
      .font("Times-Roman")
      .fillColor("#666")
      .text(
        "This is a computer generated official letterhead document",
        margin,
        footerY + 80,
      );

    doc.text("Scan QR code for digital verification", margin, footerY + 95);

    // Verification URL
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-docs?id=${letterhead.letterId}&type=letterhead`;
    doc
      .fontSize(8)
      .text(`Verification: ${verificationUrl}`, margin, footerY + 110, {
        width: pageWidth - 2 * margin,
      });
  }

  // Mark letterhead as sent
  async markAsSent(req, res) {
    try {
      const { id } = req.params;

      const letterhead = await Letterhead.findById(id);

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      await letterhead.markAsSent();

      res.json({
        success: true,
        message: "Letterhead marked as sent",
        letterhead,
      });
    } catch (error) {
      console.error("Mark as sent error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark letterhead as sent",
        error: error.message,
      });
    }
  }

  // Get letterhead statistics
  async getLetterheadStats(req, res) {
    try {
      const [generalStats, typeStats] = await Promise.all([
        Letterhead.getLetterheadStats(),
        Letterhead.getLetterTypeStats(),
      ]);

      res.json({
        success: true,
        stats: {
          general: generalStats,
          byType: typeStats,
        },
      });
    } catch (error) {
      console.error("Get letterhead stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch letterhead statistics",
        error: error.message,
      });
    }
  }

  // Verify letterhead by letter ID
  async verifyLetterhead(req, res) {
    try {
      const { letterId } = req.params;

      const letterhead = await Letterhead.findOne({ letterId }).populate(
        "createdBy",
        "fullName email",
      );

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      // Return verification data
      res.json({
        success: true,
        verified: true,
        letterhead: {
          letterId: letterhead.letterId,
          letterType: letterhead.letterType,
          title: letterhead.title,
          recipientName: letterhead.recipientFullName,
          subject: letterhead.subject,
          createdAt: letterhead.createdAt,
          status: letterhead.status,
          hostName: letterhead.host.name,
          hostDesignation: letterhead.host.designation,
          qrCodeData: letterhead.qrCodeData,
        },
      });
    } catch (error) {
      console.error("Verify letterhead error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to verify letterhead",
        error: error.message,
      });
    }
  }
}

module.exports = new LetterheadController();
