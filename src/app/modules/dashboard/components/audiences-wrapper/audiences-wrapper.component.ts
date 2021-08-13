import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { TranslationsService } from 'src/app/services/translations.service';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-audiences-wrapper',
  templateUrl: './audiences-wrapper.component.html',
  styleUrls: ['./audiences-wrapper.component.scss']
})
export class AudiencesWrapperComponent implements OnInit, OnDestroy {

  retailerID: number;

  demographics = {}; // for devices, gender, age and age-gender data
  demoReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 }
  ];

  weekDaysAndHours = {}; // for weekday, weekday and hour, and hour
  weekDaysAndHoursReqStatus = [
    { name: 'weekdayAndHour', reqStatus: 0 },
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
    { name: 'affinityCategory', reqStatus: 0 },
    { name: 'marketSegment', reqStatus: 0 },
  ];

  metricsForTab1: any[] = [
    { tab: 1, metricType: 'traffic' },
    { tab: 2, metricType: 'conversions' },
    { tab: 3, metricType: 'aup' },
    { tab: 4, metricType: 'bouncerate' }
  ];
  selectedTab1: any = 1;
  selectedTab2: any = 1;

  chartsInitLoad: boolean = true;

  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;
  translateSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService,
    private appStateService: AppStateService,
    private translate: TranslateService,
    private translationsServ: TranslationsService
  ) {

    this.translateSub = translate.stream('audiences').subscribe(() => {
      this.loadI18nContent();
    });
  }

  ngOnInit(): void {
    this.retailerID = this.appStateService.selectedRetailer?.id;

    this.getAllData();

    this.generalFiltersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    })

    this.retailFiltersSub = this.filtersStateService.retailFiltersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.getDemographicsByMetric(this.metricsForTab1.find(metric => metric.tab === this.selectedTab1)?.metricType);
    this.getWeekdaysAndHoursByMetric(this.selectedTab2 === 1 ? 'traffic' : 'conversions');
    this.getConversionsVsTraffic();
    this.getInterests();

    this.chartsInitLoad = true;
  }

  getDemographicsByMetric(metricType: any) {
    const requiredData = [
      { subMetricType: 'device', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.demoReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric(metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          switch (true) {
            case subMetric.name === 'device' && metricType !== 'aup':
              const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp, metricType === 'bouncerate' ? false : true);
              this.demographics = { ...this.demographics, desktop, mobile };
              break;

            case subMetric.name === 'gender':
              if (metricType === 'aup') {
                const men = resp.find(item => item.name === 'Hombre' || item.name === 'male');
                const women = resp.find(item => item.name === 'Mujer');

                const parsedResp = [
                  { ...men, name: this.translate.instant('others.men') },
                  { ...women, name: this.translate.instant('others.women') }
                ]
                this.demographics[subMetric.name] = parsedResp;

              } else {
                const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp, metricType === 'bouncerate' ? false : true);

                hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
                mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

                this.demographics = { ...this.demographics, men: hombre, women: mujer };
              }
              break;

            default:
              this.demographics[subMetric.name] = resp;
              break;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab1 = this.metricsForTab1.find(metric => metric.metricType === metricType)?.tab;
    }
  }

  getWeekdaysAndHoursByMetric(metricType: string) {
    const requiredData = [
      { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
      { subMetricType: 'weekday', name: 'weekday' },
      { subMetricType: 'hour', name: 'hour' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.weekDaysAndHoursReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric(metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetric.name === 'weekdayAndHour') {
            this.weekDaysAndHours['weekdayAndHour'] = resp.map(item => {
              return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
            });

          } else if (subMetric.name === 'weekday') {
            resp = resp.sort((a, b) => (a.weekday > b.weekday ? -1 : 1));
            this.weekDaysAndHours['weekday'] = resp.map(item => {
              return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
            });

          } else {
            this.weekDaysAndHours[subMetric.name] = resp;
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
              return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
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
    const requiredData = [
      { subMetricType: 'affinity-category', name: 'affinityCategory' },
      { subMetricType: 'market-segment', name: 'marketSegment' }
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.interestsReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.campInRetailService.getDataByMetric('interests', subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          resp = resp.sort((a, b) => (a.users < b.users ? -1 : 1));

          this.interests[subMetric.name] = resp;
          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  loadI18nContent() {
    if (this.demographics['men']?.length > 0) {
      this.demographics['men'][1].name = this.translate.instant('others.men');
    }

    if (this.demographics['women']?.length > 0) {
      this.demographics['women'][1].name = this.translate.instant('others.women');
    }

    this.weekDaysAndHours['weekdayAndHour'] = this.weekDaysAndHours['weekdayAndHour']?.map(item => {
      return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
    });

    this.weekDaysAndHours['weekday'] = this.weekDaysAndHours['weekday']?.map(item => {
      return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
    });

    this.conversionsVsTraffic['weekday'] = this.conversionsVsTraffic['weekday']?.map(item => {
      return { ...item, weekdayName: this.translationsServ.convertWeekdayToString(item.weekday) }
    });
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}

