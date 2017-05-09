import {
    RepositoryInterface, EntityManagerInterface, EntityMetadataInterface, Criterion,
    RepositoryConfig, EMRequestOptions
} from "../common";
import {Observable} from "rxjs/Rx";
import {InvalidConfigurationException} from "../../exceptions/exceptions";
import {TransformableInterface} from "../../transformer/common";
import {CriterionToUrlTransformer} from "../transformers/CriterionToUrlTransformer";
import {ResponseContentType, Headers, RequestOptions} from "@angular/http";
import * as _ from "lodash";
import {CollectionTransformer} from "../../transformer/CollectionTransformer";
import {BaseRepository} from "../BaseRepository";
import {HttpEMRequestOptionsArgs, HttpEMRequestOptions} from "../HttpEntityManager.service";


export class HttpRepository<EntityType> extends BaseRepository<EntityType> {
    constructor(options?:RepositoryConfig|any) {
        super(options);
    }


    protected get defaultRequestOptions():HttpEMRequestOptionsArgs {
        return {
            headers: new Headers(),
            responseType: ResponseContentType.Json
        };
    }

    protected getRequestOptionsFor(action:string):HttpEMRequestOptionsArgs {
        let self = this;

        let options = super.getRequestOptionsFor(action);

        function __anyToHttpEMRequestOptionsArgs(data:string | HttpEMRequestOptionsArgs, defaultRequestOptions:HttpEMRequestOptionsArgs):HttpEMRequestOptionsArgs {
            if (typeof data === "string") {
                defaultRequestOptions.url = data;
                return defaultRequestOptions;
            }
            let ro = new HttpEMRequestOptions(<HttpEMRequestOptionsArgs>data);
            return ro.merge(defaultRequestOptions);
        }
        if (!!options){
            throw new InvalidConfigurationException('Repository not properly configured. You should provide at least default endpoint configuration');
        }
        return __anyToHttpEMRequestOptionsArgs(options, this.defaultRequestOptions);
    }

    get urlTransformer():TransformableInterface {
        return new CriterionToUrlTransformer();
    }


    fetchById(id:string, options?:HttpEMRequestOptionsArgs):Observable<EntityType> {
        options = options || this.getRequestOptionsFor('get');
        const urlParams = this.urlTransformer.transform(new Criterion(
            options,
            {id: id}
        ));
        options.params = urlParams.params;
        return this.getEntityManager().get(urlParams.url, options);
    }

    fetchByCriteria(criteria:any, options?:HttpEMRequestOptionsArgs):Observable<EntityType[]> {
        options = options || this.getRequestOptionsFor('search');

        const urlParams = this.urlTransformer.transform(new Criterion(
            options,
            criteria
        ));
        options.params = urlParams.params;
        if (options.responseTransformer) {
            options.responseTransformer = new CollectionTransformer(options.responseTransformer);
        }
        return this.getEntityManager().get(urlParams.url, options);
    }

    fetchAll(options?:HttpEMRequestOptionsArgs):Observable<EntityType[]> {
        options = options || this.getRequestOptionsFor('search');

        const urlParams = this.urlTransformer.transform(new Criterion(
            options,
        ));
        options.search = urlParams.search;
        if (options.responseTransformer) {
            options.responseTransformer = new CollectionTransformer(options.responseTransformer);
        }
        return this.getEntityManager().get(urlParams.url, options);
    }

    save(entity:any, options?:HttpEMRequestOptionsArgs):Promise<any> {
        options = options || this.getRequestOptionsFor(entity.id ? 'update' : 'create');

        const urlParams = this.urlTransformer.transform(new Criterion(
            options,
            null,
            entity
        ));
        const method = entity.id ? 'put' : 'post';
        options.params = urlParams.params;
        return (<any>this.getEntityManager())[method](urlParams.url, entity, options)
            .toPromise();
    }

    delete(entity:any, options?:HttpEMRequestOptionsArgs):Promise<any> {
        options = options || this.getRequestOptionsFor('delete');
        let criteria = null;
        if (typeof entity === "string" || typeof entity === "number") {
            criteria = {id: entity};
        }
        const urlParams = this.urlTransformer.transform(new Criterion(
            options,
            criteria,
            entity
        ));
        options.params = urlParams.params;
        return this.getEntityManager().delete(urlParams.url, options)
            .toPromise();
    }
}
