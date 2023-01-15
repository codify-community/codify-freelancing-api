export class AmountOfLargeCharacters extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AmountOfLargeCharacters';
  }
}
