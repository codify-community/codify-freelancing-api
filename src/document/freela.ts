import mongoose from 'mongoose';

export interface FreelaDocument {
  id: string;
  title: string;
  description: string;
  price: number;
  deadline: string;
  technologies: string[];
  createdAt: Date;
}
