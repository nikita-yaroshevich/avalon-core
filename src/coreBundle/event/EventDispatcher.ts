import {EventSubscriberInterface} from "./EventSubscriber";
import {EventEmitter} from "@angular/core";
import {Event} from "./Event";
import {Subscription} from "rxjs/Rx";

export class EventDispatcher {
  private subscribers:{[name:string]:EventEmitter<any>} = {};

  dispatch(name:string, event:any) {
    if (!this.subscribers[name]) {
      return;
    }
    this.subscribers[name].emit(event);
  }

  addSubscriber(subscriber:EventSubscriberInterface):Subscription[] {
    let subscriptions:Subscription[] = [];
    Object.keys(subscriber.subscribedEvents).forEach((eventName:string)=> {
      let listener:any = subscriber.subscribedEvents[eventName];
      if (typeof listener === "string") {
        listener = (<any>subscriber)[listener] ? (...args:any[])=> {
          return (<any>(<any>subscriber)[<string>(subscriber.subscribedEvents[eventName])]).apply(subscriber, args);
        } : null;
      }
      if (!listener) {
        throw Error(`Unable to subscribe to ${eventName} because listener is not defined`);
      }
      subscriptions.push(this.addListener(eventName, <Function>listener));
    });
    return subscriptions;
  }

  addListener(eventName:string, listener:Function):Subscription {
    if (!listener || !(listener instanceof Function)) {
      throw Error(`Unable to subscribe to ${eventName} because provided event listener is not supported`);
    }
    this.subscribers[eventName] = this.subscribers[eventName] || new EventEmitter();
    return this.subscribers[eventName].subscribe(listener);
  }
}
