import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
    private campInRetailService: CampaignInRetailService
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
      this.campInRetailService.getAudiencesByMetric(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'gender-and-age') {
            this.demographics['genderByAge'] = resp;
          } else {
            this.demographics[subMetricType] = resp;
          }

          reqStatusObj.reqStatus = 2;

          // process bounce rate data;
          if (metricType === 'bouncerate' && (subMetricType === 'device' || subMetricType === 'gender')) {
            this.addDemographicDataBr(subMetricType, resp);
          };
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
      this.campInRetailService.getAudiencesByMetric(metricType, subMetricType).subscribe(
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
      this.campInRetailService.getAudiencesByMetric('conversions-vs-traffic', subMetricType).subscribe(
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
      this.campInRetailService.getAudiencesByMetric('interests', subMetricType).subscribe(
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

  addDemographicDataBr(subMetric: string, dataRaw: any[]) {
    switch (subMetric) {
      case 'device':
        const desktop = dataRaw.find(item => item.name === 'Desktop');
        const mobile = dataRaw.find(item => item.name === 'Mobile');

        this.demographics['deviceDesktop'] = [
          { name: 'empty', value: desktop ? 100 - desktop.value.toFixed(2) : 100 },
          { name: 'Desktop', value: desktop ? desktop.value.toFixed(2) : 0 },
        ];

        this.demographics['deviceMobile'] = [
          { name: 'empty', value: mobile ? 100 - mobile.value.toFixed(2) : 100 },
          { name: 'Mobile', value: mobile ? mobile.value.toFixed(2) : 0 },
        ];
        break;

      case 'gender':
        const man = dataRaw.find(item => item.name === 'Hombre');
        const woman = dataRaw.find(item => item.name === 'Mujer');

        this.demographics['genderMan'] = [
          { name: 'empty', value: man ? 100 - man.value.toFixed(2) : 100 },
          { name: 'Hombre', value: man ? man.value.toFixed(2) : 0 },
        ];

        this.demographics['genderWoman'] = [
          { name: 'empty', value: woman ? 100 - woman.value.toFixed(2) : 100 },
          { name: 'Mujer', value: woman ? woman.value.toFixed(2) : 0 },
        ];
        break;
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

