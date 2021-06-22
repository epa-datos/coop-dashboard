import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-audiences-wrapper',
  templateUrl: './audiences-wrapper.component.html',
  styleUrls: ['./audiences-wrapper.component.scss']
})
export class AudiencesWrapperComponent implements OnInit, OnDestroy {

  demographics = {}; // for devices, gender, age and age-gender data
  demoReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'gender-and-age', reqStatus: 0 }
  ];

  weekDaysAndHours = {}; // for weekday, weekday and hour, and hour
  weekDaysAndHoursReqStatus = [
    { name: 'weekday-and-hour', reqStatus: 0 },
    { name: 'weekday', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
  ];

  conversionsVsTraffic = {}; // by day and by hour
  conversionsVsTrafficReqStatus = [
    { name: 'weekday', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
  ];

  interests = {}; // for affinity category and market-segment
  interestsReqStatus = [
    { name: 'affinity-category', reqStatus: 0 },
    { name: 'market-segment', reqStatus: 0 },
  ];

  selectedTab1: any = 1;
  selectedTab2: any = 1;

  chartsInitLoad: boolean = true;
  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getAllData();

    this.generalFiltersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    })

    this.retailFiltersSub = this.filtersStateService.retailFiltersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.getDomographicsByMetric(this.getSelectedMetricForDemo(null, this.selectedTab1));
    this.getWeekdaysAndHoursByMetric(this.selectedTab2 === 1 ? 'traffic' : 'conversions');
    this.getConversionsVsTraffic();
    this.getInterests();

    this.chartsInitLoad = true;
  }

  getDomographicsByMetric(metricType: any) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age'];

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.demoReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'device' && metricType !== 'aup') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp, metricType === 'bouncerate' ? false : true);
            this.demographics = { ...this.demographics, desktop, mobile };

          } else if (subMetricType === 'gender' && metricType !== 'aup') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp, metricType === 'bouncerate' ? false : true);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.demographics = { ...this.demographics, men: hombre, women: mujer };

          } else if (subMetricType === 'gender-and-age') {
            this.demographics['genderByAge'] = resp;
          } else {
            this.demographics[subMetricType] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab1 = this.getSelectedMetricForDemo(metricType, null);
    }
  }

  getWeekdaysAndHoursByMetric(metricType: string) {
    const requiredData = ['weekday-and-hour', 'weekday', 'hour'];

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.weekDaysAndHoursReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'weekday-and-hour') {
            this.weekDaysAndHours['weekdayAndHour'] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });

          } else if (subMetricType === 'weekday') {
            resp = resp.sort((a, b) => (a.weekday > b.weekday ? -1 : 1));
            this.weekDaysAndHours[subMetricType] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });

          } else {
            this.weekDaysAndHours[subMetricType] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
    }
  }

  getConversionsVsTraffic() {
    const requiredData = ['weekday', 'hour'];

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.conversionsVsTrafficReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric('conversions-vs-traffic', subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'weekday') {
            this.conversionsVsTraffic[subMetricType] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else {
            this.conversionsVsTraffic[subMetricType] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getInterests() {
    const requiredData = ['affinity-category', 'market-segment'];
    for (let subMetricType of requiredData) {
      const reqStatusObj = this.interestsReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric('interests', subMetricType).subscribe(
        (resp: any[]) => {
          resp = resp.sort((a, b) => (a.users < b.users ? -1 : 1));

          if (subMetricType === 'affinity-category') {
            this.interests['affinityCategory'] = resp;
          } else {
            this.interests['marketSegment'] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getSelectedMetricForDemo(metricType: string, selectedTab: number) {
    if (metricType) {
      switch (metricType) {
        case 'traffic':
          return 1;

        case 'conversions':
          return 2;

        case 'aup':
          return 3;

        case 'bouncerate':
          return 4;

        default:
          return;
      }
    } else if (selectedTab) {
      switch (selectedTab) {
        case 1:
          return 'traffic'
          break;

        case 2:
          return 'conversions'

        case 3:
          return 'aup'

        case 4:
          return 'bouncerate'

        default:
          return;
      }
    }

  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
  }
}

