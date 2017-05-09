import {
  RequestOptionsArgs, RequestMethod, URLSearchParams, Headers, ResponseContentType,
  RequestOptions
} from "@angular/http";
import {TransformableInterface} from "../transformer/common";
import {Injector} from "@angular/core";
import {Observable} from "rxjs/Rx";
import * as _ from "lodash";
import {ValidatorFn, Validator, AsyncValidatorFn} from "@angular/forms";

export interface EntityManagerOptions {
  baseUrl?:string;
  headers?:Headers;
  params?:string | URLSearchParams;
  requestTransformer?:TransformableInterface;
  responseTransformer?:TransformableInterface;
}

export interface EMRequestOptionsArgs {
  requestTransformer?:TransformableInterface;
  responseTransformer?:TransformableInterface;
  attempt?:number; //????
  [x:string]:any;
}

export class EMRequestOptions implements EMRequestOptionsArgs {

}

export interface RepositoryConfig {
  endpoint?:EMRequestOptionsArgs|string;
  get?:string|EMRequestOptionsArgs;
  create?:string|EMRequestOptionsArgs;
  update?:string|EMRequestOptionsArgs;
  params?:string|EMRequestOptionsArgs;
  delete?:string|EMRequestOptionsArgs;
}

export interface EntityManagerInterface {
  getInjector():Injector;
  getRepository(Repository:any, options?:any):RepositoryInterface;
  request(url:string, options?:EMRequestOptionsArgs):Observable<any>;
  get(url:string, options?:EMRequestOptionsArgs):Observable<any>;
  create(url:string, body:any, options?:EMRequestOptionsArgs):Observable<any>;
  update(url:string, body:any, options?:EMRequestOptionsArgs):Observable<any>;
  delete(url:string, options?:EMRequestOptionsArgs):Observable<any>;
}


export interface RepositoryInterface {
  setEntityManager(em:EntityManagerInterface):RepositoryInterface;
  getEntityManager():EntityManagerInterface;
  fetchById(id:string):Observable<any>;
  fetchByCriteria(criteria:any):Observable<any[]>;
  fetchAll():Observable<any[]>;
  getAll():Promise<any[]>;
  getById(id:string):Promise<any>;
  getByCriteria(criteria:any):Promise<any[]>;
  save(entity:any):Promise<any>;
  delete(entity:any):Promise<any>;
}

export interface EntityMetadataInterface {
  path:string;
}

export class Criterion {
  public criteria:any;
  public entity:any;
  public options:{url:string; params?:string}|any;

  constructor(criteria?:any, entity?:any, options?:{url:string; params?:string}|any) {
    this.entity = entity || {};
    this.criteria = criteria || {};
    this.options = options || {};
  }
}


export interface EntityConfig extends RepositoryConfig {
  repository?:any;
}

export function getEntityDecoratorConfiguration(target:any) {
  return Reflect.get(target, '__Entity') || {};
}
export function Entity(cfg:EntityConfig) {
  return function (target:Function) {
    Reflect.defineProperty(target, '__Entity', {value: cfg, writable: false});
  }
}

export function getRepositoryDecoratorConfiguration(target:any) {
  return Reflect.get(target, '__Repository') || {};
}
export function Repository(cfg:RepositoryConfig) {
  return function (target:Function) {
    Reflect.defineProperty(target, '__Repository', {value: cfg, writable: false});
  }
}

export function getEmDecoratorConfiguration(target:any) {
  return Reflect.get(target, '__EntityManager') || {};
}
export function EM(cfg:EntityManagerOptions) {
  return function (target:Function) {
    Reflect.defineProperty(target, '__EntityManager', {
      value: {
        baseUrl: cfg.baseUrl || '/',
        headers: cfg.headers || new Headers(),
        params: cfg.params || new URLSearchParams(),
        requestTransformer: cfg.requestTransformer,
        responseTransformer: cfg.responseTransformer
      }, writable: false
    });
  }
}

export function getValidatorDecoratorConfiguration(target:any, group:string = 'default'):{[key:string]:ValidatorFn[]} {
  let validators = Reflect.get(target, '__Validators') || {};
  return validators[group] || [];
}
export function Validator(cfg:ValidatorFn[] | {name:string, validator:ValidatorFn[]}) {
  let config = {
    name: (<any>cfg).name || 'default',
    validator: (<any>cfg).validator || cfg
  };
  return function (target:any, key:string) {
    let validators = Reflect.get(target.constructor, '__Validators') || {};
    validators[config.name] = validators[config.name] || {};
    validators[config.name][key] = validators[config.name][key] || [];
    validators[config.name][key] = validators[config.name][key].concat(config.validator);
    Reflect.defineProperty(target.constructor,'__Validators', {value: validators, writable: true});
  };
}

export function getValidatorAsyncDecoratorConfiguration(target:any, group:string = 'default'):{[key:string]:AsyncValidatorFn[]} {
  let validators = Reflect.get(target, '__ValidatorsAsync') || {};
  return validators[group] || {};
}
export function ValidatorAsync(cfg:AsyncValidatorFn[] | {name:string, validator:AsyncValidatorFn[]}) {
  let config = {
    name: (<any>cfg).name || 'default',
    validator: (<any>cfg).validator || cfg
  };
  return function (target:any, key:string) {
    let validators = Reflect.get(target.constructor, '__ValidatorsAsync') || {};
    validators[config.name] = validators[config.name] || {};
    validators[config.name][key] = validators[config.name][key] || [];
    validators[config.name][key] = validators[config.name][key].concat(config.validator);
    Reflect.defineProperty(target.constructor,'__ValidatorsAsync', {value: validators, writable: true});
  };
}
