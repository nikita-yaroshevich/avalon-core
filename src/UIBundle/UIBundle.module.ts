import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
// import {CoreBundleModule} from "../coreBundle/coreBundle.module";
import {FieldErrorsComponent} from "./form/component/field-errors.component";
import {FieldComponent} from "./form/component/field.component";
import {FormGroupErrorsComponent} from "./form/component/form-group-errors.component";
import {FormErrorMessagesDirective} from "./form/directive/form-error-messages.directive";
import {LoadingDirective} from "./directive/loading.directive";
import {BrowserModule} from "@angular/platform-browser";
import {LoadingComponent} from "./component/loading.component";

export var UIBundleModuleConfig = {
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    FieldComponent,
    FormGroupErrorsComponent,
    FieldErrorsComponent,
    FormErrorMessagesDirective,
    LoadingDirective,
    LoadingComponent,
  ],
  entryComponents: [
    // PacsMessagesComponent
    // SelectboxComponent
  ],
  exports: [
    FieldComponent,
    FieldErrorsComponent,
    FormGroupErrorsComponent,
    FormErrorMessagesDirective,
    LoadingDirective,
    LoadingComponent,
  ]
};

@NgModule(UIBundleModuleConfig)
export class UIBundleModule {
}
