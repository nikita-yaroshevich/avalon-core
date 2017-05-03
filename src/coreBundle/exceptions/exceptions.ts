import {
  Response
} from "@angular/http";
import {UserTokenInterface} from "../user/common";

export class NotFoundException extends Error {
  constructor(message?:string) {
    super(message);
  }
}

export class DuplicateEntityException extends Error {
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

export class AuthenticationException extends Error {
  constructor(public token: UserTokenInterface, message?:string, public error?:any) {
    super(message);
  }
}

