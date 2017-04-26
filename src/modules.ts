import {UserService} from "./coreBundle/user";
import {CoreEventDispatcherService} from "./coreBundle/event";
import {UserRestoreResolver} from "./coreBundle/user";

export const DECLARATIONS: any[] = [
  UserService,
  CoreEventDispatcherService,
  UserRestoreResolver
];
