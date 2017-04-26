import {Injectable, Optional, Injector} from "@angular/core";
import {
  Http, Response, RequestMethod, Headers, ResponseContentType, RequestOptions,
  URLSearchParams, RequestOptionsArgs
} from "@angular/http";
import {
    EntityManagerOptions, EntityManagerInterface, RepositoryInterface, EMRequestOptionsArgs
} from "./common";
import {TransformableInterface} from "../transformer/common";
import {Observable} from "rxjs/Rx";
import {HttpException, HttpNotFoundException} from "../exceptions/exceptions";
import {EntityManager} from "./EntityManager";



export interface HttpEMRequestOptionsArgs extends RequestOptionsArgs, EMRequestOptionsArgs {

}

export class HttpEMRequestOptions extends RequestOptions implements HttpEMRequestOptionsArgs {
  requestTransformer?:TransformableInterface;
  responseTransformer?:TransformableInterface;

  constructor(options?:HttpEMRequestOptionsArgs) {
    super(options);
    Object.assign(this, options);
  }

  merge(options?:HttpEMRequestOptionsArgs):HttpEMRequestOptions {
    return new HttpEMRequestOptions({
      method: options && options.method != null ? options.method : this.method,
      headers: options && options.headers != null ? options.headers : new Headers(this.headers),
      body: options && options.body != null ? options.body : this.body,
      url: options && options.url != null ? options.url : this.url,
      requestTransformer: options && options.requestTransformer != null ? options.requestTransformer : this.requestTransformer,
      responseTransformer: options && options.responseTransformer != null ? options.responseTransformer : this.responseTransformer,
      params: options && options.params != null ?
          (typeof options.params === 'string' ? new URLSearchParams(<string>options.params) :
              (<URLSearchParams>options.params).clone()) :
          this.params,
      withCredentials: options && options.withCredentials != null ? options.withCredentials :
          this.withCredentials,
      responseType: options && options.responseType != null ? options.responseType :
          this.responseType
    });
  }
}



@Injectable()
export class HttpEntityManager extends EntityManager{
  public config:EntityManagerOptions = {baseUrl: '/', headers: new Headers(), params: new URLSearchParams()};
  protected http:Http;
  
  constructor(_injector:Injector, options?:any) {
    super(_injector, options);
    this.http = _injector.get(Http);
    this.config.params = this.config.params instanceof URLSearchParams ? this.config.params : new URLSearchParams(<string>this.config.params || '');
  }

  /**
   * Performs any type of http request. First argument is required, and can either be a url or
   * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
   * object can be provided as the 2nd argument. The options object will be merged with the values
   * of {@link BaseRequestOptions} before performing the request.
   */
  request(url:string, options:HttpEMRequestOptionsArgs = new HttpEMRequestOptions({method: RequestMethod.Get})):Observable<any> {
    if (this.config.headers){
      this.config.headers.forEach((value:any, name:any)=> {
        if (options.headers && !options.headers.has(name)) {
          options.headers.set(name, value);
        }
      });
    }

    options.params = options.params instanceof URLSearchParams ? options.params : new URLSearchParams(options.params ? options.params.toString() : '') ;
    (<URLSearchParams>options.params).setAll(<URLSearchParams>this.config.params);

    if (options.body && (options.requestTransformer || this.config.requestTransformer)) {
      options.body = this.transformData(options.body, [this.config.requestTransformer, options.requestTransformer]);
    }
    return this.doRequest(url, options)
      .map((res:Response) => {
        let data:any = res;

        switch (options.responseType) {
          case ResponseContentType.ArrayBuffer: {
            data = res.arrayBuffer();
            break;
          }
          case ResponseContentType.Blob: {
            data = res.blob();
            break;
          }
          case ResponseContentType.Text: {
            data = res.text();
            break;
          }
          case ResponseContentType.Json: {
            data = res.json();
            break;
          }
        }

        if (options.responseTransformer || this.config.responseTransformer) {
          data = this.transformData(data, [this.config.responseTransformer, options.responseTransformer]);
        }
        return data;
      })
      .catch((error:Response) => {
        let exception = new HttpException();
        switch (error.status) {
          case 500: {
            exception.message = JSON.parse(error.text());
            break;
          }
          case 404: {
            exception = new HttpNotFoundException(error.text());
            break;
          }
          default: {
            exception.message = error.text() || 'Server error';
            break;
          }
        }
        exception.response = error;
        return Observable.throw(exception);
      });
  }

  protected doRequest(url:string, options:HttpEMRequestOptionsArgs = {}):Observable<any> {
    options.url = (this.config.baseUrl || '')+ url;
    return this.http.request(options.url, options);

  }

  /**
   * Performs a request with `get` http method.
   */
  get(url:string, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.method = RequestMethod.Get;
    return this.request(url, options);
  }

  /**
   * Performs a request with `post` http method.
   */
  create(url:string, body:any, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.body = body;
    options.method = RequestMethod.Post;
    return this.request(url, options);
  }

  /**
   * Performs a request with `put` http method.
   */
  update(url:string, body:any, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.body = body;
    options.method = RequestMethod.Put;
    return this.request(url, options);
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(url:string, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.method = RequestMethod.Delete;
    return this.request(url, options);
  }

  post(url:string, body:any, options?:HttpEMRequestOptionsArgs):Observable<any> {
    return this.create(url, body, options);
  }

  put(url:string, body:any, options?:HttpEMRequestOptionsArgs):Observable<any> {
    return this.update(url, body, options);
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(url:string, body:any, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.body = body;
    options.method = RequestMethod.Patch;
    return this.request(url, options);
  }

  /**
   * Performs a request with `head` http method.
   */
  head(url:string, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.method = RequestMethod.Head;
    return this.request(url, options);
  }

  /**
   * Performs a request with `options` http method.
   */
  options(url:string, options?:HttpEMRequestOptionsArgs):Observable<any> {
    options = options || {};
    options.method = RequestMethod.Options;
    return this.request(url, options);
  }
}
