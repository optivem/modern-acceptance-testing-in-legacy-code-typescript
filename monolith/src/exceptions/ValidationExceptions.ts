export class ValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NotExistValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotExistValidationException';
  }
}
