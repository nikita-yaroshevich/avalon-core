import {TransformManager} from "../../coreBundle/transformer/TransformManager";
import {FormGroup, FormControl} from "@angular/forms";
import {TransformableInterface} from "../../coreBundle/transformer/common";
import {FunctionTransformer} from "../../coreBundle/transformer/FunctionTransformer";
import * as _ from "lodash";
import {ChainTransformer} from "../../coreBundle/transformer/ChainTransformer";
import {ToTypeTransformer} from "../../coreBundle/transformer/ToTypeTransformer";
import {
  getValidatorDecoratorConfiguration,
  getValidatorAsyncDecoratorConfiguration
} from "../../coreBundle/entityManager/common";

/**
 * Consolidate forms workflow to make code more seamless
 */
export interface FormTypeInterface {
  /**
   * Reactive FormGroup instance
   */
  formGroup:FormGroup;
  /**
   * @desc
   * initialise and return formGroup
   * @param {*} data
   */
  buildForm(data:any):FormGroup;

  /**
   * @desc
   * Get data and\or converts from FormGroup to data
   * @return {*}
   */
  getEntity():any;
  /**
   * optional property which should return error messages for current form.
   * should be in format:
   * {
   *   fieldName1: 'Invalid Field'
   * }
   *
   * or
   *
   * {
   *   fieldName1: {
   *     REQUIRED: 'field is required',
   *     CUSTOM_ERROR: 'oops',
   *     DEFAULT: 'Invalid Field'
   *   }
   * }
   */
  messages?:any;
}

/**
 * @class
 * Basic form type, probably custom forms should be extend it. Or it could be used as is in simple cases.
 */
export class BasicFormType<T> implements FormTypeInterface {
  protected _formGroup:FormGroup;
  public name:string = 'default';
  get formGroup() {
    return this._formGroup;
  }

  constructor(private TCreator: { new (): T; }, public fields:string[]=[]) {
  }



  buildForm(data:any, options?:any): FormGroup{
    let controls:any = {};
    let validators = getValidatorDecoratorConfiguration(this.TCreator, this.name);
    let validatorsAsync = getValidatorAsyncDecoratorConfiguration(this.TCreator, this.name);

    let fields:string[] = _.uniq(Object.keys(data).concat(this.fields));

    _.forEach(fields, (key:string)=> {
      controls[key] = new FormControl(data[key], validators[key], validatorsAsync[key]);
    });
    this._formGroup = new FormGroup(controls);
    return this._formGroup;
  }

  getEntity(ignoreValidation:boolean = false, options?:any):T {
    if (!ignoreValidation && this._formGroup.invalid) {
      throw new Error('Form is not valid');
    }

    let tm = new TransformManager();

    let fromFormGroupTransformer = new ChainTransformer([
      new FunctionTransformer((form:FormGroup)=> {
        return form.getRawValue();
      }),
      new ToTypeTransformer<T>(this.TCreator)
    ]);

    return tm.createData<T>(this._formGroup, fromFormGroupTransformer, options);
  }
}
