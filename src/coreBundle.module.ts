import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "./coreBundle/user/UserService.service";
import {CoreEventDispatcherService} from "./coreBundle/event/CoreEventDispatcher.service";
import {UserRestoreResolver} from "./coreBundle/user/UserRestoreResolver";

// @NgModule({
//   imports: [
//     CommonModule
//   ],
//   declarations: [
//   ],
//   entryComponents:[
//   ],
//   exports: [
//     UserService,
//     CoreEventDispatcherService,
//     UserRestoreResolver
//   ],
//   providers: [
//     UserService,
//     CoreEventDispatcherService,
//     UserRestoreResolver
//   ]
// })


@NgModule()
export class CoreBundleModule {
  static forRoot(): ModuleWithProviders {
     return {
        ngModule: CoreBundleModule,
        providers: [
          UserService,
          CoreEventDispatcherService,
          UserRestoreResolver
        ]
     };
  }
}
