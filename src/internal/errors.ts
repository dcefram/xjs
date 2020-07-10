export class ReadOnlyError extends Error {
  constructor(message = '') {
    const actualMessage = `Cannot assign value to a read-only property. ${message}`;
    super(actualMessage);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidParamError extends Error {
  constructor(message = '') {
    let actualMessage = 'Invalid Parameters';

    if (message) {
      actualMessage += `: ${message}`;
    }

    super(actualMessage);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
