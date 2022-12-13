import { FreelaDocument } from '../../document/freela';
import mongoose from 'mongoose';
export const toFreelaDocument = ({
  title,
  description,
  price,
  deadline,
  technologies
}: FreelaDocument): FreelaDocument => {
  const freela = {
    id: new mongoose.Types.ObjectId(),
    title: title,
    description: description,
    price: price,
    deadline: deadline,
    technologies: technologies,
    createdAt: new Date()
  } as FreelaDocument;

  return freela;
};
