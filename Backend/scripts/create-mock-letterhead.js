const mongoose = require("mongoose");
const Letterhead = require("../models/Letterhead");
require("dotenv").config();

const mockLetterhead = {
  letterId: "HK/CER/20241226001",
  letterType: "certificate",
  title: "Medical Certificate",
  context: "respected",
  recipient: {
    prefix: "Dr.",
    firstName: "Rajesh",
    middleName: "Kumar",
    lastName: "Patel",
    designation: "Chief Medical Officer",
    company: "City General Hospital",
  },
  subject: "Medical Equipment Quality Certification",
  content: `<p>We are pleased to certify that the medical equipment and pharmaceutical products supplied by your esteemed hospital meet all the required quality standards and specifications as per Indian medical regulations.</p>

<p>This certification confirms that:</p>
<ul>
<li>All products have been thoroughly tested and verified</li>
<li>Quality assurance protocols have been followed</li>
<li>Products comply with Drug Controller General of India (DCGI) guidelines</li>
<li>Regular quality audits have been conducted</li>
</ul>

<p>We appreciate your continued trust in our services and look forward to maintaining this professional relationship.</p>

<p>This certificate is valid for one year from the date of issue and may be renewed upon request.</p>`,
  header: "QUALITY ASSURANCE DEPARTMENT",
  footer:
    "This document is digitally signed and verified. Scan QR code for authenticity verification.",
  host: {
    name: "Mr. Arvind Shah",
    designation: "Quality Assurance Manager",
    signature: null,
  },
  status: "finalized",
  language: "english",
  createdBy: null, // Will be set when admin creates it
  notes: "Sample letterhead for demonstration purposes",
};

const createMockLetterhead = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/Hare_Krishna_Medical_db",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log("Connected to MongoDB");

    // Check if letterhead already exists
    const existing = await Letterhead.findOne({
      letterId: mockLetterhead.letterId,
    });
    if (existing) {
      console.log("Mock letterhead already exists:", existing.letterId);
      return;
    }

    // Create mock letterhead
    const letterhead = new Letterhead(mockLetterhead);
    await letterhead.save();

    console.log("Mock letterhead created successfully:");
    console.log("Letter ID:", letterhead.letterId);
    console.log("Title:", letterhead.title);
    console.log("QR Code generated:", !!letterhead.qrCode);
  } catch (error) {
    console.error("Error creating mock letterhead:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run if called directly
if (require.main === module) {
  createMockLetterhead();
}

module.exports = { createMockLetterhead, mockLetterhead };
