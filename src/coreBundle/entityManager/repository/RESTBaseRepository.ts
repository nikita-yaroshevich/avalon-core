import {Repository, RepositoryConfig} from "../common";
import {HttpEMRequestOptionsArgs} from "../HttpEntityManager.service";
import {HttpRepository} from "./HttpRepository";

export class RESTBaseRepository<EntityType> extends HttpRepository<EntityType>{
  constructor(options?:RepositoryConfig) {
    super(options);
  }

  protected getRequestOptionsFor(action:string):HttpEMRequestOptionsArgs {
    let opt = super.getRequestOptionsFor(action);
    let defaultOpt = super.getRequestOptionsFor('endpoint');
    if (['get', 'update', 'delete'].indexOf(action) !== -1 && opt.url === defaultOpt.url){
      opt.url += '/{{id}}';
    }

    // if (['create', 'update'].indexOf(action) !== -1 && !opt.requestTransformer){
      // opt.requestTransformer = new FunctionTransformer((data)=>{
      //   return [].concat();//data.id ? { '$set' : data} : data;
      // });
    // }
    return opt;
  }
}
