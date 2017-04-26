import {CRUDInteractor} from "../CRUDInteractor";
import {Router, ActivatedRoute} from "@angular/router";

export class CRUDListComponent<T> {
  items:T[];
  constructor(protected interactor:CRUDInteractor<T>, protected route:ActivatedRoute, protected router:Router) {
    this.route.data
      .subscribe((data: { items: T[] }) => {
        this.items = data.items;
      });
  }

  deleteItem(item:T){
    this.interactor.removeItem(item)
      .then(()=>{
        this.interactor.findItems()
          .then((items)=>{
            this.items = items;
          });
      });
  }
}
