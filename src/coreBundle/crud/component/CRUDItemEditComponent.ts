import {OnInit, ViewChild} from "@angular/core";
import {BasicFormType, FormTypeInterface} from "../../../UIBundle/form/BasicFormType";
import {CRUDInteractor} from "../CRUDInteractor";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingComponent} from "../../../UIBundle/component/loading.component";
import { Location } from '@angular/common';
import {HttpException} from "../../exceptions/exceptions";

export abstract class CRUDItemEditComponent<T> implements OnInit {
  item:T;
  form:FormTypeInterface;
  @ViewChild('loading') loading: LoadingComponent;

  constructor(protected interactor:CRUDInteractor<T>, protected route:ActivatedRoute, protected router:Router, protected location: Location) {
  }

  abstract getFormType():FormTypeInterface;

  ngOnInit() {
    this.route.data
      .subscribe((data: { item: T }) => {
        this.item = data.item;
        this.reset();
      });
  }

  save(form: BasicFormType<T>): Promise<any>{
    let entity;
    try{
      entity = form.getEntity();
      this.loading.show();
      return this.interactor.saveItem(entity)
        .then((i)=>{
          this.item = i;
          this.reset();
          this.loading.hide();
          // this.location.back();
        }).catch((e:HttpException)=>{
        this.loading.hide();
      });
    } catch(e){
      this.loading.hide();
      this.interactor.events.emit({
        type: 'alert-error',
        message: e.toString()
      });
      return Promise.reject(e);
    }
  }

  delete(item:T){
    this.interactor.removeItem(item)
      .then(()=>{
        this.location.back();
      });
  }

  reset(){
    this.form = this.getFormType();
    this.form.buildForm(this.item);
  }

}
