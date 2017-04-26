import {Injectable, Optional, EventEmitter, OpaqueToken, Injector} from "@angular/core";
import * as _ from "lodash";
import {UserInterface, UserTokenInterface, AuthProviderInterface, UserChangedEvent, UserAuthEvent} from "./common";
import {AnonymousUserToken} from "./AnonymousUserToken";
import {LogicException} from "../exceptions/exceptions";
import {EventDispatcher} from "../event/EventDispatcher";
import {CoreEventDispatcherService} from "../event/CoreEventDispatcher.service";

export const USER_SERVICE_AUTH_PROVIDERS: OpaqueToken = new OpaqueToken('USER_SERVICE_AUTH_PROVIDERS');

@Injectable()
export class UserService {
  private userToken:UserTokenInterface;
  private eventDispatcher:EventDispatcher|null;
  static EVENTS = {
    'ON_USER_CHANGED': 'ON_USER_CHANGED',
    'ON_AUTH_REQUIRED': 'ON_AUTH_REQUIRED'
  };
  onUserChanged:EventEmitter<UserChangedEvent> = new EventEmitter<UserChangedEvent>();
  onAuthRequired:EventEmitter<UserAuthEvent> = new EventEmitter<UserAuthEvent>();

  constructor(private injector:Injector) {
    this.userToken = new AnonymousUserToken();
    this.eventDispatcher = injector.get(CoreEventDispatcherService, null);
  }

  getUserToken():UserTokenInterface {
    return this.userToken;
  }

  getProviders():AuthProviderInterface[]{
    return this.injector.get(USER_SERVICE_AUTH_PROVIDERS, []);
  }

  getUser():UserInterface {
    return this.getUserToken().getUser();
  }

  /**
   *
   * @param token
   * @return {Promise<UserTokenInterface>}
   * @throw LogicException
   */
  authenticate(token:UserTokenInterface):Promise<UserTokenInterface> {
    const provider:AuthProviderInterface|undefined = this.getProviders().find((p:AuthProviderInterface)=> {
      return p.supports(token);
    });
    if (!provider) {
      throw new LogicException('Token not supported');
    }
    return provider.authenticate(token)
      .then((token:UserTokenInterface)=> {
        return this.setToken(token);
      });
  }

  setToken(token:UserTokenInterface):UserTokenInterface {
    let oldToken = this.getUserToken();
    this.userToken = token;
    let event = new UserChangedEvent(oldToken, this.getUserToken());
    this.onUserChanged.emit(event);
    if (this.eventDispatcher){
      this.eventDispatcher.dispatch(UserService.EVENTS.ON_USER_CHANGED, event);
    }
    return this.userToken;
  }

  logout() {
    return Promise.all(this.getProviders().map((provider:AuthProviderInterface)=>{
      return provider.logout();
    })).then((results:any[])=>{
      let token = results.pop();
      return this.setToken(new AnonymousUserToken());
    },()=>{
      return this.setToken(new AnonymousUserToken());
    });
  }
}
