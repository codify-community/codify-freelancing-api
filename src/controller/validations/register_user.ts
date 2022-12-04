import { InvalidPayloadException } from '../../exceptions/invalid-payload-exception';

const REQUIRED_FIELDS = ['_id', 'name', 'avatar_url'];

export const validateUserPayload = (user) => {
  for (let i = 0; i < REQUIRED_FIELDS.length; i++) {
    if (!user[REQUIRED_FIELDS[i]]?.trim()) {
      throw new InvalidPayloadException(
        `Invalid payload: field ${REQUIRED_FIELDS[i]} should be informed!`
      );
    }
  }
};
