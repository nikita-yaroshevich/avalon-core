import {TransformableInterface} from "./common";

/**
 * @class
 * @description Create new Object with target type and copy all props from data to it
 */
export class ToTypeTransformer<T> implements TransformableInterface {
  // private Type: T;
  constructor(protected TCreator:{ new ():T; }) {
  }

  transform(data:any, options?:any):T {
    let entity:any = new this.TCreator();
    Object.keys(data).forEach((key:string)=> {
      entity[key] = data[key];
    });
    return entity;
  }

}
