import { InvalidPayloadException } from '../../exceptions/invalid-payload-exception';

const REQUIRED_FIELDS = [
  'title',
  'description',
  'price',
  'deadline',
  'technologies',
  'user_id'
];

export const validateFreelaPayload = (freela) => {
  for (let i = 0; i < REQUIRED_FIELDS.length; i++) {
    if (!freela[REQUIRED_FIELDS[i]]) {
      throw new InvalidPayloadException(
        `Invalid payload: field ${REQUIRED_FIELDS[i]} should be informed!`
      );
    }
  }
};
