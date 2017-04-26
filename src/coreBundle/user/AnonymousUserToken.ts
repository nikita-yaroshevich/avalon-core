import {UserInterface, UserTokenInterface} from "./common";
export class AnonymusUser implements UserInterface {

}

export class AnonymousUserToken implements UserTokenInterface {
  roles:string[] = [];
  protected user:UserInterface;

  constructor() {
    this.user = new AnonymusUser();
  }

  getUsername():string {
    return 'Unknown';
  }

  getUser():UserInterface {
    return this.user;
  }

  hasRole(name:string):boolean {
    return this.roles.indexOf(name) !== -1;
  }

  isAuthenticated():boolean {
    return false;
  }
}
