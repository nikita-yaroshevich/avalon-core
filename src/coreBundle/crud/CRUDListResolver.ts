import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RepositoryInterface} from "../entityManager/common";
import {Observable} from "rxjs/Rx";
import {CRUDInteractor} from "./CRUDInteractor";


export class CRUDListResolver<T> implements Resolve<T> {
  constructor(private interactor: CRUDInteractor<T>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T {
    // let id = route.params['id'];
    return <Promise<any>>this.interactor.findItems().then((items) => {
      return items;
    });
  }
}
