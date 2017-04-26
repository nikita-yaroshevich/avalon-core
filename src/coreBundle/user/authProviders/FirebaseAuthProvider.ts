import {UsernamePasswordAuthProvider, UsernamePasswordToken, BasicUser} from "./UsernamePasswordAuthProvider";
import {Http, Response, Headers, URLSearchParams} from "@angular/http";
import {UserTokenInterface, UserInterface, AuthProviderInterface} from "../common";
import {AnonymousUserToken} from "../AnonymousUserToken";

export class FirebaseAuthProvider implements AuthProviderInterface {
    private user:any;

    constructor(private firebase_auth:any) {
        firebase_auth.onAuthStateChanged((user) => {
            if (user){
                this.user = user;
            }
        });
    }

    supports(token:UserTokenInterface):boolean {
        return true;
    }

    authenticate(token:any):Promise<UserTokenInterface> {
        return this.user ? Promise.resolve(new FirebaseAuthToken(this.user)) : Promise.reject(new AnonymousUserToken());
    }

    restore():Promise<UserTokenInterface|null> {
        return this.user ? Promise.resolve(new FirebaseAuthToken(this.user)) : Promise.reject(new AnonymousUserToken());
    }

    logout():Promise<UserTokenInterface> {
        return Promise.resolve(new AnonymousUserToken());
    }
}

export class FirebaseAuthToken implements UserTokenInterface {
    private user:UserInterface;
    roles:string[] = [];

    constructor(data:any) {
        this.user = {};
        Object.keys(data).forEach((key:string)=> {
            (<any>this.user)[key] = data[key];
        });
    }

    getUser():UserInterface {
        return this.user;
    }

    getUsername():string {
        return (<any>this.getUser()).username;
    }

    hasRole(name:string):boolean {
        return this.roles.indexOf(name) !== -1;
    }

    setUser(user:UserInterface) {
        this.user = user;
        return this;
    }

    isAuthenticated():boolean {
        return !!(<any>this.getUser());
    }
}
