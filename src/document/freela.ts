import mongoose from 'mongoose';

export interface FreelaDocument {
  id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  deadline: string;
  technologies: string[];
  createdAt: Date;
}
