/**
 * @license Nikita Yaroshevich v2.0.0
 * (c) 2017 Nikita Yaroshevich https://github.com/nikita-yaroshevich/avl-core
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('lodash'), require('rxjs/Rx'), require('inflection'), require('@angular/forms'), require('@angular/common'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', 'lodash', 'rxjs/Rx', 'inflection', '@angular/forms', '@angular/common', '@angular/platform-browser'], factory) :
	(factory((global.avl = global.avl || {}, global.avl.core = global.avl.core || {}),global.ng.core,global._angular_http,global.lodash,global.rxjs_Rx,global.inflection,global._angular_forms,global.ng.common,global._angular_platformBrowser));
}(this, (function (exports,_angular_core,_angular_http,_,rxjs_Rx,inflection,_angular_forms,_angular_common,_angular_platformBrowser) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var NotFoundException = (function (_super) {
    __extends(NotFoundException, _super);
    function NotFoundException(message) {
        return _super.call(this, message) || this;
    }
    return NotFoundException;
}(Error));
var DuplicateEntityException = (function (_super) {
    __extends(DuplicateEntityException, _super);
    function DuplicateEntityException(message) {
        return _super.call(this, message) || this;
    }
    return DuplicateEntityException;
}(Error));
var HttpException = (function (_super) {
    __extends(HttpException, _super);
    function HttpException(message) {
        return _super.call(this, message) || this;
    }
    return HttpException;
}(Error));
var HttpNotFoundException = (function (_super) {
    __extends(HttpNotFoundException, _super);
    function HttpNotFoundException(message) {
        return _super.call(this, message) || this;
    }
    return HttpNotFoundException;
}(HttpException));
var LogicException = (function (_super) {
    __extends(LogicException, _super);
    function LogicException(message) {
        return _super.call(this, message) || this;
    }
    return LogicException;
}(Error));
var InvalidConfigurationException = (function (_super) {
    __extends(InvalidConfigurationException, _super);
    function InvalidConfigurationException(message) {
        return _super.call(this, message) || this;
    }
    return InvalidConfigurationException;
}(Error));
var RuntimeException = (function (_super) {
    __extends(RuntimeException, _super);
    function RuntimeException(message) {
        return _super.call(this, message) || this;
    }
    return RuntimeException;
}(Error));
var AuthenticationException = (function (_super) {
    __extends(AuthenticationException, _super);
    function AuthenticationException(token, message, error) {
        var _this = _super.call(this, message) || this;
        _this.token = token;
        _this.error = error;
        return _this;
    }
    return AuthenticationException;
}(Error));

var CRUDListResolver = (function () {
    function CRUDListResolver(interactor) {
        this.interactor = interactor;
    }
    CRUDListResolver.prototype.resolve = function (route, state) {
        // let id = route.params['id'];
        return this.interactor.findItems().then(function (items) {
            return items;
        });
    };
    return CRUDListResolver;
}());

var CRUDInteractor = (function () {
    function CRUDInteractor(em, options) {
        this.em = em;
        this.options = options;
        this.events = new _angular_core.EventEmitter();
    }
    Object.defineProperty(CRUDInteractor.prototype, "repository", {
        get: function () {
            if (!this._repository) {
                this._repository = this.em.getRepository(this.options.RepositoryClass || this.options.EntityClass);
            }
            return this._repository;
        },
        enumerable: true,
        configurable: true
    });
    CRUDInteractor.prototype.findItems = function (criteria) {
        var _this = this;
        return this.repository.getByCriteria(criteria)
            .then(function (items) {
            return items;
        }).catch(function (e) {
            _this.events.emit({
                type: 'error',
                message: 'Internal Error. Probably Connection Issue'
            });
            return Promise.reject(e);
        });
    };
    CRUDInteractor.prototype.getItemByIndentity = function (id) {
        var _this = this;
        return this.repository.getById(id)
            .catch(function (e) {
            _this.events.emit({
                type: 'error',
                message: 'Internal Error. Probably Connection Issue'
            });
            return Promise.reject(e);
        });
    };
    CRUDInteractor.prototype.removeItem = function (item) {
        var _this = this;
        return this.repository.delete(item)
            .then(function (i) {
            _this.events.emit({
                type: 'success',
                message: 'Removed successfully'
            });
            return i;
        }).catch(function (e) {
            _this.events.emit({
                type: 'error',
                message: e.toString()
            });
            return Promise.reject(e);
        });
    };
    CRUDInteractor.prototype.saveItem = function (item) {
        var _this = this;
        return this.repository.save(item)
            .then(function (i) {
            _this.events.emit({
                type: 'success',
                message: 'Saved successfully'
            });
            return i;
        }).catch(function (e) {
            _this.events.emit({
                type: 'error',
                message: e.toString()
            });
            return Promise.reject(e);
        });
    };
    CRUDInteractor.prototype.createEntity = function () {
        return new this.options.EntityClass();
    };
    return CRUDInteractor;
}());

var CRUDItemResolver = (function () {
    function CRUDItemResolver(interactor, router) {
        this.interactor = interactor;
        this.router = router;
    }
    Object.defineProperty(CRUDItemResolver.prototype, "repository", {
        get: function () {
            return this.interactor.repository;
        },
        enumerable: true,
        configurable: true
    });
    CRUDItemResolver.prototype.resolve = function (route, state) {
        var _this = this;
        var id = route.params['id'];
        if (id === 'new' || !id) {
            return Promise.resolve(this.interactor.createEntity());
        }
        return this.repository.getById(id).then(function (item) {
            if (item) {
                return item;
            }
            else {
                _this.router.navigate(['../']);
                return null;
            }
        });
    };
    return CRUDItemResolver;
}());

var CRUDItemEditComponent = (function () {
    function CRUDItemEditComponent(interactor, route, router, location) {
        this.interactor = interactor;
        this.route = route;
        this.router = router;
        this.location = location;
    }
    CRUDItemEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.data
            .subscribe(function (data) {
            _this.item = data.item;
            _this.reset();
        });
    };
    CRUDItemEditComponent.prototype.save = function (form) {
        var _this = this;
        var entity;
        try {
            entity = form.getEntity();
            this.loading.show();
            return this.interactor.saveItem(entity)
                .then(function (i) {
                _this.item = i;
                _this.reset();
                _this.loading.hide();
                // this.location.back();
            }).catch(function (e) {
                _this.loading.hide();
            });
        }
        catch (e) {
            this.loading.hide();
            this.interactor.events.emit({
                type: 'alert-error',
                message: e.toString()
            });
            return Promise.reject(e);
        }
    };
    CRUDItemEditComponent.prototype.delete = function (item) {
        var _this = this;
        this.interactor.removeItem(item)
            .then(function () {
            _this.location.back();
        });
    };
    CRUDItemEditComponent.prototype.reset = function () {
        this.form = this.getFormType();
        this.form.buildForm(this.item);
    };
    return CRUDItemEditComponent;
}());
CRUDItemEditComponent.propDecorators = {
    'loading': [{ type: _angular_core.ViewChild, args: ['loading',] },],
};

var CRUDListComponent = (function () {
    function CRUDListComponent(interactor, route, router) {
        var _this = this;
        this.interactor = interactor;
        this.route = route;
        this.router = router;
        this.route.data
            .subscribe(function (data) {
            _this.items = data.items;
        });
    }
    CRUDListComponent.prototype.deleteItem = function (item) {
        var _this = this;
        this.interactor.removeItem(item)
            .then(function () {
            _this.interactor.findItems()
                .then(function (items) {
                _this.items = items;
            });
        });
    };
    return CRUDListComponent;
}());

var EMRequestOptions = (function () {
    function EMRequestOptions() {
    }
    return EMRequestOptions;
}());
var Criterion = (function () {
    function Criterion(options, criteria, entity) {
        this.options = options;
        this.entity = entity || {};
        this.criteria = criteria || {};
    }
    return Criterion;
}());
function getEntityDecoratorConfiguration(target) {
    return Reflect.get(target, '__Entity') || {};
}
function Entity(cfg) {
    return function (target) {
        Reflect.defineProperty(target, '__Entity', { value: cfg, writable: false });
    };
}
function getRepositoryDecoratorConfiguration(target) {
    return Reflect.get(target, '__Repository') || {};
}
function Repository(cfg) {
    return function (target) {
        Reflect.defineProperty(target, '__Repository', { value: cfg, writable: false });
    };
}
function getEmDecoratorConfiguration(target) {
    return Reflect.get(target, '__EntityManager') || {};
}
function EM(cfg) {
    return function (target) {
        Reflect.defineProperty(target, '__EntityManager', {
            value: {
                baseUrl: cfg.baseUrl || '/',
                headers: cfg.headers || new _angular_http.Headers(),
                params: cfg.params || new _angular_http.URLSearchParams(),
                requestTransformer: cfg.requestTransformer,
                responseTransformer: cfg.responseTransformer
            }, writable: false
        });
    };
}
function getValidatorDecoratorConfiguration(target, group) {
    if (group === void 0) { group = 'default'; }
    var validators = Reflect.get(target, '__Validators') || {};
    return validators[group] || [];
}
function Validator(cfg) {
    var config = {
        name: cfg.name || 'default',
        validator: cfg.validator || cfg
    };
    return function (target, key) {
        var validators = Reflect.get(target.constructor, '__Validators') || {};
        validators[config.name] = validators[config.name] || {};
        validators[config.name][key] = validators[config.name][key] || [];
        validators[config.name][key] = validators[config.name][key].concat(config.validator);
        Reflect.defineProperty(target.constructor, '__Validators', { value: validators, writable: true });
    };
}
function getValidatorAsyncDecoratorConfiguration(target, group) {
    if (group === void 0) { group = 'default'; }
    var validators = Reflect.get(target, '__ValidatorsAsync') || {};
    return validators[group] || {};
}
function ValidatorAsync(cfg) {
    var config = {
        name: cfg.name || 'default',
        validator: cfg.validator || cfg
    };
    return function (target, key) {
        var validators = Reflect.get(target.constructor, '__ValidatorsAsync') || {};
        validators[config.name] = validators[config.name] || {};
        validators[config.name][key] = validators[config.name][key] || [];
        validators[config.name][key] = validators[config.name][key].concat(config.validator);
        Reflect.defineProperty(target.constructor, '__ValidatorsAsync', { value: validators, writable: true });
    };
}

/**
 * @class
 * Wrap any function to transformer
 */
