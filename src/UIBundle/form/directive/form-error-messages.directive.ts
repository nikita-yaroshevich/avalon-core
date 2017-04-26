import {Directive, OnInit, Input} from "@angular/core";
import {AbstractControl, FormGroupDirective} from "@angular/forms";
import * as _ from "lodash";


@Directive({
  selector: '[formErrorMessages]'
})
export class FormErrorMessagesDirective implements OnInit {
  @Input('formErrorMessages') messages:{[key:string]:{[key:string]:string}|string};


  constructor(private formGroup?:FormGroupDirective) {

  }

  ngOnInit():void {
  }

  // getMessagesForControl(control:FormGroupDirective) {
  //   if (!this.formGroup) {
  //     throw new Error('Unable to find control. Should be used inside [formGroup] directive');
  //   }
  //
  //   const control_names = Object.keys(this.formGroup.form.controls);
  //   this.formGroup.formDirective.getFormGroup(control)
  //   for (let i = 0; i < control_names.length; i++) {
  //     if (this.formGroup.form.controls[control_names[i]] === control) {
  //       return this.messages[control_names[i]];
  //     }
  //   }
  //   throw new Error('Control didn\'t exist');
  //
  //   // const result = _.find(this.formGroup.form.controls, (c:AbstractControl)=>{
  //   //   return c === control;
  //   // });
  //
  // }

  getMessagesByName(name:string|undefined):string|{[key:string]:string}|null {
    return this.messages && name ? this.messages[name] : null;
  }
}
