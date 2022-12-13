import mongoose, { Document } from 'mongoose';

export interface FreelaDocument extends Document {
  id: mongoose.Types.ObjectId
  title: string;
  description: string;
  price: number;
  deadline: string;
  technologies: string[];
  createdAt: Date;
}