var FunctionTransformer = (function () {
    function FunctionTransformer(cb) {
        this.cb = cb;
    }
    FunctionTransformer.prototype.transform = function (data, options) {
        return this.cb(data, options);
    };
    return FunctionTransformer;
}());

/**
 * @class
 * Queue of TransformableInterface instances which should be called one by one to transform the data
 * Result of the first transformer is the source for the second and so on.
 */
var ChainTransformer = (function () {
    function ChainTransformer(transformers) {
        this.transformers = [];
        if (transformers) {
            if (Array.isArray(transformers)) {
                for (var _i = 0, transformers_1 = transformers; _i < transformers_1.length; _i++) {
                    var t = transformers_1[_i];
                    if (!t) {
                        continue;
                    }
                    this.addTransformer(t);
                }
            }
            else {
                this.addTransformer(transformers);
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
    ChainTransformer.prototype.addTransformer = function (t, opt) {
        if (this.hasTransformer(t)) {
            throw new DuplicateEntityException();
        }
        if (t instanceof Function) {
            this.transformers.push({ transformer: new FunctionTransformer(t), options: opt });
        }
        else {
            this.transformers.push({ transformer: t, options: opt });
        }
        return this;
    };
    /**
     * Check if transformer already is in the list
     * @param t
     * @return {boolean}
       */
    ChainTransformer.prototype.hasTransformer = function (t) {
        return _.findIndex(this.transformers, function (item) {
            return (item.transformer === t || (item.transformer.cb && item.transformer.cb === t));
        }) !== -1;
    };
    /**
     * remove transformer from the list
     * @param t
     * @return {TransformableInterface}
     * @throws NotFoundException
       */
    ChainTransformer.prototype.removeTransformer = function (t) {
        // if (!this.hasTransformer(t)){
        //   throw new NotFoundException('Transformer not founded');
        // }
        var removed = null;
        this.transformers = _.filter(this.transformers, function (item) {
            if (removed) {
                return true;
            }
            if (item.transformer === t || (item.transformer.cb && item.transformer.cb === t)) {
                removed = t;
                return false;
            }
            return true;
        });
        if (removed === null) {
            throw new NotFoundException('Transformer not founded');
        }
        return removed;
    };
    /**
     *
     * @return {{transformer: TransformableInterface, options: any}[]}
       */
    ChainTransformer.prototype.getTransformers = function () {
        return this.transformers;
    };
    ChainTransformer.prototype.transform = function (data, options) {
        var result = data;
        for (var _i = 0, _a = this.transformers; _i < _a.length; _i++) {
            var t = _a[_i];
            result = t.transformer.transform(result, _.merge({}, options, t.options));
        }
        return result;
    };
    return ChainTransformer;
}());

/**
 * @class
 * Not a wildly creative name, but the manager is what a user will interact to transform values.
 */
var TransformManager = (function () {
    function TransformManager() {
    }
    /**
     * Main method to kick this all off. Pass data, instance of TransformableInterface
     * or array of TransformableInterface and options to transform. You can spetify Generic type as well
     * @param data
     * @param {TransformableInterface|Function} transformer
     * @param options
     * @return {any}
     */
    TransformManager.prototype.createData = function (data, transformer, options) {
        if (Array.isArray(transformer)) {
            transformer = new ChainTransformer(transformer);
        }
        if (transformer instanceof Function) {
            transformer = new FunctionTransformer(transformer);
        }
        return transformer.transform(data, options);
    };
    return TransformManager;
}());

var EntityManager = (function () {
    function EntityManager(_injector, config) {
        this._injector = _injector;
        this.repositories = new Map();
        if (Reflect.has(this.constructor, '__EntityManager')) {
            this.config = Reflect.get(this.constructor, '__EntityManager');
        }
        Object.assign(this.config, config);
    }
    EntityManager.prototype.transformData = function (data, transformer) {
        var manager = new TransformManager();
        return manager.createData(data, transformer);
    };
    EntityManager.prototype.getInjector = function () {
        return this._injector;
    };
    EntityManager.prototype.getRepository = function (RepositoryOrEntityClass, options) {
        if (options === void 0) { options = {}; }
        var repo_name = RepositoryOrEntityClass.name;
        var entityMeta = {};
        if (Reflect.has(RepositoryOrEntityClass, '__Entity')) {
            entityMeta = Reflect.get(RepositoryOrEntityClass, '__Entity');
            if (entityMeta.repository) {
                RepositoryOrEntityClass = entityMeta.repository;
                repo_name += '_' + RepositoryOrEntityClass.name;
            }
        }
        if (this.repositories.has(repo_name)) {
            return this.repositories.get(repo_name);
        }
        var repo = new RepositoryOrEntityClass(Object.assign({}, options, entityMeta));
        repo.setEntityManager(this);
        this.repositories.set(repo_name, repo);
        return repo;
    };
    return EntityManager;
}());

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HttpEMRequestOptions = (function (_super) {
    __extends$1(HttpEMRequestOptions, _super);
    function HttpEMRequestOptions(options) {
        var _this = _super.call(this, options) || this;
        Object.assign(_this, options);
        return _this;
    }
    HttpEMRequestOptions.prototype.merge = function (options) {
        return new HttpEMRequestOptions({
            method: options && options.method != null ? options.method : this.method,
            headers: options && options.headers != null ? options.headers : new _angular_http.Headers(this.headers),
            body: options && options.body != null ? options.body : this.body,
            url: options && options.url != null ? options.url : this.url,
            requestTransformer: options && options.requestTransformer != null ? options.requestTransformer : this.requestTransformer,
            responseTransformer: options && options.responseTransformer != null ? options.responseTransformer : this.responseTransformer,
            params: options && options.params != null ?
                (typeof options.params === 'string' ? new _angular_http.URLSearchParams(options.params) :
                    options.params.clone()) :
                this.params,
            withCredentials: options && options.withCredentials != null ? options.withCredentials :
                this.withCredentials,
            responseType: options && options.responseType != null ? options.responseType :
                this.responseType
        });
    };
    return HttpEMRequestOptions;
}(_angular_http.RequestOptions));
var HttpEntityManager = (function (_super) {
    __extends$1(HttpEntityManager, _super);
    function HttpEntityManager(_injector, options) {
        var _this = _super.call(this, _injector, options) || this;
        _this.config = { baseUrl: '/', headers: new _angular_http.Headers(), params: new _angular_http.URLSearchParams() };
        _this.http = _injector.get(_angular_http.Http);
        _this.config.params = _this.config.params instanceof _angular_http.URLSearchParams ? _this.config.params : new _angular_http.URLSearchParams(_this.config.params || '');
        return _this;
    }
    /**
     * Performs any type of http request. First argument is required, and can either be a url or
     * a {@link Request} instance. If the first argument is a url, an optional {@link RequestOptions}
     * object can be provided as the 2nd argument. The options object will be merged with the values
     * of {@link BaseRequestOptions} before performing the request.
     */
    HttpEntityManager.prototype.request = function (url, options) {
        var _this = this;
        if (options === void 0) { options = new HttpEMRequestOptions({ method: _angular_http.RequestMethod.Get }); }
        if (this.config.headers) {
            this.config.headers.forEach(function (value, name) {
                if (options.headers && !options.headers.has(name)) {
                    options.headers.set(name, value);
                }
            });
        }
        options.params = options.params instanceof _angular_http.URLSearchParams ? options.params : new _angular_http.URLSearchParams(options.params ? options.params.toString() : '');
        options.params.setAll(this.config.params);
        if (options.body && (options.requestTransformer || this.config.requestTransformer)) {
            options.body = this.transformData(options.body, [this.config.requestTransformer, options.requestTransformer]);
        }
        return this.doRequest(url, options)
            .map(function (res) {
            var data = res;
            switch (options.responseType) {
                case _angular_http.ResponseContentType.ArrayBuffer: {
                    data = res.arrayBuffer();
                    break;
                }
                case _angular_http.ResponseContentType.Blob: {
                    data = res.blob();
                    break;
                }
                case _angular_http.ResponseContentType.Text: {
                    data = res.text();
                    break;
                }
                case _angular_http.ResponseContentType.Json: {
                    data = res.json();
                    break;
                }
            }
            if (options.responseTransformer || _this.config.responseTransformer) {
                data = _this.transformData(data, [_this.config.responseTransformer, options.responseTransformer]);
            }
            return data;
        })
            .catch(function (error) {
            var exception = new HttpException();
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
            return rxjs_Rx.Observable.throw(exception);
        });
    };
    HttpEntityManager.prototype.doRequest = function (url, options) {
        if (options === void 0) { options = {}; }
        options.url = (this.config.baseUrl || '') + url;
        return this.http.request(options.url, options);
    };
    /**
     * Performs a request with `get` http method.
     */
    HttpEntityManager.prototype.get = function (url, options) {
        options = options || {};
        options.method = _angular_http.RequestMethod.Get;
        return this.request(url, options);
    };
    /**
     * Performs a request with `post` http method.
     */
    HttpEntityManager.prototype.create = function (url, body, options) {
        options = options || {};
        options.body = body;
        options.method = _angular_http.RequestMethod.Post;
        return this.request(url, options);
    };
    /**
     * Performs a request with `put` http method.
     */
    HttpEntityManager.prototype.update = function (url, body, options) {
        options = options || {};
        options.body = body;
        options.method = _angular_http.RequestMethod.Put;
        return this.request(url, options);
    };
    /**
     * Performs a request with `delete` http method.
     */
    HttpEntityManager.prototype.delete = function (url, options) {
        options = options || {};
        options.method = _angular_http.RequestMethod.Delete;
        return this.request(url, options);
    };
    HttpEntityManager.prototype.post = function (url, body, options) {
        return this.create(url, body, options);
    };
    HttpEntityManager.prototype.put = function (url, body, options) {
        return this.update(url, body, options);
    };
    /**
     * Performs a request with `patch` http method.
     */
    HttpEntityManager.prototype.patch = function (url, body, options) {
        options = options || {};
        options.body = body;
        options.method = _angular_http.RequestMethod.Patch;
        return this.request(url, options);
    };
    /**
     * Performs a request with `head` http method.
     */
    HttpEntityManager.prototype.head = function (url, options) {
        options = options || {};
        options.method = _angular_http.RequestMethod.Head;
        return this.request(url, options);
    };
    /**
     * Performs a request with `options` http method.
     */
    HttpEntityManager.prototype.options = function (url, options) {
        options = options || {};
        options.method = _angular_http.RequestMethod.Options;
        return this.request(url, options);
    };
    return HttpEntityManager;
}(EntityManager));
HttpEntityManager.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
HttpEntityManager.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
    null,
]; };

var BaseRepository = (function () {
    function BaseRepository(options) {
        this.options = options || {};
    }
    BaseRepository.prototype.setEntityManager = function (em) {
        this.em = em;
        return this;
    };
    BaseRepository.prototype.getEntityManager = function () {
        return this.em;
    };
    BaseRepository.prototype.getRequestOptionsFor = function (action) {
        var self = this;
        var opt = this.options;
        if (Reflect.has(this.constructor, '__Repository')) {
            opt = Object.assign({}, this.options, Reflect.get(this.constructor, '__Repository'));
        }
        if (opt[action]) {
            return opt[action];
        }
        if (opt.endpoint) {
            return opt.endpoint;
        }
        throw new InvalidConfigurationException('Repository not properly configured. You should provide at least default endpoint configuration');
    };
    BaseRepository.prototype.getAll = function (options) {
        return this.fetchAll(options).toPromise();
    };
    BaseRepository.prototype.getById = function (id, options) {
        return this.fetchById(id, options).toPromise();
    };
    BaseRepository.prototype.getByCriteria = function (criteria, options) {
        return this.fetchByCriteria(criteria, options).toPromise();
    };
    return BaseRepository;
}());

/**
 * @class
 * All Transformer classes should extend this to utilize the convenience methods.
 * You can add includePropertyName to extended class, and pass TransformerOptions.include param with name
 * propertyName to add optional includes.
 *
 * Extend it and add a `transform()` method to transform any default or included data
 * into a basic array.
 */
var ItemTransformerAbstract = (function () {
    function ItemTransformerAbstract() {
        /**
         * List of by default included dynamic properties
         * @type {string[]}
         */
        this.defaultIncludes = [];
    }
    /**
     * return included data
     * @param data
     * @param options
     * @return {any}
       */
    ItemTransformerAbstract.prototype.getIncludeData = function (data, options) {
        var includes = this.getIncludes(options);
        // if (includes.length === 0) {
        //   return {};
        // }
        var result = {};
        for (var _i = 0, includes_1 = includes; _i < includes_1.length; _i++) {
            var incName = includes_1[_i];
            try {
                result[incName] = this[this.getIncludeMethodName(incName)](data, options);
            }
            catch (e) {
                throw new Error('Unable to transform with error ' + e.toString());
            }
        }
        return result;
    };
    ItemTransformerAbstract.prototype.getIncludes = function (options) {
        var _this = this;
        options = options || {};
        var incs = _.without(_.uniq(this.defaultIncludes.concat(options.include || [])), options.exclude);
        incs = incs.filter(function (name) { return _this[_this.getIncludeMethodName(name)]; });
        return incs;
    };
    ItemTransformerAbstract.prototype.getIncludeMethodName = function (name) {
        return 'include' + inflection.classify(name);
    };
    return ItemTransformerAbstract;
}());

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CriterionToUrlTransformer = (function (_super) {
    __extends$3(CriterionToUrlTransformer, _super);
    function CriterionToUrlTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CriterionToUrlTransformer.prototype.transform = function (criterion, options) {
        var compiled = _.template(criterion.options.url || '', { interpolate: /{{([\s\S]+?)}}/g });
        var url = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
        var search = new _angular_http.URLSearchParams();
        Object.keys(criterion.criteria).forEach(function (key) {
            search.append(key, criterion.criteria[key]);
        });
        if (criterion.options.search) {
            var existedSearch = criterion.options.search instanceof _angular_http.URLSearchParams ?
                criterion.options.search.rawParams
                : criterion.options.search;
            var compiled_1 = _.template(existedSearch || '', { interpolate: /{{([\s\S]+?)}}/g });
            existedSearch = compiled_1(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
            search.setAll(new _angular_http.URLSearchParams(existedSearch));
        }
        return {
            url: url,
            search: search
        };
    };
    return CriterionToUrlTransformer;
}(ItemTransformerAbstract));

/**
 * @class
 * Apply target to TransformableInterface to every element in data array
 */
var CollectionTransformer = (function () {
    function CollectionTransformer(t) {
        if (t instanceof Function) {
            this.transformer = new FunctionTransformer(t);
        }
        else {
            this.transformer = t;
        }
    }
    /**
     * Transform any default or include data into a basic array.
     * @param data
     * @param options
     */
    CollectionTransformer.prototype.transform = function (data, options) {
        var result = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            result.push(this.transformer.transform(item, options));
        }
        return result;
    };
    return CollectionTransformer;
}());

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HttpRepository = (function (_super) {
    __extends$2(HttpRepository, _super);
    function HttpRepository(options) {
        return _super.call(this, options) || this;
    }
    Object.defineProperty(HttpRepository.prototype, "defaultRequestOptions", {
        get: function () {
            return {
                headers: new _angular_http.Headers(),
                responseType: _angular_http.ResponseContentType.Json
            };
        },
        enumerable: true,
        configurable: true
    });
    HttpRepository.prototype.getRequestOptionsFor = function (action) {
        var self = this;
        var options = _super.prototype.getRequestOptionsFor.call(this, action);
        function __anyToHttpEMRequestOptionsArgs(data, defaultRequestOptions) {
            if (typeof data === "string") {
                defaultRequestOptions.url = data;
                return defaultRequestOptions;
            }
            var ro = new HttpEMRequestOptions(data);
            return ro.merge(defaultRequestOptions);
        }
        if (!!options) {
            throw new InvalidConfigurationException('Repository not properly configured. You should provide at least default endpoint configuration');
        }
        return __anyToHttpEMRequestOptionsArgs(options, this.defaultRequestOptions);
    };
    Object.defineProperty(HttpRepository.prototype, "urlTransformer", {
        get: function () {
            return new CriterionToUrlTransformer();
        },
        enumerable: true,
        configurable: true
    });
    HttpRepository.prototype.fetchById = function (id, options) {
        options = options || this.getRequestOptionsFor('get');
        var urlParams = this.urlTransformer.transform(new Criterion(options, { id: id }));
        options.params = urlParams.params;
        return this.getEntityManager().get(urlParams.url, options);
    };
    HttpRepository.prototype.fetchByCriteria = function (criteria, options) {
        options = options || this.getRequestOptionsFor('search');
        var urlParams = this.urlTransformer.transform(new Criterion(options, criteria));
        options.search = urlParams.search;
        if (options.responseTransformer) {
            options.responseTransformer = new CollectionTransformer(options.responseTransformer);
        }
        return this.getEntityManager().get(urlParams.url, options);
    };
    HttpRepository.prototype.fetchAll = function (options) {
        options = options || this.getRequestOptionsFor('search');
        var urlParams = this.urlTransformer.transform(new Criterion(options));
        options.search = urlParams.search;
        if (options.responseTransformer) {
            options.responseTransformer = new CollectionTransformer(options.responseTransformer);
        }
        return this.getEntityManager().get(urlParams.url, options);
    };
    HttpRepository.prototype.save = function (entity, options) {
        options = options || this.getRequestOptionsFor(entity.id ? 'update' : 'create');
        var urlParams = this.urlTransformer.transform(new Criterion(options, null, entity));
        var method = entity.id ? 'put' : 'post';
        options.params = urlParams.params;
        return this.getEntityManager()[method](urlParams.url, entity, options)
            .toPromise();
    };
    HttpRepository.prototype.delete = function (entity, options) {
        options = options || this.getRequestOptionsFor('delete');
        var criteria = null;
        if (typeof entity === "string" || typeof entity === "number") {
            criteria = { id: entity };
        }
        var urlParams = this.urlTransformer.transform(new Criterion(options, criteria, entity));
        options.params = urlParams.params;
        return this.getEntityManager().delete(urlParams.url, options)
            .toPromise();
    };
    return HttpRepository;
}(BaseRepository));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ParseQueryEncoder = (function (_super) {
    __extends$6(ParseQueryEncoder, _super);
    function ParseQueryEncoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParseQueryEncoder.prototype.encodeKey = function (k) {
        return k;
    };
    ParseQueryEncoder.prototype.encodeValue = function (v) {
        return v;
    };
    return ParseQueryEncoder;
}(_angular_http.QueryEncoder));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ParseCriterionToUrlTransformer = (function (_super) {
    __extends$5(ParseCriterionToUrlTransformer, _super);
    function ParseCriterionToUrlTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParseCriterionToUrlTransformer.prototype.transform = function (criterion, options) {
        var compiled = _.template(criterion.options.url || '', { interpolate: /{{([\s\S]+?)}}/g });
        var url = compiled(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
        var search = new _angular_http.URLSearchParams(undefined, new ParseQueryEncoder());
        // Object.keys(criterion.criteria).forEach((key)=> {
        //   search.append(key, criterion.criteria[key]);
        // });
        if (criterion.options.search) {
            var existedSearch = criterion.options.search instanceof _angular_http.URLSearchParams ?
                criterion.options.search.rawParams
                : criterion.options.search;
            var compiled_1 = _.template(existedSearch || '', { interpolate: /{{([\s\S]+?)}}/g });
            existedSearch = compiled_1(Object.assign(Object.create(criterion.entity), criterion.entity, criterion.criteria));
            search.setAll(new _angular_http.URLSearchParams(existedSearch));
        }
        return {
            url: url,
            search: search
        };
    };
    return ParseCriterionToUrlTransformer;
}(ItemTransformerAbstract));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ParseBaseRepository = (function (_super) {
    __extends$4(ParseBaseRepository, _super);
    function ParseBaseRepository(options) {
        return _super.call(this, options) || this;
    }
    Object.defineProperty(ParseBaseRepository.prototype, "urlTransformer", {
        get: function () {
            return new ParseCriterionToUrlTransformer();
        },
        enumerable: true,
        configurable: true
    });
    ParseBaseRepository.prototype.getRequestOptionsFor = function (action) {
        var opt = _super.prototype.getRequestOptionsFor.call(this, action);
        var defaultOpt = _super.prototype.getRequestOptionsFor.call(this, 'endpoint');
        // if (['get', 'update', 'delete'].indexOf(action) !== -1){
        //   opt.search = new URLSearchParams('where={"objectId":"{{id}}"}');
        // }
        if (['get', 'update', 'delete'].indexOf(action) !== -1 && opt.url === defaultOpt.url) {
            opt.url += '/{{id}}';
        }
        // if (['create', 'update'].indexOf(action) !== -1 && !opt.requestTransformer){
        // opt.requestTransformer = new FunctionTransformer((data)=>{
        //   return [].concat();//data.id ? { '$set' : data} : data;
        // });
        // }
        return opt;
    };
    ParseBaseRepository.prototype.save = function (entity, options) {
        options = options || this.getRequestOptionsFor(entity.id ? 'update' : 'create');
        options.requestTransformer = options.requestTransformer || new FunctionTransformer(function (e) {
            delete e.createdAt;
            delete e.updatedAt;
            return e;
        });
        return _super.prototype.save.call(this, entity, options)
            .then(function (d) {
            entity.updatedAt = d.updatedAt;
            return entity;
        });
    };
    return ParseBaseRepository;
}(HttpRepository));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RESTBaseRepository = (function (_super) {
    __extends$7(RESTBaseRepository, _super);
    function RESTBaseRepository(options) {
        return _super.call(this, options) || this;
    }
    RESTBaseRepository.prototype.getRequestOptionsFor = function (action) {
        var opt = _super.prototype.getRequestOptionsFor.call(this, action);
        var defaultOpt = _super.prototype.getRequestOptionsFor.call(this, 'endpoint');
        if (['get', 'update', 'delete'].indexOf(action) !== -1 && opt.url === defaultOpt.url) {
            opt.url += '/{{id}}';
        }
        // if (['create', 'update'].indexOf(action) !== -1 && !opt.requestTransformer){
        // opt.requestTransformer = new FunctionTransformer((data)=>{
        //   return [].concat();//data.id ? { '$set' : data} : data;
        // });
        // }
        return opt;
    };
    return RESTBaseRepository;
}(HttpRepository));

var EventDispatcher = (function () {
    function EventDispatcher() {
        this.subscribers = {};
    }
    EventDispatcher.prototype.dispatch = function (name, event) {
        if (!this.subscribers[name]) {
            return;
        }
        this.subscribers[name].emit(event);
    };
    EventDispatcher.prototype.addSubscriber = function (subscriber) {
        var _this = this;
        var subscriptions = [];
        Object.keys(subscriber.subscribedEvents).forEach(function (eventName) {
            var listener = subscriber.subscribedEvents[eventName];
            if (typeof listener === "string") {
                listener = subscriber[listener] ? function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return subscriber[(subscriber.subscribedEvents[eventName])].apply(subscriber, args);
                } : null;
            }
            if (!listener) {
                throw Error("Unable to subscribe to " + eventName + " because listener is not defined");
            }
            subscriptions.push(_this.addListener(eventName, listener));
        });
        return subscriptions;
    };
    EventDispatcher.prototype.addListener = function (eventName, listener) {
        if (!listener || !(listener instanceof Function)) {
            throw Error("Unable to subscribe to " + eventName + " because provided event listener is not supported");
        }
        this.subscribers[eventName] = this.subscribers[eventName] || new _angular_core.EventEmitter();
        return this.subscribers[eventName].subscribe(listener);
    };
    return EventDispatcher;
}());

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CORE_EVENT_DISPATCHER = new _angular_core.OpaqueToken('CORE_EVENT_DISPATCHER');
var CoreEventDispatcherService = (function (_super) {
    __extends$8(CoreEventDispatcherService, _super);
    function CoreEventDispatcherService() {
        return _super.call(this) || this;
    }
    return CoreEventDispatcherService;
}(EventDispatcher));
CoreEventDispatcherService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
CoreEventDispatcherService.ctorParameters = function () { return []; };

var Event = (function () {
    function Event(data) {
        this.subject = data;
    }
    return Event;
}());

/**
 * Transformer options optional type
 */
var TransformerOptions = (function () {
    function TransformerOptions() {
    }
    return TransformerOptions;
}());

/**
 * @class
 * @description Create new Object with target type and copy all props from data to it
 */
var ToTypeTransformer = (function () {
    // private Type: T;
    function ToTypeTransformer(TCreator) {
        this.TCreator = TCreator;
    }
    ToTypeTransformer.prototype.transform = function (data, options) {
        var entity = new this.TCreator();
        Object.keys(data).forEach(function (key) {
            entity[key] = data[key];
        });
        return entity;
    };
    return ToTypeTransformer;
}());

var UserChangedEvent = (function () {
    function UserChangedEvent(prevToken, token) {
        this.prevToken = prevToken;
        this.token = token;
    }
    return UserChangedEvent;
}());
var UserAuthEvent = (function () {
    function UserAuthEvent() {
    }
    return UserAuthEvent;
}());

var AnonymusUser = (function () {
    function AnonymusUser() {
    }
    return AnonymusUser;
}());
var AnonymousUserToken = (function () {
    function AnonymousUserToken() {
        this.roles = [];
        this.user = new AnonymusUser();
    }
    AnonymousUserToken.prototype.getUsername = function () {
        return 'Unknown';
    };
    AnonymousUserToken.prototype.getUser = function () {
        return this.user;
    };
    AnonymousUserToken.prototype.hasRole = function (name) {
        return this.roles.indexOf(name) !== -1;
    };
    AnonymousUserToken.prototype.isAuthenticated = function () {
        return false;
    };
    return AnonymousUserToken;
}());

var ManualAuthProvider = (function () {
    function ManualAuthProvider() {
    }
    ManualAuthProvider.prototype.restore = function () {
        return Promise.reject(null);
    };
    ManualAuthProvider.prototype.logout = function () {
        return undefined;
    };
    ManualAuthProvider.prototype.authenticate = function (token) {
        token.setAuthenticated(true);
        return Promise.resolve(token);
    };
    ManualAuthProvider.prototype.supports = function (token) {
        return token instanceof ManualUserToken;
    };
    return ManualAuthProvider;
}());
var ManualUserToken = (function () {
    function ManualUserToken(user) {
        this.user = user;
        this._isAuthenticated = false;
        this.roles = [];
    }
    ManualUserToken.prototype.getUser = function () {
        return this.user;
    };
    ManualUserToken.prototype.getUsername = function () {
        return this.getUser()['username'] || 'Anonymous';
    };
    ManualUserToken.prototype.hasRole = function (name) {
        return this.roles.indexOf(name) !== -1;
    };
    ManualUserToken.prototype.setAuthenticated = function (state) {
        if (state === void 0) { state = true; }
        this._isAuthenticated = state;
        return this;
    };
    ManualUserToken.prototype.isAuthenticated = function () {
        return this._isAuthenticated;
    };
    return ManualUserToken;
}());

var USER_SERVICE_AUTH_PROVIDERS = new _angular_core.InjectionToken('USER_SERVICE_AUTH_PROVIDERS');
var UserService = (function () {
    function UserService(injector) {
        var _this = this;
        this.injector = injector;
        this.onUserChanged = new _angular_core.EventEmitter();
        this.onAuthRequired = new _angular_core.EventEmitter();
        this.userToken = new AnonymousUserToken();
        this.eventDispatcher = injector.get(CoreEventDispatcherService, null);
        this.onAuthRequired.subscribe(function (event) {
            if (_this.eventDispatcher) {
                _this.eventDispatcher.dispatch(UserService.EVENTS.ON_AUTH_REQUIRED, event);
            }
        });
    }
    UserService.prototype.getUserToken = function () {
        return this.userToken;
    };
    UserService.prototype.getProviders = function () {
        return this.injector.get(USER_SERVICE_AUTH_PROVIDERS, []);
    };
    UserService.prototype.getUser = function () {
        return this.getUserToken().getUser();
    };
    /**
     *
     * @param token
     * @return {Promise<UserTokenInterface>}
     * @throw LogicException
     */
    UserService.prototype.authenticate = function (token) {
        var _this = this;
        var provider = this.getProviders().find(function (p) {
            return p.supports(token);
        });
        if (!provider) {
            throw new LogicException('Token not supported');
        }
        return provider.authenticate(token)
            .then(function (token) {
            if (_this.providerOnAuthTokenChangedSubscription) {
                _this.providerOnAuthTokenChangedSubscription.unsubscribe();
            }
            if (provider.onAuthTokenChanged) {
                _this.providerOnAuthTokenChangedSubscription = provider.onAuthTokenChanged.subscribe(function (token) {
                    _this.setToken(token);
                });
            }
            return _this.setToken(token);
        });
    };
    UserService.prototype.setToken = function (token) {
        var oldToken = this.getUserToken();
        if (oldToken === token) {
            return;
        }
        this.userToken = token;
        var event = new UserChangedEvent(oldToken, this.getUserToken());
        this.onUserChanged.emit(event);
        if (this.eventDispatcher) {
            this.eventDispatcher.dispatch(UserService.EVENTS.ON_USER_CHANGED, event);
        }
        return this.userToken;
    };
    UserService.prototype.logout = function () {
        var _this = this;
        return Promise.all(this.getProviders().map(function (provider) {
            return provider.logout();
        })).then(function (results) {
            var token = results.pop();
            return _this.setToken(new AnonymousUserToken());
        }, function () {
            return _this.setToken(new AnonymousUserToken());
        });
    };
    UserService.prototype.reload = function () {
        var _this = this;
        this.userToken = new AnonymousUserToken();
        return Promise.all(this.getProviders().map(function (provider) {
            return provider.restore();
        })).then(function (results) {
            var token = results.pop();
            return _this.setToken(token);
        }, function () {
            return Promise.resolve();
        });
    };
    return UserService;
}());
UserService.EVENTS = {
    'ON_USER_CHANGED': 'ON_USER_CHANGED',
    'ON_AUTH_REQUIRED': 'ON_AUTH_REQUIRED'
};
UserService.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserService.ctorParameters = function () { return [
    { type: _angular_core.Injector, },
]; };

var UserRestoreResolver = (function () {
    function UserRestoreResolver(userService) {
        this.userService = userService;
    }
    UserRestoreResolver.prototype.resolve = function (route, state) {
        return this.userService.reload();
    };
    return UserRestoreResolver;
}());
UserRestoreResolver.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserRestoreResolver.ctorParameters = function () { return [
    { type: UserService, },
]; };

var UserAuthenticatedCanActivateRouterGuard = (function () {
    function UserAuthenticatedCanActivateRouterGuard(userService) {
        this.userService = userService;
    }
    UserAuthenticatedCanActivateRouterGuard.prototype.canActivate = function () {
        return this.userService.getUserToken().isAuthenticated();
    };
    return UserAuthenticatedCanActivateRouterGuard;
}());
UserAuthenticatedCanActivateRouterGuard.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserAuthenticatedCanActivateRouterGuard.ctorParameters = function () { return [
    { type: UserService, },
]; };
var UserAuthenticatedCanActivateChildRouterGuard = (function () {
    function UserAuthenticatedCanActivateChildRouterGuard(userService) {
        this.userService = userService;
    }
    UserAuthenticatedCanActivateChildRouterGuard.prototype.canActivateChild = function () {
        return this.userService.getUserToken().isAuthenticated();
    };
    return UserAuthenticatedCanActivateChildRouterGuard;
}());
UserAuthenticatedCanActivateChildRouterGuard.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserAuthenticatedCanActivateChildRouterGuard.ctorParameters = function () { return [
    { type: UserService, },
]; };
var UserRolesAllowedCanActivateRouterGuard = (function () {
    function UserRolesAllowedCanActivateRouterGuard(userService) {
        this.userService = userService;
        this.roles = [];
    }
    UserRolesAllowedCanActivateRouterGuard.prototype.canActivate = function () {
        var token = this.userService.getUserToken();
        for (var i = 0; i < this.roles.length; i++) {
            if (!token.hasRole(this.roles[i])) {
                return false;
            }
        }
        return true;
    };
    return UserRolesAllowedCanActivateRouterGuard;
}());
UserRolesAllowedCanActivateRouterGuard.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserRolesAllowedCanActivateRouterGuard.ctorParameters = function () { return [
    { type: UserService, },
]; };
var UserRolesAllowedCanActivateChildRouterGuard = (function () {
    function UserRolesAllowedCanActivateChildRouterGuard(userService) {
        this.userService = userService;
        this.roles = [];
    }
    UserRolesAllowedCanActivateChildRouterGuard.prototype.canActivateChild = function () {
        var token = this.userService.getUserToken();
        for (var i = 0; i < this.roles.length; i++) {
            if (!token.hasRole(this.roles[i])) {
                return false;
            }
        }
        return true;
    };
    return UserRolesAllowedCanActivateChildRouterGuard;
}());
UserRolesAllowedCanActivateChildRouterGuard.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
UserRolesAllowedCanActivateChildRouterGuard.ctorParameters = function () { return [
    { type: UserService, },
]; };

var UsernamePasswordAuthProvider = (function () {
    // abstract authenticate(token:UserTokenInterface):Promise<UserTokenInterface>;
    function UsernamePasswordAuthProvider(authUrl, http) {
        this.authUrl = authUrl;
        this.http = http;
    }
    UsernamePasswordAuthProvider.prototype.authenticate = function (token) {
        return this.http.get(this.authUrl, { search: new _angular_http.URLSearchParams("username=" + token.username + "&password=" + token.password) })
            .toPromise()
            .then(function (response) {
            var data = response.json();
            var user = new BasicUser(data);
            token.setUser(user);
            return token;
        })
            .catch(function (error) {
            return Promise.reject(new AuthenticationException(token, error.message, error));
        });
    };
    UsernamePasswordAuthProvider.prototype.supports = function (token) {
        // return !!(token.password && token.username);
        return token instanceof UsernamePasswordToken;
    };
    UsernamePasswordAuthProvider.prototype.restore = function () {
        return Promise.reject(null);
    };
    UsernamePasswordAuthProvider.prototype.logout = function () {
        return Promise.resolve(new AnonymousUserToken());
    };
    return UsernamePasswordAuthProvider;
}());
var BasicUser = (function () {
    function BasicUser(props) {
        Object.assign(this, props);
    }
    return BasicUser;
}());
var UsernamePasswordToken = (function () {
    function UsernamePasswordToken(username, password) {
        this.username = username;
        this.password = password;
        this.roles = [];
        this.user = new BasicUser({ username: username });
    }
    UsernamePasswordToken.prototype.getUser = function () {
        return this.user;
    };
    UsernamePasswordToken.prototype.getUsername = function () {
        return this.getUser().username;
    };
    UsernamePasswordToken.prototype.hasRole = function (name) {
        return this.roles.indexOf(name) !== -1;
    };
    UsernamePasswordToken.prototype.setUser = function (user) {
        this.user = user;
        return this;
    };
    UsernamePasswordToken.prototype.isAuthenticated = function () {
        return !(this.user instanceof AnonymusUser);
    };
    return UsernamePasswordToken;
}());

var Utils = (function () {
    function Utils() {
    }
    Utils.readCookie = function (name) {
        var result = new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)').exec(document.cookie);
        return result ? result[1] : null;
    };
    Utils.writeCookie = function (name, value, days) {
        if (!days) {
            days = 365 * 20;
        }
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + value + expires + "; path=/";
    };
    Utils.removeCookie = function (name) {
        this.writeCookie(name, "", -1);
    };
    return Utils;
}());

