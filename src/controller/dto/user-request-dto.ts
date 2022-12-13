import { UserDocument } from '../../document/user';

const BANNER_URL =
  'https://images-ext-1.discordapp.net/external/UbHx_o6Ccr5MGCQrP5e56lF_KylKO-qCJ1UtJzzPaeE/https/i.pinimg.com/564x/ec/b9/2d/ecb92d18c7855c986a5571c1b6f7cad2.jpg';

export const toUserDocument = ({
  _id,
  avatar_url,
  name,
  description = 'Sem Descrição',
  banner_url = BANNER_URL,
  whatsapp = 'Sem Whatsapp',
  instagram = 'Sem Instagram'
}: UserDocument): UserDocument => {
  const user = {
    _id: _id,
    name: name,
    description: description,
    banner_url: banner_url,
    avatar_url: avatar_url,
    whatsapp: whatsapp,
    instagram: instagram
  } as UserDocument;

  return user;
};
