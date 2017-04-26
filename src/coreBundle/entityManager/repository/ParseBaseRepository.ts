import {Repository, RepositoryConfig, EMRequestOptionsArgs, Criterion} from "../common";
import {BaseRepository} from "../BaseRepository";
import {ResponseContentType, URLSearchParams} from "@angular/http";
import {FunctionTransformer} from "../../transformer/FunctionTransformer";
import {ParseCriterionToUrlTransformer} from "../transformers/ParseCriterionToUrlTransformer";
import {TransformableInterface} from "../../transformer/common";
import {Observable} from "rxjs/Rx";
import {CollectionTransformer} from "../../transformer/CollectionTransformer";
import {ChainTransformer} from "../../transformer/ChainTransformer";
import {HttpRepository} from "./HttpRepository";

export class ParseBaseRepository<EntityType> extends HttpRepository<EntityType>{
  constructor(options?:RepositoryConfig) {
    super(options);
  }

  get urlTransformer():TransformableInterface{
    return new ParseCriterionToUrlTransformer();
  }

  protected getRequestOptionsFor(action:string):EMRequestOptionsArgs {
    let opt = super.getRequestOptionsFor(action);
    let defaultOpt = super.getRequestOptionsFor('endpoint');
    // if (['get', 'update', 'delete'].indexOf(action) !== -1){
    //   opt.search = new URLSearchParams('where={"objectId":"{{id}}"}');
    // }

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

  save(entity:any, options?:EMRequestOptionsArgs):Promise<any> {
    options = options || this.getRequestOptionsFor(entity.id ? 'update' : 'create');

    options.requestTransformer = options.requestTransformer || new FunctionTransformer((e:any)=>{
        delete e.createdAt;
        delete e.updatedAt;
        return e;
      });

    return super.save(entity, options)
      .then((d:any)=>{
        entity.updatedAt = d.updatedAt;
        return entity;
      });
  }
}