var ParseAuthProvider = (function () {
    function ParseAuthProvider(options, http) {
        this.options = options;
        this.http = http;
    }
    ParseAuthProvider.prototype.supports = function (token) {
        return token instanceof UsernamePasswordToken;
    };
    ParseAuthProvider.prototype.authenticate = function (token) {
        return this.http.get(this.options.authUrl, {
            params: new _angular_http.URLSearchParams("username=" + token.username + "&password=" + token.password),
            headers: new _angular_http.Headers({
                'X-Parse-Application-Id': this.options.X_Parse_Application_Id,
                'X-Parse-REST-API-Key': this.options.X_Parse_REST_API_Key
            })
        })
            .toPromise()
            .then(function (response) {
            var data = response.json();
            var token = new ParseAuthToken(data);
            Utils.writeCookie('ParseAuthProvider_remeberme', data);
            return token;
        }).catch(function (e) {
            var error = e.json();
            return Promise.reject(new AuthenticationException(token, error.message, error));
        });
    };
    ParseAuthProvider.prototype.restore = function () {
        var _this = this;
        var token_data = Utils.readCookie('ParseAuthProvider_remeberme');
        return (token_data ? Promise.resolve(new ParseAuthToken(token_data)) : Promise.reject(null))
            .then(function (token_data) {
            return _this.http.get(_this.options.baseUrl + '/users/me', {
                // search: new URLSearchParams(`username=${token.username}&password=${token.password}`),
                headers: new _angular_http.Headers({
                    'X-Parse-Application-Id': _this.options.X_Parse_Application_Id,
                    'X-Parse-REST-API-Key': _this.options.X_Parse_REST_API_Key,
                    'X-Parse-Session-Token': token_data.sessionToken
                })
            })
                .toPromise()
                .then(function (response) {
                return token_data;
            }).catch(function (e) {
                return Promise.reject(null);
            });
        });
    };
    ParseAuthProvider.prototype.logout = function () {
        Utils.removeCookie('ParseAuthProvider_remeberme');
        return Promise.resolve(new AnonymousUserToken());
    };
    return ParseAuthProvider;
}());
var ParseAuthToken = (function () {
    function ParseAuthToken(data) {
        var _this = this;
        this.roles = [];
        this.user = {};
        Object.keys(data).forEach(function (key) {
            _this.user[key] = data[key];
        });
    }
    ParseAuthToken.prototype.getUser = function () {
        return this.user;
    };
    ParseAuthToken.prototype.getUsername = function () {
        return this.getUser().username;
    };
    ParseAuthToken.prototype.hasRole = function (name) {
        return this.roles.indexOf(name) !== -1;
    };
    ParseAuthToken.prototype.setUser = function (user) {
        this.user = user;
        return this;
    };
    ParseAuthToken.prototype.isAuthenticated = function () {
        return !!this.getUser().sessionToken;
    };
    return ParseAuthToken;
}());

