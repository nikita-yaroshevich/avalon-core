import {EntityManagerInterface, RepositoryInterface} from "../entityManager/common";
import {Observable} from "rxjs/Rx";
import {Resolve} from "@angular/router";
import {CRUDListResolver} from "./CRUDListResolver";
import {EventEmitter} from "@angular/core";
import {HttpException} from "../exceptions/exceptions";


export interface CRUDInteractorOptionsArgsInterface {
  RepositoryClass?:any;
  EntityClass:any;
}

export interface CRUDEvent {
  type:string;
  message:string;
}

export class CRUDInteractor<T> {

  events:EventEmitter<CRUDEvent> = new EventEmitter<CRUDEvent>();
  private _repository:RepositoryInterface;
  get repository():RepositoryInterface {
    if (!this._repository) {
      this._repository = this.em.getRepository(this.options.RepositoryClass || this.options.EntityClass);
    }
    return this._repository;
  }

  constructor(public em:EntityManagerInterface, protected options:CRUDInteractorOptionsArgsInterface) {

  }

  findItems(criteria?:any):Promise<T[]> {
    return this.repository.getByCriteria(criteria)
      .then((items:T[])=> {
        return items;
      }).catch((e:HttpException)=> {
        this.events.emit({
          type: 'error',
          message: 'Internal Error. Probably Connection Issue'
        });
        return Promise.reject(e);
      });
  }

  getItemByIndentity(id:string):Promise<T> {
    return this.repository.getById(id)
      .catch((e:HttpException)=> {
      this.events.emit({
        type: 'error',
        message: 'Internal Error. Probably Connection Issue'
      });
      return Promise.reject(e);
    })
  }

  removeItem(item:T):Promise<any> {
    return this.repository.delete(item)
      .then((i)=> {
        this.events.emit({
          type: 'success',
          message: 'Removed successfully'
        });
        return i;
      }).catch((e:HttpException)=> {
        this.events.emit({
          type: 'error',
          message: e.toString()
        });
        return Promise.reject(e);
      });
  }

  saveItem(item:T):Promise<any> {
    return this.repository.save(item)
      .then((i)=> {
        this.events.emit({
          type: 'success',
          message: 'Saved successfully'
        });
        return i;
      }).catch((e:HttpException)=> {
        this.events.emit({
          type: 'error',
          message: e.toString()
        });
        return Promise.reject(e);
      });
  }

  createEntity() {
    return new this.options.EntityClass();
  }
}
