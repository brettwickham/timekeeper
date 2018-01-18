/* @ngInject; */
const routes = $routeProvider => {
  $routeProvider
    .when("/", {
      controller: "EntryListController",
      controllerAs: "ctrl",
      templateUrl: "/app/components/entry/entry-list.html"
    })
    .when("/date/:dateId", {
      controller: "EntryListController",
      controllerAs: "ctrl",
      templateUrl: "/app/components/entry/entry-list.html"
    })
    .when("/ticket/:ticketId", {
      controller: "EntryListController",
      controllerAs: "ctrl",
      templateUrl: "/app/components/entry/entry-list.html"
    })
    .when("/entry/:entryId", {
      controller: "EntrySingleController",
      controllerAs: "ctrl",
      templateUrl: "/app/components/entry/entry-single.html"
    });
};

export { routes };
