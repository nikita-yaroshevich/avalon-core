import {AuthProviderInterface, UserTokenInterface, UserInterface} from "./common";
import {AnonymousUserToken} from "./AnonymousUserToken";

export class ManualAuthProvider implements AuthProviderInterface {
  restore():Promise<UserTokenInterface|null> {
    return Promise.reject(null);
  }

  logout():Promise<UserTokenInterface> {
    return Promise.resolve(new AnonymousUserToken());
  }
  authenticate(token:ManualUserToken):Promise<UserTokenInterface>{
    token.setAuthenticated(true);
    return Promise.resolve(token);
  }

  supports(token:UserTokenInterface):boolean {
    return token instanceof ManualUserToken;
  }
}

export class ManualUserToken implements UserTokenInterface {
  private _isAuthenticated = false;
  roles:string[] = [];

  constructor(public user: UserInterface){
  }
  getUser():UserInterface {
    return this.user;
  }

  getUsername():string {
    return (<any>this.getUser())['username'] || 'Anonymous';
  }

  hasRole(name:string):boolean {
    return this.roles.indexOf(name) !== -1;
  }

  setAuthenticated(state = true){
    this._isAuthenticated = state;
    return this;
  }

  isAuthenticated():boolean {
    return this._isAuthenticated;
  }
}
