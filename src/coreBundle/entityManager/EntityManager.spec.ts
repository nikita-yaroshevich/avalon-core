import * as _ from "lodash";
import {EntityManager} from "./EntityManager";
import {EM, EntityManagerOptions, Entity, Repository} from "./common";
import {Injectable, Injector, Optional} from "@angular/core";
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpModule, Http, BaseRequestOptions, ResponseOptions, Response, Headers} from "@angular/http";
import {BaseRepository} from "./BaseRepository";
import {MockBackend, MockConnection} from "@angular/http/testing/mock_backend";
import {FunctionTransformer} from "../transformer/FunctionTransformer";
import {HttpEntityManager} from "./HttpEntityManager.service";

describe('EntityManager:', () => {
  const db = [
    {id:1, username: 'Jane', email: 'jane@doe.com'},
    {id:2, username: 'Jhone', email: 'jhon@doe.com'},
    {id:3, username: 'zeus', email: 'zeus@doe.com'}
  ];

  @Injectable()
  @EM({
    baseUrl: '//localhost:2222/api',
    headers: new Headers({'CustomEMHeader':321})
  })
  class SimpleEMTest extends HttpEntityManager {
    constructor(http:Http, _injector:Injector) {
      super(http, _injector);
    }
  }

  @Repository({
    endpoint: {
      url: '/user',
      headers: new Headers({'CustomRepositoryHeader':123}),
      responseTransformer: new FunctionTransformer((data, options)=>{
        return Object.assign(new EntityTest(), data);
      })
    },
  })
  class RepositoryTest extends BaseRepository<EntityTest> {

  }

  @Entity({
    repository: RepositoryTest,
    get: {
      headers: new Headers({'CustomEntityHeader':111})
    },
    delete: '/user/delete/{{username}}'
  })
  class EntityTest {
    id:string;
    username: string;
    email:string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SimpleEMTest,
        Injector,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });



  it('should exist', inject([SimpleEMTest],(service) => {
    expect(service).toBeDefined();
  }));

  it('should get repository by entity', inject([SimpleEMTest],(service:SimpleEMTest) => {
    const repo = service.getRepository(EntityTest);
    expect(repo).toBeDefined();
    expect(repo).toEqual(service.getRepository(EntityTest));
  }));

  it('should get repository by Repository Class', inject([SimpleEMTest],(service:SimpleEMTest) => {
    const repo = service.getRepository(RepositoryTest);
    expect(repo).toBeDefined();
    expect(repo).toEqual(service.getRepository(RepositoryTest));
  }));

  it('should get repository and receive data', async(inject([SimpleEMTest, MockBackend],(service:SimpleEMTest, mockBackend) => {
    const repo = service.getRepository(EntityTest);
    mockBackend.connections.subscribe((conn) => {
      return conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(db) })));
    });

    return repo.getAll()
      .then((data)=>{
        expect(data).toBeDefined();
      })
  })));


  it('should get repository and delete item. check url and headers', async(inject([SimpleEMTest, MockBackend],(service:SimpleEMTest, mockBackend) => {
    const repo = service.getRepository(EntityTest);
    mockBackend.connections.subscribe((conn) => {
      return conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(db) })));
    });

    return repo.delete({username: 'Jane', email: 'jane@doe.com'})
      .then((data)=>{
        expect(data).toBeDefined();
      })
  })));


  it('should response with headers from Repository and EM', async(inject([SimpleEMTest, MockBackend],(service:SimpleEMTest, mockBackend) => {
    const repo = service.getRepository(RepositoryTest);
    mockBackend.connections.subscribe((conn:MockConnection) => {
      expect(conn.request.headers.has('CustomEMHeader')).toBeTruthy();
      expect(conn.request.headers.has('CustomRepositoryHeader')).toBeTruthy();
      return conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(db) })));
    });

    return repo.getAll()
      .then((data)=>{
        expect(data).toBeDefined();
      })
  })));

  it('should response with headers from Repository, EM and Entity', async(inject([SimpleEMTest, MockBackend],(service:SimpleEMTest, mockBackend) => {
    const repo = service.getRepository(EntityTest);
    mockBackend.connections.subscribe((conn:MockConnection) => {
      expect(conn.request.headers.has('CustomEMHeader')).toBeTruthy();
      expect(conn.request.headers.has('CustomRepositoryHeader')).toBeTruthy();
      expect(conn.request.headers.has('CustomEntityHeader')).toBeTruthy();
      return conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(db) })));
    });

    return repo.getAll()
      .then((data)=>{
        expect(data).toBeDefined();
      })
  })));
});
