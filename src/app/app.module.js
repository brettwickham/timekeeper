import { templates } from "./app.templates";

import {
  EntryService,
  EntryListController,
  EntrySingleController
} from "./components/entry/entry";

import {
  sortToggleDirective,
  sortIndicatorDirective
} from "./shared/sort/sort";

import {
  DateService,
  displayDateDirective,
  displayTotalDirective,
  displayTimeDirective
} from "./shared/date";

import { LocalStorageService } from "./shared/local-storage";

import { routes } from "./app.routes";

angular.module("main", [
    "ngRoute"
  ])

  .service("DateService", DateService)
  .service("EntryService", EntryService)
  .service("LocalStorageService", LocalStorageService)

  .controller("EntryListController", EntryListController)
  .controller("EntrySingleController", EntrySingleController)

  .directive("displayDate", displayDateDirective)
  .directive("displayTotal", displayTotalDirective)
  .directive("displayTime", displayTimeDirective)
  .directive("sortIndicator", sortIndicatorDirective)
  .directive("sortToggle", sortToggleDirective);

angular.module("app", [
    "ngRoute",
    "main"
  ])

  .run(templates)
  .config(routes);
