const Letterhead = require("../models/Letterhead");
const User = require("../models/User");

class LetterheadController {
  // Get all letterheads with pagination and filtering
  async getAllLetterheads(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        letterType,
        search,
        startDate,
        endDate,
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

  // Get letterhead statistics
  async getStats(req, res) {
    try {
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
