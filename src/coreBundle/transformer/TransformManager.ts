import {ChainTransformer} from "./ChainTransformer";
import {TransformableInterface} from "./common";
import {FunctionTransformer} from "./FunctionTransformer";

/**
 * @class
 * Not a wildly creative name, but the manager is what a user will interact to transform values.
 */
export class TransformManager {
  constructor() {
  }

  /**
   * Main method to kick this all off. Pass data, instance of TransformableInterface
   * or array of TransformableInterface and options to transform. You can spetify Generic type as well
   * @param data
   * @param {TransformableInterface|Function} transformer
   * @param options
   * @return {any}
   */
  createData<T>(data:any, transformer:TransformableInterface| TransformableInterface[] | Function | Function[] | (TransformableInterface | undefined)[], options?:any):T {
    if (Array.isArray(transformer)) {
      transformer = new ChainTransformer(transformer);
    }

    if (transformer instanceof Function) {
      transformer = new FunctionTransformer(<Function>transformer);
    }
    return (<TransformableInterface>transformer).transform(data, options);
  }
}
