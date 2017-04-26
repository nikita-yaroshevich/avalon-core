export interface UserInterface {

}

export interface UserTokenInterface {
  /**
   * return current user instance
   */
  getUser():UserInterface;
  /**
   * return current username
   */
  getUsername():string;
  /**
   * check if user has role
   * @param name
   */
  hasRole(name:string):boolean;

  isAuthenticated():boolean;
}

export interface AuthProviderInterface {
  authenticate(token:UserTokenInterface):Promise<UserTokenInterface>;
  supports(token:UserTokenInterface):boolean;
  restore():Promise<UserTokenInterface|null>;
  logout():Promise<UserTokenInterface>;
}


export class UserChangedEvent {
  constructor(public prevToken:UserTokenInterface, public token:UserTokenInterface){
  }
}

export class UserAuthEvent {
  constructor(){
  }
}
