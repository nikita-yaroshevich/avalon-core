export interface EventInterface {
  subject:any;
}
export class Event implements EventInterface{
  subject:any;
  constructor(data?:any){
    this.subject = data;
  }
}
