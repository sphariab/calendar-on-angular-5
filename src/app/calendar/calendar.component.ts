import { Component } from '@angular/core';
import { EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AvailabilityService } from '../services/availability.service';
import {  animate, style, transition, trigger } from '@angular/animations';

export interface ICalendarDate {
    mDate: moment.Moment;
    selected?: boolean;
    availability: number;
    startBorder?: boolean;
    endBorder?: boolean;
    startEndBorder?: boolean;
    leftMargin?: boolean;
    rightMargin?: boolean;
}

export interface IAvailability {
    availability: number;
    date: string;
    startBorder: boolean;
    endBorder: boolean;
    leftMargin: boolean;
    rightMargin: boolean;
}

@Component({
    selector: 'app-calendar',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.scss'],
    animations: [
        trigger(
            'enterAnimation', [
                transition(':enter', [
                    style({ opacity: 0}),
                    animate('2000ms', style({transform: 'translateX(0)', opacity: 1, color: '#39DFA3'}))
                ]),
                transition(':leave', [
                    style({ opacity: 1}),
                    animate('2000ms', style({transform: 'translateX(100%)', opacity: 0, color: '#FFFFFF'}))
                ])
            ]
        )
    ],
})

export class CalendarComponent implements OnInit {
    public currentDate: any = moment();
    public nextMonthDate: any = moment().add(1, 'months');
    public dayNames: [string] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sr'];
    public weeks: ICalendarDate[][] = [];
    public nextMonthWeeks: ICalendarDate[][] = [];
    private availabilities: IAvailability[] = [];
    private chosenDates: any[] = [];
    private daysRange: ICalendarDate[] = [];
    private firstMonthNumber: number;
    private lastMonthNumber: number;
    private targetDayMouseDown: number;
    private targetDayMouseUp: number;
    public showMessage: boolean = false;
    public showErrorMessage: boolean = false;
    private watchMouseDown: boolean = true;
    private watchMouseUp: boolean = false;
    public dateStartAv: number;
    public  yearNumber: string;

    @Input() selectedDates: ICalendarDate[] = [];
    @Output() onSelectDate:any = new EventEmitter<ICalendarDate>();

    public constructor(private availabilityService: AvailabilityService) {}

    public ngOnInit(): void {
        this.firstMonthNumber = this.currentDate.month() + 1;
        this.lastMonthNumber = this.nextMonthDate.month() + 1;
        if (this.firstMonthNumber === 12) {
            this.currentDate = moment().subtract(1, 'months');
            this.nextMonthDate = moment();
            this.firstMonthNumber = this.currentDate.month() + 1;
            this.lastMonthNumber = this.nextMonthDate.month() + 1;
        }
        this.yearNumber = this.currentDate.format('YYYY');
        this.getAvailabilities(this.firstMonthNumber, this.lastMonthNumber, this.yearNumber);
    }

    public getAvailabilities(firstMonth: number, lastMonth: number, year: string): void  {
        this.availabilityService.getAvailabilities(firstMonth, lastMonth, year)
            .subscribe(
                res => {
                    this.availabilities = res.results;
                    this.generateCalendar();
                    this.chosenDates = [];
                },
            );
    }

    private setAvailability (date: moment.Moment): number {
        let availability: number = 2;
        this.availabilities.forEach(function (item: IAvailability) {
            if (item.date === moment(date).format('YYYY-MM-DD')) {
                availability = item.availability;
            }
            if (availability === undefined) {
                availability = 2;
            }
        });
        return  availability;
    }

