export class FreelaNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FreelaNotFound';
  }
}
