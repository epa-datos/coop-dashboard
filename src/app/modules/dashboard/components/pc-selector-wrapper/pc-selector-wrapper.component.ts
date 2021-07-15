import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { KpiCard } from 'src/app/models/kpi';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertMonthToString, convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { FiltersStateService } from '../../services/filters-state.service';
import { PcSelectorService } from '../../services/pc-selector.service';

@Component({
  selector: 'app-pc-selector-wrapper',
  templateUrl: './pc-selector-wrapper.component.html',
  styleUrls: ['./pc-selector-wrapper.component.scss']
})
export class PcSelectorWrapperComponent implements OnInit, OnDestroy {
  @Input() levelPage: any // latam || country || retailer;
  @Input() requestInfoChange: Observable<{
    manualChange: boolean, // true if user clicks 'Filter' button of general-filters component; useful to preserve or clear selected tabs of active section template
    selectedSection: 'indexed' | 'omnichat' | 'pc-selector'
  }>;


  selectedTab1: number = 1; // users vs conversions (1) or revenue vs aup (2) selection -> chart-multiple-axes
  selectedTab2: number = 1; // traffic (1) or conversions (2) -> multiple charts
  selectedTab3: number = 1; // traffic (1) or conversions (2) -> audience

  kpis: KpiCard[] = [
    {
      title: 'usuarios',
      name: 'users',
      value: 0,
      format: 'integer',
      icon: 'fas fa-users',
      iconBg: '#172b4d'
    },
    {
      title: 'usuarios nuevos',
      name: 'new_users',
      value: 0,
      format: 'integer',
      icon: 'fas fa-user-plus',
      iconBg: '#2f9998'
    },
    {
      title: 'duración media de la sesión',
      name: 'median_of_session_duration',
      value: '00:00:00',
      icon: 'fas fa-user-clock',
      iconBg: '#a77dcc'
    },
    {
      title: 'conversiones',
      name: 'conversions',
      value: 0,
      format: 'integer',
      icon: 'fas fa-shopping-cart',
      iconBg: '#f89934'
    },
    {
      title: 'tasa de conversión',
      name: 'conversion_rate',
      value: 0,
      format: 'percentage',
      icon: 'fas fa-percentage',
      iconBg: '#fbc001'
    },
    {
      title: 'revenue',
      name: 'revenue',
      value: 0,
      format: 'decimal',
      symbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2B96D5',
      subKpis: [
        {
          title: 'aup',
          name: 'aup',
          value: 0,
          format: 'decimal',
          symbol: 'USD',
        }
      ]
    }
  ];
  kpisReqStatus: number = 0;

  // users vs conversions or revenue vs aup
  usersOrRevenue: any[] = [];
  usersOrRevenueReqStatus: number = 0;

  // traffic or conversions submetrics by level (latam, country, retailer)
  trafficOrConversions = {};
  trafficOrConversionsReqStatus = [
    { name: 'countries', reqStatus: 0 },
    { name: 'retailers', reqStatus: 0 },
    { name: 'exitRate', reqStatus: 0 },
    { name: 'exitRateByStep', reqStatus: 0 },
    { name: 'useRate', reqStatus: 0 },
    { name: 'products', reqStatus: 0 }
  ];

  // users, conversions and conversion rate
  performance: {};
  performanceReqStatus: number = 0;

