import {Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {RepositoryInterface} from "../entityManager/common";
import {Observable} from "rxjs/Rx";
import {CRUDInteractor} from "./CRUDInteractor";


export class CRUDItemResolver<T> implements Resolve<T> {
  constructor(private interactor: CRUDInteractor<T>, private router: Router) {
  }

  get repository(){
    return this.interactor.repository;
  }

  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<T>|Promise<T>|T {
    let id = route.params['id'];
    if (id === 'new' || !id){
      return Promise.resolve(this.interactor.createEntity());
    }
    return this.repository.getById(id).then((item) => {
      if (item) {
        return item;
      } else { // id not found
        this.router.navigate(['../']);
        return null;
      }
    });
  }
}