var __extends$9 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FirebaseAuthProvider = (function () {
    function FirebaseAuthProvider(firebase_auth) {
        var _this = this;
        this.firebase_auth = firebase_auth;
        this.onAuthTokenChanged = rxjs_Rx.Observable.create(function (subscriber) {
            firebase_auth.onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    _this.user = user;
                    subscriber.next(user.isAnonymous ? new FirebaseAnonymusAuthToken(user) : new FirebaseAuthToken(user));
                    user.getToken()
                        .then(function (tokenString) {
                        Utils.writeCookie('FirebaseAuthProvider_token', tokenString);
                    });
                }
                else {
                    // User is signed out.
                    Utils.removeCookie('FirebaseAuthProvider_token');
                    _this.user = null;
                    subscriber.next(new AnonymousUserToken());
                }
            });
        });
    }
    FirebaseAuthProvider.prototype.supports = function (token) {
        return token instanceof UsernamePasswordToken || token instanceof FirebaseSocialAuthToken || token instanceof FirebaseAnonymusAuthToken || token instanceof FirebaseAuthToken;
    };
    FirebaseAuthProvider.prototype.authenticate = function (token) {
        return this.doAuthenticate(token)
            .then(function (token) {
            return token;
        })
            .catch(function (e) {
            return Promise.reject(e);
        });
    };
    FirebaseAuthProvider.prototype.doAuthenticate = function (token) {
        if (token instanceof UsernamePasswordToken) {
            return this.authenticateByUsernamePassword(token);
        }
        if (token instanceof FirebaseSocialAuthToken) {
            return this.authenticateByOAuthService(token);
        }
        if (this.user && token instanceof FirebaseAuthToken) {
            return this.authenticateWithExisted(token);
        }
        return this.authenticateAnonymously(token);
    };
    FirebaseAuthProvider.prototype.authenticateWithExisted = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.user) {
                return resolve(token);
            }
            else {
                return reject(new AuthenticationException(token, "User not really signed in. Try reload the app."));
            }
        });
    };
    FirebaseAuthProvider.prototype.authenticateAnonymously = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.firebase_auth.signInAnonymously()
                .then(function (user) {
                resolve(new FirebaseAnonymusAuthToken(user));
            })
                .catch(function (error) {
                reject(new AuthenticationException(token, error.message, error));
            });
        });
    };
    FirebaseAuthProvider.prototype.authenticateByUsernamePassword = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.user) {
                var credential_1 = firebase.auth.EmailAuthProvider.credential(token.getUsername(), token.password);
                _this.firebase_auth.currentUser.linkWithCredential(credential_1).then(function (user) {
                    return resolve(new FirebaseAuthToken(user));
                }, function (error) {
                    if (error.code === "auth/email-already-in-use") {
                        _this.user.reauthenticateWithCredential(credential_1)
                            .then(function (user) {
                            resolve(new FirebaseAuthToken(user));
                        })
                            .catch(function (error) {
                            reject(new AuthenticationException(token, error.message, error));
                        });
                    }
                    else {
                        reject(new AuthenticationException(token, error.message, error));
                    }
                });
            }
            else {
                _this.firebase_auth.signInWithEmailAndPassword(token.getUsername(), token.password)
                    .then(function (user) {
                    resolve(new FirebaseAuthToken(user));
                })
                    .catch(function (error) {
                    reject(new AuthenticationException(token, error.message, error));
                });
            }
        });
    };
    FirebaseAuthProvider.prototype.authenticateByOAuthService = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.user) {
                var credential = token.socialProvider.credential(token.socialProvider);
                _this.firebase_auth.currentUser.linkWithCredential(credential).then(function (user) {
                    return resolve(new FirebaseAuthToken(user));
                }, function (error) {
                    reject(new AuthenticationException(token, error.message, error));
                });
            }
            else {
                // this.firebase_auth.signInWithRedirect(token.socialProvider);
                // this.firebase_auth.getRedirectResult()
                _this.firebase_auth.signInWithPopup(token.socialProvider)
                    .then(function (result) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    user.facebookAccessToken = token;
                    resolve(new FirebaseAuthToken(user));
                })
                    .catch(function (error) {
                    reject(new AuthenticationException(token, error.message, error));
                });
            }
        });
    };
    FirebaseAuthProvider.prototype.restore = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.user) {
                return resolve(new FirebaseAuthToken(_this.user));
            }
            var sub = _this.onAuthTokenChanged.subscribe(function (token) {
                sub.unsubscribe();
                clearTimeout(timeout);
                resolve(token);
            });
            var timeout = setTimeout(function () {
                sub.unsubscribe();
                reject(null);
            }, 5000);
        });
    };
    FirebaseAuthProvider.prototype.logout = function (token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.firebase_auth.signOut()
                .then(function () {
                delete this.user;
                resolve(new AnonymousUserToken());
            }).catch(function (error) {
                reject(token);
            });
        });
    };
    return FirebaseAuthProvider;
}());
var FirebaseAuthToken = (function () {
    function FirebaseAuthToken(data) {
        this.roles = [];
        this.user = data;
        // (<any>this.user).isAnonymous = false;
    }
    FirebaseAuthToken.prototype.getUser = function () {
        return this.user;
    };
    FirebaseAuthToken.prototype.getUsername = function () {
        return this.getUser().email;
    };
    FirebaseAuthToken.prototype.hasRole = function (name) {
        return this.roles.indexOf(name) !== -1;
    };
    FirebaseAuthToken.prototype.setUser = function (user) {
        this.user = user;
        return this;
    };
    FirebaseAuthToken.prototype.isAuthenticated = function () {
        return !!this.getUser();
    };
    return FirebaseAuthToken;
}());
var FirebaseAnonymusAuthToken = (function (_super) {
    __extends$9(FirebaseAnonymusAuthToken, _super);
    function FirebaseAnonymusAuthToken(data) {
        var _this = _super.call(this, data) || this;
        _this.roles = ['anonymous'];
        return _this;
    }
    FirebaseAnonymusAuthToken.prototype.isAuthenticated = function () {
        return true;
    };
    return FirebaseAnonymusAuthToken;
}(FirebaseAuthToken));
var FirebaseSocialAuthToken = (function (_super) {
    __extends$9(FirebaseSocialAuthToken, _super);
    function FirebaseSocialAuthToken(data, socialProvider) {
        var _this = _super.call(this, data) || this;
        _this.socialProvider = socialProvider;
        return _this;
    }
    FirebaseSocialAuthToken.prototype.isAuthenticated = function () {
        return true;
    };
    return FirebaseSocialAuthToken;
}(FirebaseAuthToken));

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [
//   ],
//   entryComponents:[
//   ],
//   exports: [
//     UserService,
//     CoreEventDispatcherService,
//     UserRestoreResolver
//   ],
//   providers: [
//     UserService,
//     CoreEventDispatcherService,
//     UserRestoreResolver
//   ]
// })
var CoreBundleModule = (function () {
    function CoreBundleModule() {
    }
    CoreBundleModule.forRoot = function () {
        return {
            ngModule: CoreBundleModule,
            providers: [
                UserService,
                CoreEventDispatcherService,
                UserRestoreResolver,
                //Guards
                UserAuthenticatedCanActivateRouterGuard,
                UserAuthenticatedCanActivateChildRouterGuard,
                UserRolesAllowedCanActivateRouterGuard,
                UserRolesAllowedCanActivateChildRouterGuard
            ]
        };
    };
    return CoreBundleModule;
}());
CoreBundleModule.decorators = [
    { type: _angular_core.NgModule },
];
/** @nocollapse */
CoreBundleModule.ctorParameters = function () { return []; };

var LoadingComponent = (function () {
    function LoadingComponent() {
        this._isLoading = false;
        this.loadingChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(LoadingComponent.prototype, "loading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            this._isLoading = value;
            this.loadingChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    LoadingComponent.prototype.show = function () {
        this.loading = true;
    };
    LoadingComponent.prototype.hide = function () {
        this.loading = false;
    };
    return LoadingComponent;
}());
LoadingComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'loading',
                styles: ["\n\n.loading-component {\n  position: absolute;\n  display: block;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.1);\n  z-index: 1000;\n}\n.loading-component .loading-spinner {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 50px;\n  height: 40px;\n  text-align: center;\n  font-size: 10px;\n}\n.loading-component .loading-spinner > div {\n  background-color: #007cbb;\n  height: 100%;\n  width: 6px;\n  display: inline-block;\n  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;\n  animation: sk-stretchdelay 1.2s infinite ease-in-out;\n}\n.loading-component .loading-spinner .rect2 {\n  -webkit-animation-delay: -1.1s;\n  animation-delay: -1.1s;\n}\n.loading-component .loading-spinner .rect3 {\n  -webkit-animation-delay: -1.0s;\n  animation-delay: -1.0s;\n}\n.loading-component .loading-spinner .rect4 {\n  -webkit-animation-delay: -0.9s;\n  animation-delay: -0.9s;\n}\n.loading-component .loading-spinner .rect5 {\n  -webkit-animation-delay: -0.8s;\n  animation-delay: -0.8s;\n}\n@-webkit-keyframes sk-stretchdelay {\n  0%, 40%, 100% {\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    -webkit-transform: scaleY(1);\n  }\n}\n@keyframes sk-stretchdelay {\n  0%, 40%, 100% {\n    transform: scaleY(0.4);\n    -webkit-transform: scaleY(0.4);\n  }\n  20% {\n    transform: scaleY(1);\n    -webkit-transform: scaleY(1);\n  }\n}\n\n"],
                template: "\n<div *ngIf=\"_isLoading\" class=\"loading-component\">\n  <div class=\"loading-spinner\">\n    <div class=\"rect1\"></div>\n    <div class=\"rect2\"></div>\n    <div class=\"rect3\"></div>\n    <div class=\"rect4\"></div>\n    <div class=\"rect5\"></div>\n  </div>\n</div>\n"
            },] },
];
/** @nocollapse */
LoadingComponent.ctorParameters = function () { return []; };
LoadingComponent.propDecorators = {
    'loading': [{ type: _angular_core.Input },],
    'loadingChange': [{ type: _angular_core.Output },],
};

