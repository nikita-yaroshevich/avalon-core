import {ItemTransformerAbstract} from "../../transformer/ItemTransformerAbstract";
import {Criterion} from "../common";
import * as _ from "lodash";
import {URLSearchParams} from "@angular/http";
import {ParseQueryEncoder} from "./ParseQueryEncoder";

export class ParseCriterionToUrlTransformer extends ItemTransformerAbstract {
  transform(criterion:Criterion, options?:any):{url:string, search:string|URLSearchParams} {
    let compiled = _.template(criterion.options.url || '', {interpolate: /{{([\s\S]+?)}}/g});
    let url = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));

    let search = new URLSearchParams(undefined, new ParseQueryEncoder());
    // Object.keys(criterion.criteria).forEach((key)=> {
    //   search.append(key, criterion.criteria[key]);
    // });

    if (criterion.options.search){
      let existedSearch:string = criterion.options.search instanceof URLSearchParams ?
          (<URLSearchParams>criterion.options.search).rawParams
          :  <string>criterion.options.search;
      let compiled = _.template(existedSearch || '', {interpolate: /{{([\s\S]+?)}}/g});
      existedSearch = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
      search.setAll(new URLSearchParams(existedSearch));
    }

    return {
      url: url,
      search: search
    };
  }

}
