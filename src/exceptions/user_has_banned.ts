export class UserHasBannedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserHasBannedException';
  }
}
