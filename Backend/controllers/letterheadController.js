const Letterhead = require("../models/Letterhead");
const User = require("../models/User");
const mongoose = require("mongoose");
const { shouldUseFallback, devLetterheads } = require("../utils/devFallback");

class LetterheadController {
  // Check database connectivity
  checkDBConnection() {
    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        "Database connection not available. Using development fallback.",
      );
    }
  }

  // Development fallback for getting letterheads
  async getLetterheadsFallback(filters, page, limit) {
    // Initialize with some sample data if empty
    if (devLetterheads.length === 0) {
      devLetterheads.push({
        _id: "dev_letterhead_1",
        letterheadId: "HKMS/LH/2024/01/01/001",
        title: "Certificate of Excellence",
        letterType: "certificate",
        subject: "Outstanding Performance Recognition",
        content:
          "We hereby certify that the recipient has demonstrated exceptional performance and dedication in their field of work.",
        recipient: {
          name: "John Doe",
          designation: "Senior Manager",
          organization: "ABC Corporation",
          address: "123 Business Street, City, State 12345",
        },
        issuer: {
          name: "Dr. Rajesh Kumar",
          designation: "Chief Medical Officer",
          signature: "",
        },
        header: {
          companyName: "Hare Krishna Medical Store",
          companyAddress: "123 Main Street, Healthcare District",
          companyCity: "Medical City, State 12345",
          companyPhone: "+91 98765 43210",
          companyEmail: "info@harekrishnamedical.com",
          logo: "",
        },
        footer: {
          terms:
            "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
          additionalInfo: "",
        },
        status: "issued",
        tags: ["certificate", "performance", "official"],
        notes: "Sample letterhead for development",
        qrCode: "sample-qr-code-data",
        createdBy: "dev_admin_user",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      });

      devLetterheads.push({
        _id: "dev_letterhead_2",
        letterheadId: "HKMS/LH/2024/01/02/002",
        title: "Medical Recommendation",
        letterType: "recommendation",
        subject: "Professional Medical Recommendation",
        content:
          "Based on our professional assessment, we recommend the following course of action for the patient's well-being.",
        recipient: {
          name: "Jane Smith",
          designation: "Patient",
          organization: "Personal",
          address: "456 Health Avenue, Wellness City, State 67890",
        },
        issuer: {
          name: "Dr. Priya Sharma",
          designation: "Chief Pharmacist",
          signature: "",
        },
        header: {
          companyName: "Hare Krishna Medical Store",
          companyAddress: "123 Main Street, Healthcare District",
          companyCity: "Medical City, State 12345",
          companyPhone: "+91 98765 43210",
          companyEmail: "info@harekrishnamedical.com",
          logo: "",
        },
        footer: {
          terms:
            "This is an official document issued by Hare Krishna Medical Store. For verification, please contact us at the above details.",
          additionalInfo: "Valid for 30 days from issue date",
        },
        status: "sent",
        tags: ["recommendation", "medical", "official"],
        notes: "Sample medical recommendation",
        qrCode: "sample-qr-code-data-2",
        createdBy: "dev_admin_user",
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date("2024-01-02"),
      });
    }

    // Apply filters
    let filteredLetterheads = [...devLetterheads];

    if (filters.status) {
      filteredLetterheads = filteredLetterheads.filter(
        (l) => l.status === filters.status,
      );
    }

    if (filters.letterType) {
      filteredLetterheads = filteredLetterheads.filter(
        (l) => l.letterType === filters.letterType,
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredLetterheads = filteredLetterheads.filter(
        (l) =>
          l.letterheadId.toLowerCase().includes(searchLower) ||
          l.title.toLowerCase().includes(searchLower) ||
          l.subject.toLowerCase().includes(searchLower) ||
          l.recipient.name.toLowerCase().includes(searchLower) ||
          l.recipient.organization.toLowerCase().includes(searchLower) ||
          l.issuer.name.toLowerCase().includes(searchLower),
      );
    }

    if (filters.startDate) {
      filteredLetterheads = filteredLetterheads.filter(
        (l) => new Date(l.createdAt) >= new Date(filters.startDate),
      );
    }

    if (filters.endDate) {
      filteredLetterheads = filteredLetterheads.filter(
        (l) => new Date(l.createdAt) <= new Date(filters.endDate),
      );
    }

    // Sort by creation date (newest first)
    filteredLetterheads.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    // Apply pagination
    const total = filteredLetterheads.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedLetterheads = filteredLetterheads.slice(
      skip,
      skip + parseInt(limit),
    );

    return {
      letterheads: paginatedLetterheads,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get all letterheads with pagination and filtering
  async getAllLetterheads(req, res) {
    try {
      console.log("📋 GET /api/letterheads called");
      console.log("👤 User:", req.user?.email, "Role:", req.user?.role);
      console.log("🔍 Query params:", req.query);

      const {
        page = 1,
        limit = 10,
        status,
        letterType,
        search,
        startDate,
        endDate,
      } = req.query;

      // Use development fallback if database is not available
      if (shouldUseFallback()) {
        console.log("🔄 Using development fallback for fetching letterheads");

        const filters = { status, letterType, search, startDate, endDate };
        const result = await this.getLetterheadsFallback(filters, page, limit);

        return res.json({
          success: true,
          letterheads: result.letterheads,
          pagination: {
            currentPage: parseInt(page),
            totalPages: result.totalPages,
            total: result.total,
            hasNextPage: page < result.totalPages,
            hasPrevPage: page > 1,
          },
        });
      }

      // Check database connectivity
      this.checkDBConnection();

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
          { letterheadId: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { "recipient.name": { $regex: search, $options: "i" } },
          { "recipient.organization": { $regex: search, $options: "i" } },
          { "issuer.name": { $regex: search, $options: "i" } },
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query
      const [letterheads, total] = await Promise.all([
        Letterhead.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate("createdBy", "fullName email"),
        Letterhead.countDocuments(filter),
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);

      // Emit real-time update to admin
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterheads-viewed", {
          count: total,
          timestamp: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        letterheads,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
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

      // Use development fallback if database is not available
      if (shouldUseFallback()) {
        console.log(
          "🔄 Using development fallback for getting letterhead by ID",
        );

        // Initialize sample data if empty
        if (devLetterheads.length === 0) {
          this.getLetterheadsFallback({}, 1, 10);
        }

        const letterhead = devLetterheads.find((l) => l._id === id);

        if (!letterhead) {
          return res.status(404).json({
            success: false,
            message: "Letterhead not found",
          });
        }

        return res.json({
          success: true,
          letterhead,
        });
      }

      // Check database connectivity
      this.checkDBConnection();

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
      console.error("Get letterhead error:", error);
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
      const letterheadData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const letterhead = new Letterhead(letterheadData);
      await letterhead.save();

      // Populate the created letterhead for response
      await letterhead.populate("createdBy", "fullName email");

      // Emit real-time update to admin
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterhead-created", {
          letterhead: {
            id: letterhead._id,
            letterheadId: letterhead.letterheadId,
            title: letterhead.title,
            letterType: letterhead.letterType,
            recipientName: letterhead.recipient.name,
            status: letterhead.status,
            createdAt: letterhead.createdAt,
          },
        });
      }

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

      const letterhead = await Letterhead.findById(id);

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      // Update letterhead
      Object.assign(letterhead, req.body);
      await letterhead.save();

      // Populate the updated letterhead
      await letterhead.populate("createdBy", "fullName email");

      // Emit real-time update to admin
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterhead-updated", {
          letterhead: {
            id: letterhead._id,
            letterheadId: letterhead.letterheadId,
            title: letterhead.title,
            letterType: letterhead.letterType,
            recipientName: letterhead.recipient.name,
            status: letterhead.status,
            updatedAt: letterhead.updatedAt,
          },
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

      const letterhead = await Letterhead.findById(id);

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      await Letterhead.findByIdAndDelete(id);

      // Emit real-time update to admin
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterhead-deleted", {
          letterheadId: letterhead.letterheadId,
          id: letterhead._id,
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

  // Mark letterhead as issued
  async markAsIssued(req, res) {
    try {
      const { id } = req.params;

      const letterhead = await Letterhead.findById(id);

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
        });
      }

      await letterhead.markAsIssued();

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterhead-status-updated", {
          letterheadId: letterhead.letterheadId,
          status: "issued",
          issueDate: letterhead.issueDate,
        });
      }

      res.json({
        success: true,
        message: "Letterhead marked as issued",
        letterhead,
      });
    } catch (error) {
      console.error("Mark as issued error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to mark letterhead as issued",
        error: error.message,
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

      // Emit real-time update
      const io = req.app.get("io");
      if (io) {
        io.to("admin-room").emit("letterhead-status-updated", {
          letterheadId: letterhead.letterheadId,
          status: "sent",
        });
      }

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

  // Development fallback for getting stats
  getStatsFallback() {
    // Initialize sample data if empty
    if (devLetterheads.length === 0) {
      this.getLetterheadsFallback({}, 1, 10); // This will initialize sample data
    }

    const total = devLetterheads.length;
    const statusCounts = devLetterheads.reduce((acc, letterhead) => {
      acc[letterhead.status] = (acc[letterhead.status] || 0) + 1;
      return acc;
    }, {});

    const typeCounts = devLetterheads.reduce((acc, letterhead) => {
      acc[letterhead.letterType] = (acc[letterhead.letterType] || 0) + 1;
      return acc;
    }, {});

    const generalStats = {
      total,
      issued: statusCounts.issued || 0,
      sent: statusCounts.sent || 0,
      draft: statusCounts.draft || 0,
      archived: statusCounts.archived || 0,
    };

    const typeStats = Object.entries(typeCounts).map(([type, count]) => ({
      _id: type,
      count,
    }));

    return { generalStats, typeStats };
  }

  // Get letterhead statistics
  async getStats(req, res) {
    try {
      // Use development fallback if database is not available
      if (shouldUseFallback()) {
        console.log("🔄 Using development fallback for letterhead stats");
        const { generalStats, typeStats } = this.getStatsFallback();

        return res.json({
          success: true,
          stats: {
            general: generalStats,
            types: typeStats,
          },
        });
      }

      // Check database connectivity
      this.checkDBConnection();

      const [generalStats, typeStats] = await Promise.all([
        Letterhead.getStats(),
        Letterhead.getTypeStats(),
      ]);

      res.json({
        success: true,
        stats: {
          general: generalStats,
          types: typeStats,
        },
      });
    } catch (error) {
      console.error("Get letterhead stats error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get letterhead statistics",
        error: error.message,
      });
    }
  }

  // Verify letterhead by letterheadId (public endpoint)
  async verifyLetterhead(req, res) {
    try {
      const { letterheadId } = req.params;

      const letterhead = await Letterhead.findOne({ letterheadId }).populate(
        "createdBy",
        "fullName email",
      );

      if (!letterhead) {
        return res.status(404).json({
          success: false,
          message: "Letterhead not found",
          verified: false,
        });
      }

      const verificationData = {
        letterheadId: letterhead.letterheadId,
        title: letterhead.title,
        letterType: letterhead.letterType,
        recipientName: letterhead.recipient.name,
        recipientOrganization: letterhead.recipient.organization,
        subject: letterhead.subject,
        issuerName: letterhead.issuer.name,
        issuerDesignation: letterhead.issuer.designation,
        issueDate: letterhead.issueDate,
        validUntil: letterhead.validUntil,
        status: letterhead.status,
        verified: true,
      };

      res.json({
        success: true,
        verified: true,
        letterhead: verificationData,
        message: "Letterhead verified successfully",
      });
    } catch (error) {
      console.error("Verify letterhead error:", error);
      res.status(500).json({
        success: false,
        message: "Letterhead verification failed",
        error: error.message,
        verified: false,
      });
    }
  }
}

module.exports = new LetterheadController();
