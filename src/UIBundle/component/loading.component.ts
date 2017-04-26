import {Input, Output, EventEmitter, ElementRef, Component} from "@angular/core";

@Component({
  selector: 'loading',
  styles: [`

.loading-component {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.loading-component .loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}
.loading-component .loading-spinner > div {
  background-color: #007cbb;
  height: 100%;
  width: 6px;
  display: inline-block;
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.loading-component .loading-spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.loading-component .loading-spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
.loading-component .loading-spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.loading-component .loading-spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% {
    -webkit-transform: scaleY(0.4);
  }
  20% {
    -webkit-transform: scaleY(1);
  }
}
@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
    -webkit-transform: scaleY(1);
  }
}

`],
  template: `
<div *ngIf="_isLoading" class="loading-component">
  <div class="loading-spinner">
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
  </div>
</div>
`
})
export class LoadingComponent {
  private loadingElement:ElementRef;

  constructor() {
  }

  _isLoading:boolean = false;

  @Input()
  get loading():boolean {
    return this._isLoading;
  }

  @Output() loadingChange = new EventEmitter();

  set loading(value:boolean) {
    this._isLoading = value;
    this.loadingChange.emit(value);
  }


  show() {
    this.loading = true;
  }

  hide() {
    this.loading = false;
  }

}
