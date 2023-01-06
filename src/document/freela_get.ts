import mongoose from 'mongoose';

export interface FreelaGetDocument {
  id: string;
  title: string;
  description: string;
  price: number;
  deadline: string;
  technologies: string[];
  createdAt: Date;
  user_id: string;
  user_name: string;
  user_avatar: string;
  user_instagram: string | null;
  user_whatsapp: string | null;
}
