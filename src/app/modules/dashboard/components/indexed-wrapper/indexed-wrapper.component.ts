import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { FiltersStateService } from '../../services/filters-state.service';
import { IndexedService } from '../../services/indexed.service';

@Component({
  selector: 'app-indexed-wrapper',
  templateUrl: './indexed-wrapper.component.html',
  styleUrls: ['./indexed-wrapper.component.scss']
})
export class IndexedWrapperComponent implements OnInit, OnDestroy {
  @Input() levelPage: any // latam || country || retailer;
  @Input() levelPageChange: Observable<object>;
  @Input() requestInfoChange: Observable<boolean>;

  // kpis
  kpis: any[] = [
    {
      metricTitle: 'usuarios',
      metricName: 'users',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-users',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'usuarios nuevos',
      metricName: 'new_users',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-user-plus',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'sesiones',
      metricName: 'sessions',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-eye',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'páginas/sesión',
      metricName: 'page_views_per_session',
      metricValue: 0,
      metricFormat: 'decimals',
      icon: 'fas fa-file',
      iconBg: '#fbc001'
    },
    {
      metricTitle: 'duración media de la sesión',
      metricName: 'avg_session_duration',
      metricValue: '00:00:00',
      icon: 'fas fa-user-clock',
      iconBg: '#2B96D5'
    }
  ];
  kpisReqStatus = 0;


  // exits rate and pages viewed
  exitsAndPagesViews = [
    {
      name: 'Porcentaje de salidas',
      serie: [
        { date: '2021-06-02', value: 75 },
        { date: '2021-06-03', value: 87 },
        { date: '2021-06-04', value: 70 },
        { date: '2021-06-05', value: 86 },
        { date: '2021-06-06', value: 70 },
        { date: '2021-06-07', value: 75 },
        { date: '2021-06-08', value: 82 },
        { date: '2021-06-09', value: 70 },
        { date: '2021-06-10', value: 75 },
        { date: '2021-06-11', value: 78 },
        { date: '2021-06-12', value: 80 },
        { date: '2021-06-13', value: 83 },
        { date: '2021-06-14', value: 70 },
        { date: '2021-06-15', value: 76 },
        { date: '2021-06-16', value: 74 }
      ],
      valueFormat: '%'
    },
    {
      name: 'Número de páginas vistas',
      serie: [
        { date: '2021-06-02', value: 7 },
        { date: '2021-06-03', value: 5 },
        { date: '2021-06-04', value: 4 },
        { date: '2021-06-05', value: 2 },
        { date: '2021-06-06', value: 3 },
        { date: '2021-06-07', value: 5 },
        { date: '2021-06-08', value: 4 },
        { date: '2021-06-09', value: 3 },
        { date: '2021-06-10', value: 7 },
        { date: '2021-06-11', value: 6 },
        { date: '2021-06-12', value: 5 },
        { date: '2021-06-13', value: 2 },
        { date: '2021-06-14', value: 3 },
        { date: '2021-06-15', value: 1 },
        { date: '2021-06-16', value: 6 }
      ]
    }
  ]

  // countries or retailers chart
  counOrRet = {};
  countOrRetReqStatus: number = 0;

