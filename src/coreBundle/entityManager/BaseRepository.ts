import {
  RepositoryInterface, EntityManagerInterface,
  EMRequestOptionsArgs, RepositoryConfig,
} from "./common";
import {Observable} from "rxjs/Rx";
import {InvalidConfigurationException} from "../exceptions/exceptions";

export abstract class BaseRepository<EntityType> implements RepositoryInterface {
  protected em:EntityManagerInterface;
  protected options:any;

  constructor(options?:RepositoryConfig|any) {
    this.options = options || {};
  }


  setEntityManager(em:EntityManagerInterface):RepositoryInterface {
    this.em = em;
    return this;
  }

  getEntityManager():EntityManagerInterface {
    return this.em;
  }

  protected getRequestOptionsFor(action:string):any {
    let self = this;

    let opt:any = this.options;
    if (Reflect.has(this.constructor, '__Repository')) {
      opt = Object.assign({}, this.options, Reflect.get(this.constructor, '__Repository'));
    }
    if (opt[action]) {
      return opt[action];
    }
    if (opt.endpoint) {
      return opt.endpoint;
    }
    throw new InvalidConfigurationException('Repository not properly configured. You should provide at least default endpoint configuration');
  }

  // get urlTransformer():TransformableInterface {
  //   return new CriterionToUrlTransformer();
  // }


  abstract fetchById(id:string, options?:EMRequestOptionsArgs):Observable<EntityType>;

  abstract fetchByCriteria(criteria:any, options?:EMRequestOptionsArgs):Observable<EntityType[]>;

  abstract fetchAll(options?:EMRequestOptionsArgs):Observable<EntityType[]>;

  getAll(options?:EMRequestOptionsArgs):Promise<EntityType[]> {
    return this.fetchAll(options).toPromise();
  }

  getById(id:string, options?:EMRequestOptionsArgs):Promise<EntityType> {
    return this.fetchById(id, options).toPromise();
  }

  getByCriteria(criteria:any, options?:EMRequestOptionsArgs):Promise<EntityType[]> {
    return this.fetchByCriteria(criteria, options).toPromise();
  }

  abstract save(entity:any, options?:EMRequestOptionsArgs):Promise<any>;

  abstract delete(entity:any, options?:EMRequestOptionsArgs):Promise<any>;
}
