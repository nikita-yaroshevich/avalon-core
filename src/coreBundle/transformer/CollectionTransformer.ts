import {FunctionTransformer} from "./FunctionTransformer";
import {TransformableInterface, TransformerOptions} from "./common";

/**
 * @class
 * Apply target to TransformableInterface to every element in data array
 */
export class CollectionTransformer implements TransformableInterface {
  private transformer:TransformableInterface;
  constructor(t:TransformableInterface|Function) {
    if (t instanceof Function){
      this.transformer = new FunctionTransformer(t);
    } else {
      this.transformer = <TransformableInterface>t;
    }
  }

  /**
   * Transform any default or include data into a basic array.
   * @param data
   * @param options
   */
  transform(data:any, options?:TransformerOptions|any):any {
    let result = [];
    for (let item of data) {
      result.push(this.transformer.transform(item, options));
    }
    return result;
  }

}
