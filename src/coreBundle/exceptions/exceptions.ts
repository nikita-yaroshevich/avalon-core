import {
  Response
} from "@angular/http";

export class NotFoundException extends Error {
  constructor(message?:string) {
    super(message);
  }
}

export class DublicateEntityException extends Error {
  constructor(message?:string) {
    super(message);
  }
}

export class HttpException extends Error {
  response:Response;

  constructor(message?:string) {
    super(message);
  }
}

export class HttpNotFoundException extends HttpException {
  constructor(message?:string) {
    super(message);
  }
}

export class LogicException extends Error {
  constructor(message?:string) {
    super(message);
  }
}

export class InvalidConfigurationException extends Error {
  constructor(message?:string) {
    super(message);
  }
}

export class RuntimeException extends Error {
  constructor(message?:string) {
    super(message);
  }
}
