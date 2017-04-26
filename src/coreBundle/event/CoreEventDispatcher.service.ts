import {EventDispatcher} from "./EventDispatcher";
import {Injectable, Injector, OpaqueToken} from "@angular/core";

export const CORE_EVENT_DISPATCHER: OpaqueToken = new OpaqueToken('CORE_EVENT_DISPATCHER');

@Injectable()
export class CoreEventDispatcherService extends EventDispatcher{
  constructor(){
    super();
  }
}
