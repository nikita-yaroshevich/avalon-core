import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from "@angular/router";
import {Observable} from "rxjs/Rx"
import {UserService} from "./UserService.service";

@Injectable()
export class UserAuthenticatedCanActivateRouterGuard implements CanActivate {
    constructor(private userService:UserService){
    }

    canActivate():Observable<boolean>|Promise<boolean>|boolean {
        return this.userService.getUserToken().isAuthenticated();
    }

}

@Injectable()
export class UserAuthenticatedCanActivateChildRouterGuard implements CanActivateChild {
    constructor(private userService:UserService){
    }

    canActivateChild():Observable<boolean>|Promise<boolean>|boolean {
        return this.userService.getUserToken().isAuthenticated();
    }

}

@Injectable()
export class UserRolesAllowedCanActivateRouterGuard implements CanActivate {
    public roles:string[] = [];
    constructor(private userService:UserService){
    }

    canActivate():Observable<boolean>|Promise<boolean>|boolean {
        let token = this.userService.getUserToken();
        for (let i = 0; i < this.roles.length; i++){
            if (!token.hasRole(this.roles[i])){
                return false;
            }
        }
        return true;
    }
}

@Injectable()
export class UserRolesAllowedCanActivateChildRouterGuard implements CanActivateChild {
    public roles:string[] = [];
    constructor(private userService:UserService){
    }

    canActivateChild():Observable<boolean>|Promise<boolean>|boolean {
        let token = this.userService.getUserToken();
        for (let i = 0; i < this.roles.length; i++){
            if (!token.hasRole(this.roles[i])){
                return false;
            }
        }
        return true;
    }
}