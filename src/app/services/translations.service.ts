import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  constructor(private translate: TranslateService) { }

  convertWeekdayToString(weekday: number): string {
    let weekdayName;
    switch (weekday) {
      case 1:
        weekdayName = this.translate.instant('others.days.mon');
        break;
      case 2:
        weekdayName = this.translate.instant('others.days.tue');
        break;
      case 3:
        weekdayName = this.translate.instant('others.days.wed');
        break;
      case 4:
        weekdayName = this.translate.instant('others.days.thu');
        break;
      case 5:
        weekdayName = this.translate.instant('others.days.fri');
        break;
      case 6:
        weekdayName = this.translate.instant('others.days.sat');
        break;
      case 7:
        weekdayName = this.translate.instant('others.days.sun');
        break;
    }

    return weekdayName;
  }

  convertMonthToString(month: string): string {
    let monthName;
    switch (month) {
      case '01':
        monthName = this.translate.instant('others.days.jan');
        break;
      case '02':
        monthName = this.translate.instant('others.days.feb');
        break;
      case '03':
        monthName = this.translate.instant('others.days.mar');
        break;
      case '04':
        monthName = this.translate.instant('others.days.apr');
        break;
      case '05':
        monthName = this.translate.instant('others.days.may');
        break;
      case '06':
        monthName = this.translate.instant('others.days.jun');
        break;
      case '07':
        monthName = this.translate.instant('others.days.jul');
        break;
      case '08':
        monthName = this.translate.instant('others.days.aug');
        break;
      case '09':
        monthName = this.translate.instant('others.days.sep');
        break;
      case '10':
        monthName = this.translate.instant('others.days.oct');
        break;
      case '11':
        monthName = this.translate.instant('others.days.nov');
        break;
      case '12':
        monthName = this.translate.instant('others.days.dec');
        break;
    }

    return monthName;
  }

}
