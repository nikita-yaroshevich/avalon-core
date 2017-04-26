import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By}              from '@angular/platform-browser';
import {DebugElement, ElementRef, Component, ViewChild}    from '@angular/core';
import {fakeAsync, tick} from "@angular/core/testing/fake_async";
import {FieldErrorsComponent} from "./field-errors.component";
import {TestUtils} from "../../../../../TestUtils";
import {FormGroupDirective, Validators, FormControl, FormGroup} from "@angular/forms";
import {FieldComponent} from "./field.component";
import {FormGroupErrorsComponent} from "./form-group-errors.component";
import {FormErrorMessagesDirective} from "../directive/form-error-messages.directive";


@Component({
  template: `
<form [formGroup]="formGroup" [formErrorMessages]="messages">
  <form-group-errors [group]="formGroup"></form-group-errors>
  <field #fieldElement label="The Input1 label" name="input1">
    <input #inputElement type="text" [formControl]="formGroup.controls['input1']">
  </field>
</form>
`
})
class TestComponent {
  @ViewChild('fieldElement') fieldElement:FieldComponent;
  @ViewChild('inputElement') inputElement:ElementRef;

  formGroup:FormGroup;
  value = {
    input1: ''
  };
  messages = {
    input1: {
      REQUIRED: 'Custom Requried Msg'
    }
  };

  constructor() {
    this.formGroup = new FormGroup({
      input1: new FormControl(this.value.input1, Validators.required),
    });
  }

  getRawValue() {
    this.formGroup.getRawValue();
  }
}


describe('Forms Tests:', () => {

  let instance:TestComponent;
  let fixture:ComponentFixture<TestComponent>;
  let de:DebugElement;
  let el:HTMLElement;

  // async beforeEach
  beforeEach(async(() => {
    TestUtils.beforeEachCompiler(
      [
        TestComponent,
        FieldErrorsComponent,
        FieldComponent,
        FormGroupErrorsComponent,
        FormErrorMessagesDirective
      ],
      [FormGroupDirective])
      .then((res)=> {
        fixture = res.fixture;
        instance = res.instance;
        de = fixture.debugElement
        el = de.nativeElement;

        instance.formGroup.markAsDirty(true);
        instance.formGroup.markAsTouched(true);
      })
  }));


  it('should show errors by default', fakeAsync(() => {
    //inited
    expect(instance.formGroup.valid).toBeFalsy();

    instance.formGroup.controls['input1'].markAsTouched(false);

    // instance.formGroup.controls['input1'].setValue('test');
    tick();
    expect(instance.fieldElement.fieldErrors.errors.length).toBeGreaterThan(0);
  }));

  it('should hide errors when become valid', fakeAsync(() => {
    expect(instance.formGroup.valid).toBeFalsy();
    instance.formGroup.controls['input1'].markAsTouched(false);
    instance.formGroup.controls['input1'].setValue('test');
    tick();
    expect(instance.formGroup.valid).toBeTruthy();
    expect(instance.fieldElement.fieldErrors.errors).toBeFalsy();
  }));

  it('should show custom error', fakeAsync(() => {
    //inited
    expect(instance.formGroup.valid).toBeFalsy();

    instance.formGroup.controls['input1'].markAsTouched(false);

    // instance.formGroup.controls['input1'].setValue('test');
    // instance.messages = {};
    tick();
    expect(instance.fieldElement.fieldErrors.errors.length).toBeGreaterThan(0);
    expect(instance.fieldElement.fieldErrors.errors[0]).toEqual(instance.messages['input1'].REQUIRED);
  }));

});
