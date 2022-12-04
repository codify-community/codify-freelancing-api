import mongoose, { Document } from 'mongoose';

export interface FreelaDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string
  price: number
  duration: number
  technologies: string[]
}