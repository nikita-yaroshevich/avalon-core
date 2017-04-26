import {AuthProviderInterface, UserTokenInterface, UserInterface} from "../common";
import {AnonymusUser, AnonymousUserToken} from "../AnonymousUserToken";
import {Http, Response, URLSearchParams} from "@angular/http";

export class UsernamePasswordAuthProvider implements AuthProviderInterface {
  // abstract authenticate(token:UserTokenInterface):Promise<UserTokenInterface>;

  constructor(protected authUrl:string, protected http: Http){

  }

  authenticate(token:UsernamePasswordToken):Promise<UserTokenInterface> {
    return this.http.get(this.authUrl, {search: new URLSearchParams(`username=${token.username}&password=${token.password}`)})
      .toPromise()
      .then((response:Response)=>{
        let data = response.json();
        let user = new BasicUser(data);
        token.setUser(user);
        return token;
      });
  }

  supports(token:UserTokenInterface):boolean {
    // return !!(token.password && token.username);
    return token instanceof UsernamePasswordToken;
  }

  restore():Promise<UserTokenInterface|null> {
    return Promise.reject(null);
  }

  logout():Promise<UserTokenInterface> {
    return Promise.resolve(new AnonymousUserToken());
  }
}

export class BasicUser implements UserInterface {
  username:string;
  constructor(props:{username:string}){
    Object.assign(this, props);
  }
}

export class UsernamePasswordToken implements UserTokenInterface {
  private user:BasicUser;
  roles:string[] = [];

  constructor(public username:string, public password:string){
    this.user = new BasicUser({username:username});
  }
  getUser():BasicUser {
    return this.user;
  }

  getUsername():string {
    return this.getUser().username;
  }

  hasRole(name:string):boolean {
    return this.roles.indexOf(name) !== -1;
  }

  setUser(user:BasicUser){
    this.user = user;
    return this;
  }

  isAuthenticated():boolean {
    return !(this.user instanceof AnonymusUser);
  }
}
