class SortController {
  constructor() {
    //
  }

  toggle(key) {
    this.active = this.active == key ? "-" + key : key;
  }

  isActive(key) {
    return (this.active.indexOf(key) > -1);
  }

  isAsc(key) {
    return this.active == key;
  }

  isDesc(key) {
    return this.active == "-" + key;
  }
}

const sortIndicatorDirective = () => {
  return {
    restrict: "A",
    scope: {},
    bindToController: {
      active: "=",
      key: "="
    },
    controller: SortController,
    controllerAs: "ctrl",
    templateUrl: "/app/shared/sort/sort-indicator.html"
  };
};

const sortToggleDirective = () => {
  return {
    restrict: "A",
    scope: {},
    bindToController: {
      active: "=",
      key: "="
    },
    transclude: true,
    replace: true,
    controller: SortController,
    controllerAs: "ctrl",
    templateUrl: "/app/shared/sort/sort-toggle.html",
  };
};

export {
  sortIndicatorDirective,
  sortToggleDirective
};
