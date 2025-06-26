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

    // Header section
    if (letterhead.header) {
      doc
        .fontSize(12)
        .font("Times-Roman")
        .text(letterhead.header, margin, margin, {
          width: pageWidth - 2 * margin,
          align: "center",
        });

      doc.moveDown(1);
    }

    // Company Header
    doc
      .fontSize(16)
      .font("Times-Bold")
      .text("HARE KRISHNA MEDICAL", margin, doc.y, {
        width: pageWidth - 2 * margin,
        align: "center",
      });

    doc.moveDown(0.5);

    // QR Code (left side)
    if (letterhead.qrCode) {
      try {
        const qrBuffer = Buffer.from(letterhead.qrCode.split(",")[1], "base64");
        doc.image(qrBuffer, margin, doc.y, { width: 80, height: 80 });
      } catch (error) {
        console.error("QR Code insertion error:", error);
      }
    }

    // Reference number (right side)
    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(`Ref: ${letterhead.letterId}`, pageWidth - 200, doc.y - 60, {
        width: 150,
        align: "right",
      });

    // Date
    doc.text(
      `Date: ${new Date().toLocaleDateString("en-GB")}`,
      pageWidth - 200,
      doc.y + 20,
      {
        width: 150,
        align: "right",
      },
    );

    doc.moveDown(2);

    // Title
    doc
      .fontSize(14)
      .font("Times-Bold")
      .text(letterhead.title, margin, doc.y, {
        width: pageWidth - 2 * margin,
        align: "center",
      });

    doc.moveDown(1.5);

    // Context and Recipient
    const contextText = {
      respected: "Respected",
      dear: "Dear",
      to_whom_it_may_concern: "To Whom It May Concern",
    };

    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(
        `${contextText[letterhead.context]} ${letterhead.recipientFullName},`,
        margin,
      );

    if (letterhead.recipient.designation) {
      doc.text(letterhead.recipient.designation, margin);
    }

    if (letterhead.recipient.company) {
      doc.text(letterhead.recipient.company, margin);
    }

    doc.moveDown(1);

    // Subject
    doc
      .font("Times-Bold")
      .text("Subject: ", margin, doc.y, { continued: true })
      .font("Times-Roman")
      .text(letterhead.subject);

    doc.moveDown(1);

    // Main content
    // Strip HTML tags and handle basic formatting
    const cleanContent = letterhead.content
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "");

    doc
      .fontSize(12)
      .font("Times-Roman")
      .text(cleanContent, margin, doc.y, {
        width: pageWidth - 2 * margin,
        align: "justify",
        lineGap: 2,
      });

    doc.moveDown(2);

    // Closing
    doc.text("With regards,", margin);

    doc.moveDown(3);

    // Signature section
    doc.text("_____________________", margin);
    doc.text(`${letterhead.host.name}`, margin);
    doc.text(`${letterhead.host.designation}`, margin);
    doc.text("Hare Krishna Medical", margin);

    // Stamp space
    doc.text("Place for Official Stamp", pageWidth - 200, doc.y - 60, {
      width: 150,
      align: "center",
    });

    // Footer
    if (letterhead.footer) {
      doc
        .fontSize(10)
        .font("Times-Roman")
        .text(letterhead.footer, margin, pageHeight - 100, {
          width: pageWidth - 2 * margin,
          align: "center",
        });
    }
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
