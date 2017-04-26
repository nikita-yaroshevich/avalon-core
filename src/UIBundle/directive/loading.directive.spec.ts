import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import {DebugElement, ElementRef, Component, ViewChild}    from '@angular/core';
import {LoadingDirective} from "./loading.directive";
import {fakeAsync, tick} from "@angular/core/testing/fake_async";
import {TestUtils} from "../../../../TestUtils";

@Component({
  selector: 'my-test-component',
  template: '<div [loading]="true"></div>'
})
class TestComponent {
}


describe('LoadingDirective:', () => {

  let instance:    LoadingDirective;
  let de:      DebugElement;
  let el:      HTMLElement;

  // async beforeEach
  beforeEach(async(() => {
    TestUtils.beforeEachCompiler([ TestComponent, LoadingDirective ])
      .then((res)=>{
        de = res.fixture.debugElement.query(By.directive(LoadingDirective));
        el = de.nativeElement;
        instance = de.injector.get(LoadingDirective);
      })
  }));


  it('should display display and hide css class', fakeAsync(() => {
    instance.show();
    tick();
    expect(el.classList.contains(LoadingDirective.LOADING_CLASS_NAME)).toBeTruthy();

    instance.hide();
    tick();
    expect(el.classList.contains(LoadingDirective.LOADING_CLASS_NAME)).toBeFalsy();
  }));

});
