import mongoose, { type HydratedDocument, type Model, Schema, type Types } from 'mongoose'

import { LeadSource, LeadStatus } from '../types/enums'

export interface ILead {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdBy: Types.ObjectId
}

export interface ILeadTimestamps {
  createdAt: Date
  updatedAt: Date
}

export type LeadEntity = ILead & ILeadTimestamps

export type LeadDocument = HydratedDocument<LeadEntity>

const leadSchema = new Schema<LeadEntity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      required: true,
      default: LeadStatus.New,
      index: true,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

leadSchema.index({ createdBy: 1, createdAt: -1 })
leadSchema.index({ status: 1, source: 1, createdAt: -1 })

export const LeadModel =
  ((mongoose.models.Lead as Model<LeadEntity> | undefined) ?? mongoose.model<LeadEntity>('Lead', leadSchema))