var LoadingDirective = (function () {
    function LoadingDirective($element) {
        this.$element = $element;
        this.loadingChange = new _angular_core.EventEmitter();
    }
    Object.defineProperty(LoadingDirective.prototype, "loading", {
        get: function () {
            return this.$element.nativeElement.classList.contains(LoadingDirective.LOADING_CLASS_NAME);
        },
        set: function (value) {
            // this._isLoading = value;
            if (value) {
                this.$element.nativeElement.classList.add(LoadingDirective.LOADING_CLASS_NAME);
                // this.$element.nativeElement.classList.remove(LoadingDirective.NOT_LOADING_CLASS_NAME);
            }
            else {
                this.$element.nativeElement.classList.remove(LoadingDirective.LOADING_CLASS_NAME);
                // this.$element.nativeElement.classList.add(LoadingDirective.NOT_LOADING_CLASS_NAME);
            }
            this.loadingChange.emit(value);
        },
        enumerable: true,
        configurable: true
    });
    LoadingDirective.prototype.show = function () {
        this.loading = true;
    };
    LoadingDirective.prototype.hide = function () {
        this.loading = false;
    };
    return LoadingDirective;
}());
LoadingDirective.LOADING_CLASS_NAME = 'loading-in-progress';
LoadingDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[loading]'
            },] },
];
/** @nocollapse */
LoadingDirective.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
]; };
LoadingDirective.propDecorators = {
    'loading': [{ type: _angular_core.Input },],
    'loadingChange': [{ type: _angular_core.Output },],
};

