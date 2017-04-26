import {Directive, Input, Output, EventEmitter, ElementRef} from "@angular/core";

@Directive({
  selector: '[loading]'
})
export class LoadingDirective {
  public static LOADING_CLASS_NAME = 'loading-in-progress';
  // public static NOT_LOADING_CLASS_NAME = 'loading-hidden';
  // private _isLoading:boolean = false;
  private loadingElement:ElementRef;

  constructor(private $element:ElementRef) {
  }

  @Input()
  get loading():boolean {
    return this.$element.nativeElement.classList.contains(LoadingDirective.LOADING_CLASS_NAME);
  }

  @Output() loadingChange = new EventEmitter();

  set loading(value:boolean) {
    // this._isLoading = value;
    if (value) {
      this.$element.nativeElement.classList.add(LoadingDirective.LOADING_CLASS_NAME);
      // this.$element.nativeElement.classList.remove(LoadingDirective.NOT_LOADING_CLASS_NAME);
    } else {
      this.$element.nativeElement.classList.remove(LoadingDirective.LOADING_CLASS_NAME);
      // this.$element.nativeElement.classList.add(LoadingDirective.NOT_LOADING_CLASS_NAME);

    }
    this.loadingChange.emit(value);
  }


  show() {
    this.loading = true;
  }

  hide() {
    this.loading = false;
  }

}
