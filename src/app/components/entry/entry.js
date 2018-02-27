class EntryService {
  /* @ngInject; */
  constructor(LocalStorageService) {
    this.LocalStorageService = LocalStorageService;
  }

  get(index = false) {
    let entries = this.LocalStorageService.get("entry") || [];
    return index !== false ? entries[index] : entries;
  }

  set(entry, index = false) {
    let entries = this.get();

    if (index !== false) {
      entries[index] = entry;
    }
    else {
      entries.push(entry);
    }
    // Save
    this.LocalStorageService.set("entry", entries);
  }

  delete(index) {
    let entries = this.get();
    entries.splice(index, 1);
    // Save deletion
    this.LocalStorageService.set("entry", entries);
  }
}

class EntryListController {
  /* @ngInject; */
  constructor($routeParams, DateService, EntryService) {
    this.$routeParams = $routeParams;
    this.DateService = DateService;
    this.EntryService = EntryService;
    this.entries = this.EntryService.get();
    this.model = this.entries;
    this.entry = {};
    this.sortBy = "-timeIn";
    const dateId = $routeParams.dateId;
    const ticketId = $routeParams.ticketId;
    let entries = this.entries;

    if (dateId) {
      this.entries = [];
      angular.forEach(entries, (entry) => {
        if (this.DateService.formatDateNumber(entry.timeIn) === dateId) {
          this.entries.push(entry);
        }
      });
    }

    if (ticketId) {
      this.entries = [];
      angular.forEach(entries, (entry) => {
        if (entry.ticket === ticketId) {
          this.entries.push(entry);
        }
      });
    }
  }

  start() {
    let entry = this.entry;
    entry.timeIn = Date.now();
    entry.active = true;
    // Save entry
    this.EntryService.set(entry);
    // Update view
    this.entries.push(this.entry);
    // Reset entry
    this.entry = {};
  }

  stop(entry) {
    const index = this.getIndex(entry);
    entry.timeOut = Date.now();
    // Save entry
    this.EntryService.set(entry, index);
  }

  close(entry) {
    const index = this.getIndex(entry);
    entry.active = false;
    // Save entry
    this.EntryService.set(entry, index);
  }

  sort(sortBy) {
    this.sortBy = this.sortBy === sortBy ? "-" + sortBy : sortBy;
  }

  getIndex(entry) {
    return this.model.indexOf(entry);
  }

  totalAll() {
    let total = 0;
    angular.forEach(this.entries, (entry) => {
      total += this.DateService.totalHours(entry.timeIn, entry.timeOut);
    });
    return total.toFixed(2);
  }
}

class EntrySingleController {
  /* @ngInject; */
  constructor($location, $routeParams, DateService, EntryService) {
    this.$location = $location;
    this.$routeParams = $routeParams;
    this.DateService = DateService;
    this.EntryService = EntryService;
    this.entries = EntryService.get();
    this.model = this.entries;
    this.entry = this.entries[$routeParams.entryId];
    let entry = this.entry;
    let timeIn = entry.timeIn;
    let timeOut = entry.timeOut;
    this.display = {
      dateIn: timeIn && DateService.formatDate(timeIn) || "",
      timeIn: timeIn && DateService.formatTime(entry.timeIn) || "",
      dateOut: timeOut && DateService.formatDate(entry.timeOut) || "",
      timeOut: timeOut && DateService.formatTime(entry.timeOut) || ""
    };
  }

  getTimestamp(date, time) {
    return new Date(date + " " + time).getTime();
  }

  total() {
    const timeIn = this.getTimestamp(this.display.dateIn, this.display.timeIn);
    const timeOut = this.getTimestamp(this.display.dateOut, this.display.timeOut);
    return this.DateService.totalHours(timeIn, timeOut);
  }

  update() {
    const display = this.display;
    const dateOut = display.dateOut || this.DateService.formatDate();
    const timeOut = display.timeOut || this.DateService.formatTime();
    this.entry.timeIn = this.getTimestamp(display.dateIn, display.timeIn);
    this.entry.timeOut = this.getTimestamp(dateOut, timeOut);

    // Save entry
    this.EntryService.set(this.entry, this.$routeParams.entryId);
    // Redirect to home view
    this.$location.path("/");
  }

  getIndex(entry) {
    return this.model.indexOf(entry);
  }

  delete() {
    const index = this.getIndex(this.entry);
    // Save deletion
    this.EntryService.delete(index);
    // Refresh entries
    this.entries = this.EntryService.get();
    this.model = this.entries;
    // Redirect to home view
    this.$location.path("/");
  }

}

export {
  EntryService,
  EntryListController,
  EntrySingleController
};