/**
 * @class
 * Basic form type, probably custom forms should be extend it. Or it could be used as is in simple cases.
 */
var BasicFormType = (function () {
    function BasicFormType(TCreator, fields) {
        if (fields === void 0) { fields = []; }
        this.TCreator = TCreator;
        this.fields = fields;
        this.name = 'default';
    }
    Object.defineProperty(BasicFormType.prototype, "formGroup", {
        get: function () {
            return this._formGroup;
        },
        enumerable: true,
        configurable: true
    });
    BasicFormType.prototype.buildForm = function (data, options) {
        var controls = {};
        var validators = getValidatorDecoratorConfiguration(this.TCreator, this.name);
        var validatorsAsync = getValidatorAsyncDecoratorConfiguration(this.TCreator, this.name);
        var fields = _.uniq(Object.keys(data).concat(this.fields));
        _.forEach(fields, function (key) {
            controls[key] = new _angular_forms.FormControl(data[key], validators[key], validatorsAsync[key]);
        });
        this._formGroup = new _angular_forms.FormGroup(controls);
        return this._formGroup;
    };
    BasicFormType.prototype.getEntity = function (ignoreValidation, options) {
        if (ignoreValidation === void 0) { ignoreValidation = false; }
        if (!ignoreValidation && this._formGroup.invalid) {
            throw new Error('Form is not valid');
        }
        var tm = new TransformManager();
        var fromFormGroupTransformer = new ChainTransformer([
            new FunctionTransformer(function (form) {
                return form.getRawValue();
            }),
            new ToTypeTransformer(this.TCreator)
        ]);
        return tm.createData(this._formGroup, fromFormGroupTransformer, options);
    };
    return BasicFormType;
}());

