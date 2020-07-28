import Environment from 'helpers/environment';

export class ReadOnlyError extends Error {
  constructor(message = '') {
    const actualMessage = `Cannot assign value to a read-only property. ${message}`;
    super(actualMessage);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WriteOnlyError extends Error {
  constructor(message = '') {
    const actualMessage = `Cannot read value on a write-only property. ${message}`;
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

export class EnvironmentError extends Error {
  constructor(message?: string) {
    const envIndex = [
      Environment.isSourcePlugin,
      Environment.isSourceProps,
      Environment.isExtension,
    ].indexOf(true);
    const envs = ['Source Plugins', 'Source Property', 'Extensions'];
    const environment = envs[envIndex] || 'current environment';
    let actualMessage = `Not supported on ${environment}`;

    if (message) {
      actualMessage += `: ${message}`;
    }

    super(actualMessage);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
