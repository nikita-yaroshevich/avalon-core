import {Component, Input, ContentChild, OnInit, ViewChild} from "@angular/core";
import {FormControlDirective} from "@angular/forms";
import {FormErrorMessagesDirective} from "../directive/form-error-messages.directive";
import {FieldErrorsComponent} from "./field-errors.component";

@Component({
  selector: 'field',
  template: `

<div class="field-group" [ngClass]="{'has-error': control && !control.valid && control.touched}">
  <label *ngIf="label" class="control-label" [for]="name">{{label}}</label>
  <div class="control-container">
    <div class="widget">
      <ng-content></ng-content>
    </div>
    <field-errors #fieldErrors [messages]="errorMessages" [maxErrorsCount]="maxErrorsCount" [control]="control"></field-errors>
  </div>
</div>

`,
  styleUrls: []
})
export class FieldComponent implements OnInit {
  @Input() label?:string;
  @Input() maxErrorsCount?:number = 1;
  @Input('errorMessages') _errorMessages?:{[key:string]:string}|string;
  @Input() name?:string;

  @ViewChild('fieldErrors') fieldErrors:FieldErrorsComponent;
  @ContentChild(FormControlDirective) control:FormControlDirective;

  constructor(public errorMessagesDirective?:FormErrorMessagesDirective) {

  }

  ngOnInit():void {

  }

  /**
   * return list of the errors for current field. Initialised once per component creation (for now)
   * @return {any}
   */
  get errorMessages() {
    if (this._errorMessages) {
      return this._errorMessages;
    }
    if (this.errorMessagesDirective) {
      return this.errorMessagesDirective.getMessagesByName(this.control.name || this.name);
    }
  }
}
