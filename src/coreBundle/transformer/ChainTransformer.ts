import {FunctionTransformer} from "./FunctionTransformer";
import {NotFoundException, DuplicateEntityException} from "../exceptions/exceptions";
import * as _ from "lodash";
import {TransformableInterface, TransformerOptions} from "./common";

/**
 * @class
 * Queue of TransformableInterface instances which should be called one by one to transform the data
 * Result of the first transformer is the source for the second and so on.
 */
export class ChainTransformer implements TransformableInterface {
  protected transformers:{transformer:TransformableInterface, options:any}[] = [];

  constructor(transformers?:TransformableInterface|Function|(TransformableInterface | Function | undefined)[]) {
    if (transformers) {
      if (Array.isArray(transformers)) {
        for (let t of transformers) {
          if (!t){ continue; }
          this.addTransformer(t);
        }
      } else {
        this.addTransformer(<TransformableInterface|Function>transformers);
      }
    }
  }

  /**
   * Add transformer or function as transformer. Should be uniq.
   * @param t
   * @param opt  options associated with current transformer. will be deeply merged with options passed to transform method
   * @return {ChainTransformer}
   * @throws DuplicateEntityException
     */
  addTransformer(t:TransformableInterface|Function, opt?:any) {
    if (this.hasTransformer(t)) {
      throw new DuplicateEntityException();
    }

    if (t instanceof Function) {
      this.transformers.push({transformer: new FunctionTransformer(t), options: opt});
    } else {
      this.transformers.push({transformer: <TransformableInterface>t, options: opt});
    }
    return this;
  }

  /**
   * Check if transformer already is in the list
   * @param t
   * @return {boolean}
     */
  hasTransformer(t:TransformableInterface|Function) {
    return _.findIndex(this.transformers, (item)=> {
        return (item.transformer === t || ((<FunctionTransformer>item.transformer).cb && (<FunctionTransformer>item.transformer).cb === t));
      }) !== -1;
  }

  /**
   * remove transformer from the list
   * @param t
   * @return {TransformableInterface}
   * @throws NotFoundException
     */
  removeTransformer(t:TransformableInterface|Function) {
    // if (!this.hasTransformer(t)){
    //   throw new NotFoundException('Transformer not founded');
    // }
    let removed:any = null;

    this.transformers = _.filter(this.transformers, (item)=> {
      if (removed) {
        return true;
      }
      if (item.transformer === t || ((<FunctionTransformer>item.transformer).cb && (<FunctionTransformer>item.transformer).cb === t)) {
        removed = t;
        return false;
      }
      return true;
    });

    if (removed === null) {
      throw new NotFoundException('Transformer not founded');
    }
    return removed;
  }

  /**
   *
   * @return {{transformer: TransformableInterface, options: any}[]}
     */
  getTransformers() {
    return this.transformers;
  }


  transform(data:any, options?:TransformerOptions|any):any {
    let result = data;
    for (let t of this.transformers) {
      result = t.transformer.transform(result, _.merge({}, options, t.options));
    }
    return result;
  }
}
