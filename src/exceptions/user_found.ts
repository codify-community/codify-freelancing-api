export class UserFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserFound';
  }
}