  // all traffic submetrics
  traffic = {};
  trafficReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 },
    { name: 'weekdayAndHour', reqStatus: 0 },
    { name: 'weekday', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
    { name: 'newUsersVsCurrent', reqStatus: 0 },
  ];

  // most visited products & categories
  topMostVisited = {
    products: {
      tableColumns: [
        {
          name: 'ranking',
          title: 'Ranking'
        },
        {
          name: 'name',
          title: 'Producto',
          tooltip: true,
        },
        {
          name: 'value',
          title: 'Usuarios',
          textAlign: 'center',
          formatValue: 'integer',
        }
      ],
      data: [],
      reqStatus: 0
    },
    categories: {
      tableColumns: [
        {
          name: 'ranking',
          title: 'Ranking'
        },
        {
          name: 'name',
          title: 'Categoría',
        },
        {
          name: 'value',
          title: 'Usuarios',
          textAlign: 'center',
          formatValue: 'integer',
        }
      ],
      data: [],
      reqStatus: 0
    },
  };

  // audiences
  audiences = {};
  audiencesReqStatus = [
    { name: 'affinityCategory', reqStatus: 0 },
    { name: 'marketSegment', reqStatus: 0 }
  ];

  selectedTab1: number = 1;
  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;
  levelPageSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private indexedService: IndexedService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {

    // validate if filters are already loaded
    this.filtersAreReady() && this.getAllData();

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.filtersAreReady() && this.getAllData();
    });

    this.levelPageSub = this.levelPageChange.subscribe((levelChange: object) => {
      this.levelPage = levelChange;
    });
  }

  getAllData() {
    let subMetricForTraffic = this.levelPage.latam && this.selectedTab1 === 1 ? 'countries' : 'retailers';

    this.getKpis();
    this.getTrafficByCountriesAndRetailers(subMetricForTraffic);
    this.getTrafficData();
    this.getMostVisited();
    this.getAudiences();

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.indexedService.getDataByMetric(this.levelPage.latam, 'kpis').subscribe(
      (resp: any[]) => {
        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = resp.find(item => item.string === this.kpis[i].metricName);

          if (!baseObj) {
            break;
          }

          if (this.kpis[i].metricName === 'avg_session_duration') {
            this.kpis[i].metricValue = strTimeFormat(baseObj.value);
          } else {
            this.kpis[i].metricValue = baseObj.value;
          }
        }

        this.kpisReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[indexed.component]: ${error}`);

        this.clearKpis();
        this.kpisReqStatus = 3;
      });
  }

  getTrafficByCountriesAndRetailers(subMetricType) {
    if (this.levelPage.retailer) {
      return;
    }

    this.countOrRetReqStatus = 1;

    this.indexedService.getDataByMetric(this.levelPage.latam, 'traffic', subMetricType).subscribe(
      (resp: any[]) => {
        this.counOrRet = resp.sort((a, b) => (a?.visits < b?.visits ? -1 : 1));
        this.countOrRetReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[indexed.component]: ${errorMsg}`);
        this.countOrRetReqStatus = 3;
      });

    // only latam display country and retailer tabs
    if (this.levelPage.latam) {
      this.selectedTab1 = subMetricType === 'countries' ? 1 : 2;
    }
  }

  getTrafficData() {
    const requiredData = [
      { subMetricType: 'device', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
      { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
      { subMetricType: 'weekday', name: 'weekday' },
      { subMetricType: 'hour', name: 'hour' },
      { subMetricType: 'new-users-vs-current', name: 'newUsersVsCurrent' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.trafficReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.indexedService.getDataByMetric(this.levelPage.latam, 'traffic', subMetric.subMetricType).subscribe(
        (resp: any[]) => {

          if (subMetric.name === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.traffic = { ...this.traffic, desktop, mobile };

          } else if (subMetric.name === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.traffic = { ...this.traffic, men: hombre, women: mujer };

          } else if (subMetric.name === 'weekdayAndHour') {
            this.traffic[subMetric.name] = resp?.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else if (subMetric.name === 'weekday') {
            resp = resp?.sort((a, b) => (a.weekday > b.weekday ? -1 : 1));
            this.traffic[subMetric.name] = resp?.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else {
            this.traffic[subMetric.name] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[indexed-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getMostVisited() {
    const requiredData = [
      { metricType: 'top-products', name: 'products' },
      { metricType: 'top-categories', name: 'categories' }
    ];

    for (let metric of requiredData) {
      this.topMostVisited[metric.name].reqStatus = 1;
      this.indexedService.getDataByMetric(this.levelPage.latam, metric.metricType).subscribe(
        (resp: any[]) => {
          this.topMostVisited[metric.name]['data'] = resp;
          this.topMostVisited[metric.name].reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[indexed-wrapper.component]: ${errorMsg}`);

          this.topMostVisited[metric.name].reqStatus = 3;
        });
    }
  }

  getAudiences() {
    const requiredData = [
      { subMetricType: 'affinity-category', name: 'affinityCategory' },
      { subMetricType: 'market-segment', name: 'marketSegment' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.audiencesReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.indexedService.getDataByMetric(this.levelPage.latam, 'interests', subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          this.audiences[subMetric.name] = resp.sort((a, b) => (a?.users < b?.users ? -1 : 1));
          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[indexed-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  filtersAreReady(): boolean {
    if (!this.levelPage ||
      !this.filtersStateService.period ||
      !this.filtersStateService.categories) {
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
      if (kpi.metricName === 'avg_session_duration') {
        kpi.metricValue = '00:00:00';
      } else {
        kpi.metricValue = 0;
      }
    }
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
    this.levelPageSub?.unsubscribe();
  }

}
