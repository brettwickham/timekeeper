class DateService {
  constructor(months = false, am = false, pm = false, round = 0) {
    this.months = months || [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    this.am = am || " am";
    this.pm = pm || " pm";
    this.round = round;
  }

  formatTime(date = new Date()) {
    if (isNaN(date) || date === null) {
      return "";
    }
    date = new Date(date);
    let m = date.getMinutes();
    m = m < 10 ? "0" + m : m;
    let h = date.getHours();
    const s = (h < 12) ? this.am : this.pm;
    h = h > 12 ? (h - 12) : h;
    h = !h ? 12 : h;
    return h + ":" + m + s;
  }

  formatDate(date = new Date()) {
    if (isNaN(date)) {
      return "";
    }
    date = new Date(date);
    const d = date.getDate();
    const y = date.getFullYear();
    const m = this.months[date.getMonth()];
    return m + " " + d + ", " + y;
  }

  formatDateNumber(date = new Date()) {
    if (isNaN(date)) {
      return "";
    }
    date = new Date(date);
    let d = date.getDate();
    d = (d < 10) ? `0${d}` : d;
    const y = date.getFullYear();
    let m = (date.getMonth() + 1);
    m = (m < 10) ? `0${m}` : m;
    return `${y}-${m}-${d}`;
  }

  totalHours(date1, date2) {
    if (isNaN(date1) || isNaN(date2)) {
      return 0;
    }
    date1 = new Date(date1);
    date2 = new Date(date2);
    let total = (Math.abs(date1 - date2) / 36e5);
    total = this.round && (Math.ceil(total * this.round) / this.round) || total.toFixed(2);
    return Number(total);
  }
}

class DateController {
  constructor() {
    this.DateService = new DateService();
  }

  getTimestamp(date, time) {
    date = typeof(date) !== "undefined" ? date : this.date;
    time = typeof(time) !== "undefined" ? time : this.time;
    return new Date(date + " " + time).getTime();
  }

  displayDate(date) {
    date = typeof(date) !== "undefined" ? date : this.date;
    return date ? this.DateService.formatDate(date) : "";
  }

  displayTime(date) {
    date = typeof(date) !== "undefined" ? date : this.date;
    return date ? this.DateService.formatTime(date) : "";
  }

  displayTotal() {
    const date1 = this.displayDate(this.date1);
    const time1 = this.displayTime(this.date1);
    const date2 = this.displayDate(this.date2);
    const time2 = this.displayTime(this.date2);
    const timeIn = this.getTimestamp(date1, time1);
    const timeOut = this.getTimestamp(date2, time2);

    return this.DateService.totalHours(timeIn, timeOut);
  }
}

const displayDateDirective = () => {
  return {
    restrict: "A",
    scope: {},
    bindToController: {
      date: "=displayDate"
    },
    controller: DateController,
    controllerAs: "ctrl",
    template: "{{ctrl.displayDate()}}"
  };
};

const displayTotalDirective = () => {
  return {
    restrict: "A",
    scope: {},
    bindToController: {
      date1: "=",
      date2: "="
    },
    controller: DateController,
    controllerAs: "ctrl",
    template: "{{ctrl.displayTotal()}}"
  };
};

const displayTimeDirective = () => {
  return {
    restrict: "A",
    scope: {},
    bindToController: {
      date: "=displayTime"
    },
    controller: DateController,
    controllerAs: "ctrl",
    template: "{{ctrl.displayTime()}}"
  };
};

export {
  DateService,
  displayDateDirective,
  displayTotalDirective,
  displayTimeDirective
};