    private setBorders(week) {
      for (let i: number = 0; i < week.length; i++) {
        const currentAvailability: number = week[i]['availability'];
        let nextAvailability: number;
        let prevAvailability: number;
        if (week[i - 1]) {
          prevAvailability = week[i - 1]['availability'];
        } else {
          prevAvailability = null;
        }
        if (week[i + 1]) {
          nextAvailability = week[i + 1]['availability'];
        } else {
          nextAvailability = null;
        }
        if (currentAvailability === prevAvailability && currentAvailability !== nextAvailability) {
          week[i]['startBorder'] = false;
          week[i]['endBorder'] = true;
          week[i]['leftMargin'] = false;
          week[i]['rightMargin'] = true;
        }
        if (currentAvailability === prevAvailability && currentAvailability === nextAvailability) {
          week[i]['startBorder'] = false;
          week[i]['endBorder'] = false;
          week[i]['leftMargin'] = false;
          week[i]['rightMargin'] = false;
        }
        if (currentAvailability !== prevAvailability && currentAvailability !== nextAvailability) {

          week[i]['startBorder'] = true;
          week[i]['endBorder'] = true;
          week[i]['leftMargin'] = true;
          week[i]['rightMargin'] = true;
        }
        if (currentAvailability !== prevAvailability && currentAvailability === nextAvailability) {
          week[i]['startBorder'] = true;
          week[i]['endBorder'] = false;
          week[i]['leftMargin'] = false;
          week[i]['rightMargin'] = false;
        }
      }
    }
    public sendAvailability (): void{
      this.availabilityService.sendAvailabilities(this.chosenDates)
        .subscribe(
          res => {
            this.getAvailabilities(this.firstMonthNumber, this.lastMonthNumber, this.yearNumber);
            if (!this.chosenDates.length || res.status && res.status !== 200) {
              this.showErrorMessage = true;
              setTimeout(function (): void {
                this.showErrorMessage = false;
              }.bind(this), 5000);
            } else {
              this.showMessage = true;
              setTimeout(function (): void {
                this.showMessage = false;
              }.bind(this), 5000);
            }
          }
        );
    }

    public sendAvailable(): void {
        if (this.chosenDates.length && this.chosenDates[0].availability === 2) {
            this.sendAvailability();
        }
    }
    public sendUnavailable(): void {
        if (this.chosenDates.length && this.chosenDates[0].availability === 3) {
            this.sendAvailability();
        }
    }

  private isSelectedCurrentMonth(date: moment.Moment): boolean {
      return moment(date).isSame(this.currentDate, 'month');
  }

  private isSelectedNextMonth(date: moment.Moment): boolean {
      return moment(date).isSame(this.nextMonthDate, 'month');
  }

  private onMouseDown(day: ICalendarDate): void {
      this.selectDate(day);
      this.targetDayMouseDown = moment(day).date();
      this.toggleWatchers();
      this.dateStartAv = day.availability;
  }

  private onMouseUpDay(day: ICalendarDate): void {
      this.targetDayMouseUp = moment(day).date();

      if (this.targetDayMouseUp === this.targetDayMouseDown) {
          this.selectDate(day);
      }

      if (!this.watchMouseDown && this.watchMouseUp) {
          this.toggleWatchers();
          this.selectDate(day);
          this.selectRange(day);
      }
  }

  public getDateRange(weeks, month, startDate, endDate): void{
      let currentMonth: ICalendarDate[] = [];
        // get all days in month
      weeks.forEach(function(week: any): ICalendarDate[]{
          currentMonth = currentMonth.concat(week);
          return currentMonth;
      });
       // filter by current or next month
      const filteredFirstMonth: ICalendarDate[] = currentMonth.filter(function(day: ICalendarDate): ICalendarDate{
          if (month === 'currentMonth' && this.isSelectedCurrentMonth(day.mDate)) {
              return day;
          } else if (month === 'nextMonth' && this.isSelectedNextMonth(day.mDate)) {
              return day;
          }
      }.bind(this));
         // get days in range
      this.daysRange = filteredFirstMonth.slice(startDate - 1, endDate);
        // choose only if date availability = first in range
      this.daysRange = this.daysRange.filter(function(day: ICalendarDate): ICalendarDate {
          return day.availability ===  this.daysRange[0].availability;
      }.bind(this));

      this.daysRange.map(function(day: ICalendarDate): void {
          const chosenDate: any = {
              date: moment(day.mDate).format('YYYY-MM-DD')
          };
          if (day.availability === 2 && this.dateStartAv === 2) {
              chosenDate.availability = 3;
              this.chosenDates.push(chosenDate);
          } else if (day.availability === 3 && this.dateStartAv === 3) {
              chosenDate.availability = 2;
          }
          day.selected = true;
        this.chosenDates.push(chosenDate);
      }.bind(this));
  }