var FormErrorMessagesDirective = (function () {
    function FormErrorMessagesDirective(formGroup) {
        this.formGroup = formGroup;
    }
    FormErrorMessagesDirective.prototype.ngOnInit = function () {
    };
    // getMessagesForControl(control:FormGroupDirective) {
    //   if (!this.formGroup) {
    //     throw new Error('Unable to find control. Should be used inside [formGroup] directive');
    //   }
    //
    //   const control_names = Object.keys(this.formGroup.form.controls);
    //   this.formGroup.formDirective.getFormGroup(control)
    //   for (let i = 0; i < control_names.length; i++) {
    //     if (this.formGroup.form.controls[control_names[i]] === control) {
    //       return this.messages[control_names[i]];
    //     }
    //   }
    //   throw new Error('Control didn\'t exist');
    //
    //   // const result = _.find(this.formGroup.form.controls, (c:AbstractControl)=>{
    //   //   return c === control;
    //   // });
    //
    // }
    FormErrorMessagesDirective.prototype.getMessagesByName = function (name) {
        return this.messages && name ? this.messages[name] : null;
    };
    return FormErrorMessagesDirective;
}());
FormErrorMessagesDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[formErrorMessages]'
            },] },
];
/** @nocollapse */
FormErrorMessagesDirective.ctorParameters = function () { return [
    { type: _angular_forms.FormGroupDirective, },
]; };
FormErrorMessagesDirective.propDecorators = {
    'messages': [{ type: _angular_core.Input, args: ['formErrorMessages',] },],
};

var FieldComponent = (function () {
    function FieldComponent(errorMessagesDirective) {
        this.errorMessagesDirective = errorMessagesDirective;
        this.maxErrorsCount = 1;
    }
    FieldComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(FieldComponent.prototype, "errorMessages", {
        /**
         * return list of the errors for current field. Initialised once per component creation (for now)
         * @return {any}
         */
        get: function () {
            if (this._errorMessages) {
                return this._errorMessages;
            }
            if (this.errorMessagesDirective) {
                return this.errorMessagesDirective.getMessagesByName(this.control.name || this.name);
            }
        },
        enumerable: true,
        configurable: true
    });
    return FieldComponent;
}());
FieldComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'field',
                template: "\n\n<div class=\"field-group\" [ngClass]=\"{'has-error': control && !control.valid && control.touched}\">\n  <label *ngIf=\"label\" class=\"control-label\" [for]=\"name\">{{label}}</label>\n  <div class=\"control-container\">\n    <div class=\"widget\">\n      <ng-content></ng-content>\n    </div>\n    <field-errors #fieldErrors [messages]=\"errorMessages\" [maxErrorsCount]=\"maxErrorsCount\" [control]=\"control\"></field-errors>\n  </div>\n</div>\n\n",
                styleUrls: []
            },] },
];
/** @nocollapse */
FieldComponent.ctorParameters = function () { return [
    { type: FormErrorMessagesDirective, },
]; };
FieldComponent.propDecorators = {
    'label': [{ type: _angular_core.Input },],
    'maxErrorsCount': [{ type: _angular_core.Input },],
    '_errorMessages': [{ type: _angular_core.Input, args: ['errorMessages',] },],
    'name': [{ type: _angular_core.Input },],
    'fieldErrors': [{ type: _angular_core.ViewChild, args: ['fieldErrors',] },],
    'control': [{ type: _angular_core.ContentChild, args: [_angular_forms.FormControlDirective,] },],
};

var DEFAULT_MESSAGES = {
    REQUIRED: 'Required',
    DEFAULT: 'Invalid field',
};

