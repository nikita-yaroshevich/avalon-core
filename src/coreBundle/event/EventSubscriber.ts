export interface EventSubscriberInterface {
  subscribedEvents:{[name:string]:string|Function};
}
