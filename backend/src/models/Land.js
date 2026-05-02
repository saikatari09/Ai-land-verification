/**
 * 🏞️ MONGODB LAND MODEL - MONGOOSE SCHEMA
 * 
 * Complete Land Document Schema for AI Land Verification System
 * Includes: Owner details, AI processing, Verification, Chat context
 */

const mongoose = require('mongoose');

// GPS Location Schema
const gpsSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  accuracy: {
    type: String,
    default: '±5 meters'
  }
}, { _id: false });

// Owner/Seller Schema
const ownerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  governmentId: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, { _id: false });

// Location Schema
const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: String,
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  gps: gpsSchema
}, { _id: false });

// Property/Land Details Schema
const propertySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Mixed Use', 'Forest'],
    required: true
  },
  area: {
    type: Number,
    required: true,
    min: 0.1
  },
  areaUnit: {
    type: String,
    enum: ['Acres', 'Hectares', 'Sq Feet', 'Sq Meters'],
    default: 'Acres'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  description: String
}, { _id: false });

// Legal Information Schema
const legalSchema = new mongoose.Schema({
  ownershipStatus: {
    type: String,
    enum: ['Individual Owner', 'Joint Ownership', 'Corporate', 'Government', 'Disputed'],
    required: true
  },
  legalStatus: {
    type: String,
    enum: ['Registered', 'Pending Registration', 'Contested', 'Encumbered'],
    required: true
  },
  noPendency: {
    type: Boolean,
    default: false
  },
  noEncumbrance: {
    type: Boolean,
    default: false
  },
  mortgageStatus: {
    type: String,
    default: 'Clear'
  }
}, { _id: false });

// Document Schema
const documentSchema = new mongoose.Schema({
  documentId: String,
  type: {
    type: String,
    enum: ['Title Deed', 'Survey Report', 'Ownership Proof', 'Government ID', 'Tax Receipts', 'Land Maps', 'Other'],
    required: true
  },
  fileName: String,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  fileSize: Number,
  status: {
    type: String,
    enum: ['Uploaded', 'Verified', 'Rejected'],
    default: 'Uploaded'
  },
  ocrExtracted: {
    type: Boolean,
    default: false
  },
  extractedText: String
});

// AI Processing Schema
const aiProcessingSchema = new mongoose.Schema({
  processedDate: Date,
  processingStatus: {
    type: String,
    enum: ['Complete', 'InProgress', 'Failed'],
    default: 'InProgress'
  },
  ocrConfidenceScore: {
    type: Number,
    min: 0,
    max: 1
  },
  extractedData: {
    ownerName: String,
    landId: String,
    governmentRecords: String,
    legalStatus: String,
    boundaries: String,
    soilType: String,
    waterAvailability: String,
    accessRoads: String
  },
  aiSummary: {
    type: String,
    required: true
  },
  chatContext: {
    type: String,
    required: true
  },
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    alerts: [String],
    findings: [String]
  }
}, { _id: false });

// Image Schema with GPS Tags
const imageSchema = new mongoose.Schema({
  imageId: String,
  fileName: String,
  imageUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  description: String,
  gpsTag: gpsSchema,
  imageMetadata: {
    resolution: String,
    quality: String,
    cameraInfo: String
  }
});

// Verification Schema
const verificationSchema = new mongoose.Schema({
  overallStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  verifiedDate: Date,
  verifiedBy: String,
  verificationSteps: [
    {
      step: String,
      status: {
        type: String,
        enum: ['Pending', 'Complete'],
        default: 'Pending'
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      details: String
    }
  ]
}, { _id: false });

// Chat History Schema
const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  chatId: String,
  sessionDate: Date,
  userId: String,
  messages: [chatMessageSchema]
});

// Lead/Buyer Interest Schema
const leadSchema = new mongoose.Schema({
  leadId: String,
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  leadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Contacted', 'Negotiating', 'Closed'],
    default: 'Active'
  },
  offeredPrice: Number,
  message: String
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  action: String,
  user: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: String
}, { _id: false });

// MAIN LAND SCHEMA
const landSchema = new mongoose.Schema(
  {
    // Essential Identifiers
    landId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    surveyNumber: {
      type: String,
      required: true,
      trim: true
    },

    // Owner Information
    owner: {
      type: ownerSchema,
      required: true
    },

    // Location Details
    location: {
      type: locationSchema,
      required: true
    },

    // Property Details
    property: {
      type: propertySchema,
      required: true
    },

    // Legal Information
    legal: {
      type: legalSchema,
      required: true
    },

    // Documents
    documents: [documentSchema],

    // AI Processing
    aiProcessing: {
      type: aiProcessingSchema,
      required: true
    },

    // Image Gallery
    imageGallery: [imageSchema],

    // Verification Status
    verification: {
      type: verificationSchema,
      required: true
    },

    // Chat History
    chatHistory: [chatHistorySchema],

    // Buyer Leads
    leads: [leadSchema],

    // Audit Trail
    auditLog: [auditLogSchema],

    // Metadata
    isPublished: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'lastModifiedDate'
    }
  }
);

// Create indexes
landSchema.index({ surveyNumber: 1 });
landSchema.index({ 'owner.name': 1 });
landSchema.index({ 'location.city': 1 });
landSchema.index({ 'verification.overallStatus': 1 });
landSchema.index({ isPublished: 1, isActive: 1 });
landSchema.index({ createdDate: -1 });
landSchema.index({ 'property.type': 1 });
landSchema.index({ 'property.price': 1 });

// Methods
landSchema.methods = {
  // Get chatbot context
  getChatContext: function() {
    return this.aiProcessing.chatContext;
  },

  // Add message to chat history
  addChatMessage: function(userId, role, content) {
    let chatSession = this.chatHistory.find(c => c.userId === userId);
    if (!chatSession) {
      chatSession = {
        chatId: `CHAT-${Date.now()}`,
        sessionDate: new Date(),
        userId,
        messages: []
      };
      this.chatHistory.push(chatSession);
    }
    
    chatSession.messages.push({
      role,
      content,
      timestamp: new Date()
    });
    
    return this.save();
  },

  // Add buyer lead
  addLead: function(leadData) {
    const lead = {
      leadId: `LEAD-${Date.now()}`,
      ...leadData,
      leadDate: new Date()
    };
    this.leads.push(lead);
    return this.save();
  },

  // Get verification progress percentage
  getVerificationProgress: function() {
    if (!this.verification.verificationSteps.length) return 0;
    
    const totalSteps = this.verification.verificationSteps.length;
    const completedSteps = this.verification.verificationSteps.filter(
      s => s.status === 'Complete'
    ).length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  },

  // Log an action
  logAction: function(action, user, details) {
    this.auditLog.push({
      action,
      user,
      timestamp: new Date(),
      details
    });
    return this.save();
  }
};

// Statics
landSchema.statics = {
  // Find verified lands
  findVerified: function() {
    return this.find({ 'verification.overallStatus': 'Approved', isPublished: true });
  },

  // Find by location
  findByLocation: function(city, state) {
    return this.find({
      'location.city': city,
      'location.state': state,
      isPublished: true
    });
  },

  // Find by price range
  findByPriceRange: function(minPrice, maxPrice) {
    return this.find({
      'property.price': { $gte: minPrice, $lte: maxPrice },
      isPublished: true
    });
  }
};

const Land = mongoose.model('Land', landSchema);

module.exports = Land;
