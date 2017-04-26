import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RepositoryInterface} from "../entityManager/common";
import {Observable} from "rxjs/Rx";
import {UserService} from "./UserService.service";
import {AuthProviderInterface} from "./common";
import {Injectable} from "@angular/core";

@Injectable()
export class UserRestoreResolver implements Resolve<any> {
  constructor(private userService:UserService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | boolean  {
    let oldToken = this.userService.getUserToken();
    return Promise.all(this.userService.getProviders().map((provider:AuthProviderInterface)=>{
      return provider.restore();
    })).then((results:any[])=>{
      let token = results.pop();
      return this.userService.setToken(token);
    },()=>{
      return Promise.resolve();
    });
  }
}
