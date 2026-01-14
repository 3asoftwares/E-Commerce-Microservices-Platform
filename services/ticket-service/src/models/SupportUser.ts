import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     SupportUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, agent]
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         avatar:
 *           type: string
 *         assignedTickets:
 *           type: number
 *         resolvedTickets:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */

export enum SupportUserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
}

export enum SupportUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ISupportUser extends Document {
  email: string;
  password: string;
  name: string;
  role: SupportUserRole;
  status: SupportUserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: Date;
  assignedTickets: number;
  resolvedTickets: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const supportUserSchema = new Schema<ISupportUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(SupportUserRole),
      default: SupportUserRole.AGENT,
    },
    status: {
      type: String,
      enum: Object.values(SupportUserStatus),
      default: SupportUserStatus.ACTIVE,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    department: {
      type: String,
      default: 'General Support',
    },
    lastLogin: {
      type: Date,
    },
    assignedTickets: {
      type: Number,
      default: 0,
    },
    resolvedTickets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
supportUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
supportUserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate avatar URL
supportUserSchema.pre('save', function (next) {
  if (!this.avatar) {
    const colors = ['1a1a1a', '333333', '555555', '6366f1', '22c55e'];
    const colorIndex = Math.floor(Math.random() * colors.length);
    this.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=${colors[colorIndex]}&color=fff`;
  }
  next();
});

export const SupportUser = mongoose.model<ISupportUser>('SupportUser', supportUserSchema);
