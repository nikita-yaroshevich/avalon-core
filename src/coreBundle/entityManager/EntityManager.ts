import {Injector} from "@angular/core";
import {
    RequestOptions
} from "@angular/http";
import {
    EMRequestOptionsArgs, EntityManagerInterface, RepositoryInterface
} from "./common";
import {TransformableInterface} from "../transformer/common";
import {TransformManager} from "../transformer/TransformManager";
import {Observable} from "rxjs/Rx";

export abstract class EntityManager implements EntityManagerInterface {
    protected repositories:Map<string, RepositoryInterface> = new Map<string, RepositoryInterface>();
    public config:any;

    constructor(protected _injector:Injector, config?:any) {
        if (Reflect.has(this.constructor, '__EntityManager')) {
            this.config = Reflect.get(this.constructor, '__EntityManager');
        }

        Object.assign(this.config, config);
    }

    protected transformData(data:any, transformer:TransformableInterface|TransformableInterface[]|(TransformableInterface | undefined)[]):any {
        const manager = new TransformManager();
        return manager.createData(data, transformer);
    }

    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    abstract request(url:string, options:EMRequestOptionsArgs):Observable<any>;

    abstract get(url:string, options?:EMRequestOptionsArgs):Observable<any>;

    abstract create(url:string, body:any, options?:EMRequestOptionsArgs):Observable<any>;

    abstract update(url:string, body:any, options?:EMRequestOptionsArgs):Observable<any>;

    abstract delete(url:string, options?:EMRequestOptionsArgs):Observable<any>;

    getInjector():Injector {
        return this._injector;
    }

    getRepository(RepositoryOrEntityClass:any, options:any = {}):RepositoryInterface {
        let repo_name = RepositoryOrEntityClass.name;
        let entityMeta:any = {};
        if (Reflect.has(RepositoryOrEntityClass, '__Entity')) {
            entityMeta = Reflect.get(RepositoryOrEntityClass, '__Entity');
            if (entityMeta.repository) {
                RepositoryOrEntityClass = entityMeta.repository;
                repo_name += '_' + RepositoryOrEntityClass.name;
            }
        }

        if (this.repositories.has(repo_name)) {
            return <RepositoryInterface>this.repositories.get(repo_name);
        }

        const repo:RepositoryInterface = new RepositoryOrEntityClass(Object.assign({}, options, entityMeta));
        repo.setEntityManager(this);
        this.repositories.set(repo_name, repo);

        return repo;
    }
}
