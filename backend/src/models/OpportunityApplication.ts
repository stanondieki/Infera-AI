import mongoose, { Document, Schema } from 'mongoose';

export interface IOpportunityApplication extends Document {
  _id: string;
  
  // References
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  
  // Application details
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  proposedRate?: number;
  availableStartDate?: Date;
  
  // Review information
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Timestamps
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunityApplicationSchema = new Schema<IOpportunityApplication>({
  // References
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  opportunityId: {
    type: Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: [true, 'Opportunity ID is required']
  },
  
  // Application details
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  proposedRate: {
    type: Number,
    min: [0, 'Proposed rate cannot be negative']
  },
  availableStartDate: Date,
  
  // Review information
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review notes cannot be more than 1000 characters']
  },
  
  // Timestamps
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries and duplicate prevention
OpportunityApplicationSchema.index({ userId: 1, opportunityId: 1 }, { unique: true }); // Prevent duplicates
OpportunityApplicationSchema.index({ status: 1 });
OpportunityApplicationSchema.index({ appliedAt: -1 });
OpportunityApplicationSchema.index({ opportunityId: 1 });

const OpportunityApplication = mongoose.model<IOpportunityApplication>('OpportunityApplication', OpportunityApplicationSchema);

export { OpportunityApplication };
export default OpportunityApplication;