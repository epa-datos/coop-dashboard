import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { KpiCard } from 'src/app/models/kpi';
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
  @Input() requestInfoChange: Observable<{
    manualChange: boolean, // true if user clicks 'Filter' button of general-filters component; useful to preserve or clear selected tabs of active section template
    selectedSection: 'indexed' | 'omnichat' | 'pc-selector'
  }>;

  selectedTab1: number = 1; // traffic for countries (1) or retailers (2) selection -> chart-line-series

  // kpis
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
      title: 'sesiones',
      name: 'sessions',
      value: 0,
      format: 'integer',
      icon: 'fas fa-eye',
      iconBg: '#a77dcc'
    },
    {
      title: 'páginas/sesión',
      name: 'page_views_per_session',
      value: 0,
      format: 'decimal',
      icon: 'fas fa-file',
      iconBg: '#fbc001'
    },
    {
      title: 'duración media de la sesión',
      name: 'avg_session_duration',
      value: '00:00:00',
      icon: 'fas fa-user-clock',
      iconBg: '#2B96D5'
    }
  ];
  kpisReqStatus = 0;

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

  // bounces exits and page views
  bouncesExitsAndPv = {};
  bouncesExitsAndPvReqStatus;

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

  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;
  levelPageSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private indexedService: IndexedService,
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
      loadedFromInit = true
    }

    this.requestInfoSub = this.requestInfoChange.subscribe(({ manualChange, selectedSection }) => {
      // manualChange isn't useful in this component because there isn't tabs to preserve or clear selection
      // the only tab only appears in LATAM view level and it isn't necessary to clear the selection 
      // when the view changes to country or retailer since it isn't shown at these levels 

      // avoid repeated call to getAllData()
      if (loadedFromInit && firstTimeSub && !manualChange) {
        firstTimeSub = false;
        return;
      }

      firstTimeSub = false;
      loadedFromInit = false;

      if (selectedSection === 'indexed' && this.filtersAreReady() && !loadedFromInit) {
        this.getAllData();
      }
    });

    this.levelPageSub = this.levelPageChange.subscribe((levelChange: object) => {
      this.levelPage = levelChange;
    });
  }

  getAllData() {
    let metricTraffic = this.levelPage.latam && this.selectedTab1 === 1 ? 'countries' : 'retailers';

    this.getKpis();
    this.getTrafficByCountriesAndRetailers(metricTraffic);
    this.getTrafficData();
    this.getBouncesExitsAndPageviews();
    this.getMostVisited();
    this.getAudiences();

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.indexedService.getDataByMetric(this.levelPage.latam, 'kpis').subscribe(
      (resp: any[]) => {
        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = resp.find(item => item.string === this.kpis[i].name);

          if (!baseObj) {
            break;
          }

          if (this.kpis[i].name === 'avg_session_duration') {
            this.kpis[i].value = strTimeFormat(baseObj.value);
          } else {
            this.kpis[i].value = baseObj.value;
          }
        }

        this.kpisReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[indexed-wrapper.component]: ${errorMsg}`);

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
        console.error(`[indexed-wrapper.component]: ${errorMsg}`);
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

  getBouncesExitsAndPageviews() {
    this.bouncesExitsAndPvReqStatus = 1;

    this.indexedService.getDataByMetric(this.levelPage.latam, 'bounces-exits-and-pageviews').subscribe(
      (seriesData: any[]) => {

        this.bouncesExitsAndPv = seriesData.map(serie => {
          if (serie.name.toLowerCase().includes('porcentaje')) {
            return { ...serie, valueFormat: '%' };
          } else {
            return serie;
          }
        });

        this.bouncesExitsAndPvReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[indexed-wrapper.component]: ${errorMsg}`);
        this.bouncesExitsAndPvReqStatus = 3;
      });
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
      if (kpi.name === 'avg_session_duration') {
        kpi.value = '00:00:00';
      } else {
        kpi.value = 0;
      }
    }
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
    this.levelPageSub?.unsubscribe();
  }

}