var FieldErrorsComponent = (function () {
    function FieldErrorsComponent(element, formGroup) {
        this.element = element;
        this.formGroup = formGroup;
    }
    FieldErrorsComponent.prototype.ngAfterViewInit = function () {
        var name = this.element.nativeElement.getAttribute('name');
        if (!this.control && name && this.formGroup) {
            this.control = this.formGroup.form.controls[name];
        }
        if (!this.control) {
            this.element.nativeElement.addStyles(['display: none']);
        }
    };
    Object.defineProperty(FieldErrorsComponent.prototype, "errors", {
        get: function () {
            if (this.maxErrorsCount && this.maxErrorsCount === 0) {
                return;
            }
            if (this.control && this.control.touched && this.control.errors) {
                var errors_keys = Object.keys(this.control.errors);
                var messages = [];
                var errors_count = this.maxErrorsCount || 5;
                for (var i = 0; i < errors_count; i++) {
                    if (!errors_keys[i]) {
                        break;
                    }
                    messages.unshift(this.getMessageFor(errors_keys[i]));
                }
                return messages;
            }
        },
        enumerable: true,
        configurable: true
    });
    FieldErrorsComponent.prototype.getMessageFor = function (errorName) {
        if (this.messages) {
            return (this.messages[errorName.toUpperCase()] || this.messages);
        }
        return (DEFAULT_MESSAGES[errorName.toUpperCase()] || DEFAULT_MESSAGES.DEFAULT);
    };
    return FieldErrorsComponent;
}());
FieldErrorsComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'field-errors',
                template: "\n\n<div *ngIf=\"errors\" class=\"errors-container\">\n  <ul>\n    <li *ngFor=\"let e of errors\" class=\"error\">{{e}}</li>\n  </ul>\n</div>\n\n",
                styles: ["\n.errors-container li {\n  list-style: none;\n}\n\n"]
            },] },
];
/** @nocollapse */
FieldErrorsComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_forms.FormGroupDirective, },
]; };
FieldErrorsComponent.propDecorators = {
    'control': [{ type: _angular_core.Input },],
    'maxErrorsCount': [{ type: _angular_core.Input },],
    'messages': [{ type: _angular_core.Input },],
};

var FormGroupErrorsComponent = (function () {
    function FormGroupErrorsComponent(element, errorMessagesDirective) {
        this.element = element;
        this.errorMessagesDirective = errorMessagesDirective;
    }
    Object.defineProperty(FormGroupErrorsComponent.prototype, "errors", {
        get: function () {
            if (!this.group) {
                return [];
            }
            var controls_names = Object.keys(this.group.controls);
            var messages = [];
            for (var i = 0; i < controls_names.length; i++) {
                var control = this.group.controls[controls_names[i]];
                if (control.touched && control.errors) {
                    var errors_keys = _.keys(control.errors);
                    messages.unshift(this.getMessageFor(controls_names[i], errors_keys[0]));
                }
            }
            return messages;
        },
        enumerable: true,
        configurable: true
    });
    FormGroupErrorsComponent.prototype.getMessageFor = function (name, errorName) {
        if (this.messages && this.messages[name]) {
            return this.messages[name][errorName.toUpperCase()] || this.messages[name];
        }
        if (this.errorMessagesDirective) {
            var msg = this.errorMessagesDirective.getMessagesByName(name);
            if (msg) {
                return msg[errorName.toUpperCase()] || msg;
            }
        }
        return inflection.humanize(name) + ': ' + (DEFAULT_MESSAGES[errorName.toUpperCase()] || DEFAULT_MESSAGES.DEFAULT);
    };
    return FormGroupErrorsComponent;
}());
FormGroupErrorsComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'form-group-errors',
                template: "\n    <div *ngIf=\"errors\" class=\"errors-container\">\n      <ul>\n        <li *ngFor=\"let e of errors\" class=\"error\">{{e}}</li>\n      </ul>\n    </div>\n",
                styles: ["\n\n.errors-container li {\n  list-style: none;\n}\n\n"]
            },] },
];
/** @nocollapse */
FormGroupErrorsComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: FormErrorMessagesDirective, },
]; };
FormGroupErrorsComponent.propDecorators = {
    'group': [{ type: _angular_core.Input },],
    'messages': [{ type: _angular_core.Input },],
};

// import {CoreBundleModule} from "../coreBundle/coreBundle.module";
var UIBundleModuleConfig = {
    imports: [
        _angular_common.CommonModule,
        _angular_platformBrowser.BrowserModule,
        _angular_forms.ReactiveFormsModule,
        _angular_forms.FormsModule,
    ],
    declarations: [
        FieldComponent,
        FormGroupErrorsComponent,
        FieldErrorsComponent,
        FormErrorMessagesDirective,
        LoadingDirective,
        LoadingComponent,
    ],
    entryComponents: [],
    exports: [
        FieldComponent,
        FieldErrorsComponent,
        FormGroupErrorsComponent,
        FormErrorMessagesDirective,
        LoadingDirective,
        LoadingComponent,
    ]
};
var UIBundleModule = (function () {
    function UIBundleModule() {
    }
    return UIBundleModule;
}());
UIBundleModule.decorators = [
    { type: _angular_core.NgModule, args: [UIBundleModuleConfig,] },
];
/** @nocollapse */
UIBundleModule.ctorParameters = function () { return []; };

/**
 * @license
 * Copyright Nikita Yaroshevich All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/nikita-yaroshevich/avl-core/blob/master/LICENSE
 */
/**
 * Created by Nikita Yaroshevich on 17/09/2016.
 */

exports.NotFoundException = NotFoundException;
exports.DuplicateEntityException = DuplicateEntityException;
exports.HttpException = HttpException;
exports.HttpNotFoundException = HttpNotFoundException;
exports.LogicException = LogicException;
exports.InvalidConfigurationException = InvalidConfigurationException;
exports.RuntimeException = RuntimeException;
exports.AuthenticationException = AuthenticationException;
exports.CRUDListResolver = CRUDListResolver;
exports.CRUDInteractor = CRUDInteractor;
exports.CRUDItemResolver = CRUDItemResolver;
exports.CRUDItemEditComponent = CRUDItemEditComponent;
exports.CRUDListComponent = CRUDListComponent;
exports.EMRequestOptions = EMRequestOptions;
exports.Criterion = Criterion;
exports.getEntityDecoratorConfiguration = getEntityDecoratorConfiguration;
exports.Entity = Entity;
exports.getRepositoryDecoratorConfiguration = getRepositoryDecoratorConfiguration;
exports.Repository = Repository;
exports.getEmDecoratorConfiguration = getEmDecoratorConfiguration;
exports.EM = EM;
exports.getValidatorDecoratorConfiguration = getValidatorDecoratorConfiguration;
exports.Validator = Validator;
exports.getValidatorAsyncDecoratorConfiguration = getValidatorAsyncDecoratorConfiguration;
exports.ValidatorAsync = ValidatorAsync;
exports.EntityManager = EntityManager;
exports.HttpEMRequestOptions = HttpEMRequestOptions;
exports.HttpEntityManager = HttpEntityManager;
exports.BaseRepository = BaseRepository;
exports.HttpRepository = HttpRepository;
exports.ParseBaseRepository = ParseBaseRepository;
exports.RESTBaseRepository = RESTBaseRepository;
exports.CriterionToUrlTransformer = CriterionToUrlTransformer;
exports.ParseCriterionToUrlTransformer = ParseCriterionToUrlTransformer;
exports.ParseQueryEncoder = ParseQueryEncoder;
exports.CORE_EVENT_DISPATCHER = CORE_EVENT_DISPATCHER;
exports.CoreEventDispatcherService = CoreEventDispatcherService;
exports.Event = Event;
exports.EventDispatcher = EventDispatcher;
exports.ChainTransformer = ChainTransformer;
exports.CollectionTransformer = CollectionTransformer;
exports.TransformerOptions = TransformerOptions;
exports.FunctionTransformer = FunctionTransformer;
exports.ItemTransformerAbstract = ItemTransformerAbstract;
exports.TransformManager = TransformManager;
exports.ToTypeTransformer = ToTypeTransformer;
exports.UserChangedEvent = UserChangedEvent;
exports.UserAuthEvent = UserAuthEvent;
exports.AnonymusUser = AnonymusUser;
exports.AnonymousUserToken = AnonymousUserToken;
exports.ManualAuthProvider = ManualAuthProvider;
exports.ManualUserToken = ManualUserToken;
exports.UserRestoreResolver = UserRestoreResolver;
exports.USER_SERVICE_AUTH_PROVIDERS = USER_SERVICE_AUTH_PROVIDERS;
exports.UserService = UserService;
exports.UserAuthenticatedCanActivateRouterGuard = UserAuthenticatedCanActivateRouterGuard;
exports.UserAuthenticatedCanActivateChildRouterGuard = UserAuthenticatedCanActivateChildRouterGuard;
exports.UserRolesAllowedCanActivateRouterGuard = UserRolesAllowedCanActivateRouterGuard;
exports.UserRolesAllowedCanActivateChildRouterGuard = UserRolesAllowedCanActivateChildRouterGuard;
exports.ParseAuthProvider = ParseAuthProvider;
exports.ParseAuthToken = ParseAuthToken;
exports.UsernamePasswordAuthProvider = UsernamePasswordAuthProvider;
exports.BasicUser = BasicUser;
exports.UsernamePasswordToken = UsernamePasswordToken;
exports.FirebaseAuthProvider = FirebaseAuthProvider;
exports.FirebaseAuthToken = FirebaseAuthToken;
exports.FirebaseAnonymusAuthToken = FirebaseAnonymusAuthToken;
exports.FirebaseSocialAuthToken = FirebaseSocialAuthToken;
exports.CoreBundleModule = CoreBundleModule;
exports.LoadingComponent = LoadingComponent;
exports.LoadingDirective = LoadingDirective;
exports.BasicFormType = BasicFormType;
exports.FieldComponent = FieldComponent;
exports.FieldErrorsComponent = FieldErrorsComponent;
exports.FormGroupErrorsComponent = FormGroupErrorsComponent;
exports.UIBundleModuleConfig = UIBundleModuleConfig;
exports.UIBundleModule = UIBundleModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
