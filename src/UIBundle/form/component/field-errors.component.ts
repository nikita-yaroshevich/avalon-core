import {Component, ElementRef, ContentChild, OnInit, AfterViewChecked, AfterViewInit, Input} from "@angular/core";
import {NgForm, FormGroupDirective, FormControl, AbstractControl} from "@angular/forms";
import * as _ from "lodash";
import {DEFAULT_MESSAGES} from "./field-errors.component.config";

@Component({
  selector: 'field-errors',
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
export class FieldErrorsComponent implements AfterViewInit {

  @Input() control?:AbstractControl;
  @Input() maxErrorsCount?:number;
  @Input() messages?:{[key:string]:string}|string|any;


  constructor(private element:ElementRef, private formGroup?:FormGroupDirective) {
  }

  ngAfterViewInit():void {

    let name:string = this.element.nativeElement.getAttribute('name');
    if (!this.control && name && this.formGroup) {
      this.control = this.formGroup.form.controls[name];
    }
    if (!this.control) {
      this.element.nativeElement.addStyles(['display: none']);
    }
  }

  get errors():string[] {
    if (this.maxErrorsCount && this.maxErrorsCount === 0) {
      return [];
    }
    if (this.control && this.control.touched && this.control.errors) {
      let errors_keys:string[] = Object.keys(this.control.errors);
      let messages = [];
      let errors_count = this.maxErrorsCount || 5;
      for (let i = 0; i < errors_count; i++) {
        if (!errors_keys[i]) {
          break;
        }
        messages.unshift(this.getMessageFor(errors_keys[i]));
      }
      return messages;
    }
    return [];
  }

  getMessageFor(errorName:string): string {
    if (this.messages) {
      return (this.messages[errorName.toUpperCase()] || this.messages);
    }
    return (DEFAULT_MESSAGES[errorName.toUpperCase()] || DEFAULT_MESSAGES.DEFAULT);
  }
}
