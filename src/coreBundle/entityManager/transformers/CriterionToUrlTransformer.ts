import {ItemTransformerAbstract} from "../../transformer/ItemTransformerAbstract";
import {Criterion} from "../common";
import * as _ from "lodash";
import {URLSearchParams} from "@angular/http";

export class CriterionToUrlTransformer extends ItemTransformerAbstract {
  transform(criterion:Criterion, options?:any):{url:string, params:string|URLSearchParams} {
    let compiled = _.template(criterion.options.url || '', {interpolate: /{{([\s\S]+?)}}/g});
    let url = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));

    let search = new URLSearchParams();
    Object.keys(criterion.criteria).forEach((key)=> {
      search.append(key, criterion.criteria[key]);
    });

    if (criterion.options.params){
      let existedSearch:string = criterion.options.params instanceof URLSearchParams ?
          (<URLSearchParams>criterion.options.params).rawParams
          :  <string>criterion.options.params;
      let compiled = _.template(existedSearch || '', {interpolate: /{{([\s\S]+?)}}/g});
      existedSearch = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
      search.setAll(new URLSearchParams(existedSearch));
    }

    return {
      url: url,
      params: search
    };
  }

}