  private selectRange(day: ICalendarDate): void {
      const daysNumbers: any[] = this.selectedDates.map(function (date: any): number {
          if (date.availability === 2 || date.availability === 3) {
              return date['mDate'].date();
          }
      });
      const startDate: number = Math.min.apply(null, daysNumbers);
      const endDate: number = Math.max.apply(null, daysNumbers);

      if (this.isSelectedCurrentMonth(day.mDate)) {
          this.getDateRange(this.weeks, 'currentMonth', startDate, endDate);
      } else if ((this.isSelectedNextMonth(day.mDate))) {
          this.getDateRange(this.nextMonthWeeks, 'nextMonth', startDate, endDate);
      }
      this.selectedDates = [];
  }

  public setChosenDates(date: ICalendarDate): void {
      let availability: number;
      const chosenDate: any = {
          date: moment(date.mDate).format('YYYY-MM-DD')
      };
      if (this.chosenDates.length !== 0) {
          if (!date.selected && date.availability === 2 && this.dateStartAv === 2) {
              availability = 3;
          } else if (!date.selected && date.availability === 3 && this.dateStartAv === 3) {
              availability = 2;
          }
          chosenDate.availability = availability;
          this.chosenDates.push(chosenDate);
          date.selected = true;
      }
  }

  public selectDate(date: ICalendarDate): void {
      this.onSelectDate.emit(date);
      this.selectedDates.push(date);
      this.setChosenDates(date);
  }

  // actions from calendar
  public monthNavigation () {
      this.firstMonthNumber = this.currentDate.month() + 1;
      this.lastMonthNumber = this.nextMonthDate.month() + 1;
      this.yearNumber = this.currentDate.format('YYYY');
      this.getAvailabilities(this.firstMonthNumber, this.lastMonthNumber, this.yearNumber);
      this.generateCalendar();
  }

  public prevMonth(): void {
      this.currentDate = moment(this.currentDate).subtract(2, 'months');
      this.nextMonthDate = moment(this.nextMonthDate).subtract(2, 'months');
      this.monthNavigation();
  }

  public nextMonth(): void {
      this.currentDate = moment(this.currentDate).add(2, 'months');
      this.nextMonthDate = moment(this.nextMonthDate).add(2, 'months');
      this.monthNavigation();
  }

  // generate the calendar grid
  public generateCalendar(): void {
      const dates: ICalendarDate[] = this.fillDates(this.currentDate);
      const nextMonthDates: ICalendarDate[] = this.fillDates(this.nextMonthDate);
      const weeks: ICalendarDate[][] = [];
      const nextMonthWeeks: ICalendarDate[][] = [];
      while (dates.length > 0) {
        weeks.push(dates.splice(0, 7));
      }
      while (nextMonthDates.length > 0) {
          nextMonthWeeks.push(nextMonthDates.splice(0, 7));
      }

      this.weeks = weeks;
      this.nextMonthWeeks = nextMonthWeeks;
      this.weeks.forEach((week: ICalendarDate[]) => {
          this.setBorders(week);
      });

      this.nextMonthWeeks.forEach((week: ICalendarDate[]) => {
          this.setBorders(week);
      });
  }

  private fillDates(currentMoment: moment.Moment): ICalendarDate[] {
    const firstOfMonth: number = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid: any = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');

    const start: number = firstDayOfGrid.date();
    const arr: number[] = _.range(start, start + 42);

    return [].map.call(arr, (date: number): ICalendarDate => {
        const d: any = moment(firstDayOfGrid).date(date);
        return {
          selected: false,
          mDate: d,
          availability: this.setAvailability(d),
          startBorder: false,
          endBorder: false,
          leftMargin: false,
          rightMargin: false

        };
      });
  }
  private toggleWatchers (): void {
    this.watchMouseUp = !this.watchMouseUp;
    this.watchMouseDown = !this.watchMouseDown;
  }
}


