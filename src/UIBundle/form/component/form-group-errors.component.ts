import {Component, ElementRef, Input} from "@angular/core";
import {FormGroupDirective, FormGroup, AbstractControl} from "@angular/forms";

import * as _ from "lodash";
import * as inflection from "inflection";
import {DEFAULT_MESSAGES} from "./field-errors.component.config";
import {FormErrorMessagesDirective} from "../directive/form-error-messages.directive";


@Component({
  selector: 'form-group-errors',
  template: `
    <div *ngIf="errors" class="errors-container">
      <ul>
        <li *ngFor="let e of errors" class="error">{{e}}</li>
      </ul>
    </div>
`,
  styles: [`

.errors-container li {
  list-style: none;
}

`]
})
export class FormGroupErrorsComponent {
  @Input() group?:FormGroup;
  @Input() messages?:{[key:string]:({[key:string]:string}|string)}|any;

  constructor(private element:ElementRef, private errorMessagesDirective?: FormErrorMessagesDirective){

  }

  get errors() {
    if (!this.group){
      return [];
    }
    const controls_names:string[] = Object.keys(this.group.controls);
    let messages = [];
    for (let i = 0; i < controls_names.length; i++){
      const control:AbstractControl = this.group.controls[controls_names[i]];
      if (control.touched && control.errors) {
        let errors_keys = _.keys(control.errors);
        messages.unshift(this.getMessageFor(controls_names[i], errors_keys[0]));
      }
    }
    return messages;
  }

  getMessageFor(name:string, errorName:string ): string{
    if (this.messages && this.messages[name]) {
      return this.messages[name][errorName.toUpperCase()] || this.messages[name];
    }
    if (this.errorMessagesDirective){
      const msg:any = this.errorMessagesDirective.getMessagesByName(name);
      if (msg){
        return msg[errorName.toUpperCase()] || msg;
      }
    }
    return  inflection.humanize(name) +': '+ (DEFAULT_MESSAGES[errorName.toUpperCase()] || DEFAULT_MESSAGES.DEFAULT);
  }
}