  // traffic or conversions audience submetrics
  audience = {};
  audienceReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 },
    { name: 'weekday', reqStatus: 0 },
    { name: 'weekdayAndHour', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
  ];

  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private pcSelectorService: PcSelectorService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    let loadedFromInit: boolean; // first call to getAllData is from init
    let firstTimeSub: boolean = true; // first time requestInfoSub listen a change

    // validate if filters are already loaded
    if (this.filtersAreReady()) {
      this.getAllData();

      // use loadedFromInit to avoid repeated calls to getAllData()
      // when dashboard component is loaded for first time
      // (e.g after page refresh or be redirected from other component that doesn't belong to to dashboard module)
      loadedFromInit = true;
    }

    this.requestInfoSub = this.requestInfoChange.subscribe(({ manualChange, selectedSection }) => {
      // avoid repeated call to getAllData()
      if (loadedFromInit && firstTimeSub && !manualChange) {
        firstTimeSub = false;
        return;
      }

      firstTimeSub = false;
      loadedFromInit = false;

      if (selectedSection === 'pc-selector' && this.filtersAreReady() && !loadedFromInit) {
        this.getAllData(manualChange);
      }
    });
  }

  getAllData(preserveSelectedTabs?: boolean) {
    let metricTab1;
    let subMetricTab1;
    let metricTab2;
    let metricTab3;

    if (!preserveSelectedTabs) {
      metricTab1 = 'conversions';
      subMetricTab1 = 'users';
      metricTab2 = 'traffic';
      metricTab3 = 'traffic';

    } else {
      metricTab1 = this.selectedTab1 === 1 ? 'conversions' : 'revenue-vs-aup';
      subMetricTab1 = this.selectedTab1 === 1 && 'users';
      metricTab2 = this.selectedTab2 === 1 ? 'traffic' : 'conversions';
      metricTab3 = this.selectedTab3 === 1 ? 'traffic' : 'conversions';
    }

    this.getKpis();
    this.getUsersOrRevenue(metricTab1, subMetricTab1);
    this.getTrafficOrConversions(metricTab2);
    this.getPerformance();
    this.getAudienceByMetric(metricTab3);

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, 'kpis').subscribe(
      (resp: any[]) => {
        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = resp.find(item => item.string === this.kpis[i].name);

          if (!baseObj) {
            continue;
          }

          if (this.kpis[i].name === 'median_of_session_duration') {
            this.kpis[i].value = strTimeFormat(baseObj.value);
          } else {
            this.kpis[i].value = baseObj.value;
          }

          if (this.kpis[i].name === 'revenue' && this.kpis[i].subKpis[0]) {
            this.kpis[i].subKpis[0].value = resp.find(kpi => kpi.string === 'aup')?.value;
          }
        }
        this.kpisReqStatus = 2;
      },
      error => {
        this.clearKpis();
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getUsersOrRevenue(metricType: string, subMetricType?: string) {
    this.selectedTab1 = metricType === 'conversions' ? 1 : 2;

    this.usersOrRevenueReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, metricType, subMetricType).subscribe(
      (resp: any[]) => {
        this.usersOrRevenue = resp;
        this.usersOrRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
        this.usersOrRevenueReqStatus = 3;
      });
  }

  getTrafficOrConversions(metricType: string) {
    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;

    let requiredData: any[] = [];

    // required data by metricType
    if (metricType === 'traffic') {
      requiredData.push(
        { metricType: 'funnel', subMetricType: 'exit-rate', name: 'exitRate' },
        { metricType: 'funnel', subMetricType: 'exit-rate-by-step', name: 'exitRateByStep' },
        { metricType: 'funnel', subMetricType: 'use-rate', name: 'useRate' }
      );
    } else if (metricType === 'conversions') {
      requiredData.push(
        { metricType: 'conversions', subMetricType: 'products', name: 'products' }
      );
    }

    // required data by levelPage
    if (this.levelPage.latam) {
      requiredData.push(
        { metricType, subMetricType: 'countries', name: 'countries' },
        { metricType, subMetricType: 'retailers', name: 'retailers' }
      );
    } else if (this.levelPage.country) {
      requiredData.push(
        { metricType, subMetricType: 'retailers', name: 'retailers' }
      );
    }

    for (let metric of requiredData) {
      const reqStatusObj = this.trafficOrConversionsReqStatus.find(item => item.name === metric.name);
      reqStatusObj.reqStatus = 1;

      this.pcSelectorService.getDataByMetric(this.levelPage.latam, metric.metricType, metric.subMetricType).subscribe(
        (resp: any[]) => {
          if (metric.metricType === 'traffic' && (metric.name === 'countries' || metric.name === 'retailers')) {
            this.trafficOrConversions[metric.name] = resp.sort((a, b) => (a?.chats < b?.chats ? -1 : 1));

          } else if (metric.metricType === 'sales' && (metric.name === 'countries' || metric.name === 'retailers')) {
            this.trafficOrConversions[metric.name] = resp.sort((a, b) => (a?.value < b?.value ? -1 : 1));

          } else {
            this.trafficOrConversions[metric.name] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          this.trafficOrConversions[metric.name] = [];
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getPerformance() {
    this.performanceReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, 'performance').subscribe(
      (months: any) => {
        const newMonthsObj = {};
        for (let item in months) {
          const date = item.split('-');
          const dateStrFormat = `${convertMonthToString(date[1])} ${date[0]}`;

          const obj = months[item];
          newMonthsObj[dateStrFormat] = obj;
        }

        this.performance = newMonthsObj;
        this.performanceReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
        this.performanceReqStatus = 3;
      });
  }

  getAudienceByMetric(metricType: string) {
    this.selectedTab3 = metricType === 'traffic' ? 1 : 2;

    const requiredData = [
      { subMetricType: 'devices', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
      { subMetricType: 'weekday', name: 'weekday' },
    ];

    if (metricType === 'traffic') {
      requiredData.push(
        { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
        { subMetricType: 'hour', name: 'hour' }
      );
    }

    for (let subMetric of requiredData) {
      const reqStatusObj = this.audienceReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.pcSelectorService.getDataByMetric(this.levelPage.latam, metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {

          if (subMetric.name === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.audience = { ...this.audience, desktop, mobile };

          } else if (subMetric.name === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.audience = { ...this.audience, men: hombre, women: mujer };

          } else if (subMetric.name === 'weekdayAndHour') {
            this.audience[subMetric.name] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else if (subMetric.name === 'weekday') {
            resp = resp.sort((a, b) => (a.weekday > b.weekday ? -1 : 1));
            this.audience[subMetric.name] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else {
            this.audience[subMetric.name] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  filtersAreReady(): boolean {
    if (!this.levelPage ||
      !this.filtersStateService.period) {
      return false;
    }

    if (this.levelPage.latam &&
      this.filtersStateService.countries &&
      this.filtersStateService.retailers
    ) {
      return true;

    } else if (!this.levelPage.latam) {
      return true;

    } else {
      return false;
    }
  }

  clearKpis() {
    for (let kpi of this.kpis) {
      if (kpi.name === 'median_of_session_duration') {
        kpi.value = '00:00:00';
      } else {
        kpi.value = 0;
      }

      kpi.subKpis?.forEach(item => {
        item.value = 0;
      });
    }
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
