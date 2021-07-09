import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { convertMonthToString, convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { FiltersStateService } from '../../services/filters-state.service';
import { OmnichatService } from '../../services/omnichat.service';
import { TableItem } from '../generic-table/generic-table.component';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-omnichat-wrapper',
  templateUrl: './omnichat-wrapper.component.html',
  styleUrls: ['./omnichat-wrapper.component.scss']
})
export class OmnichatWrapperComponent implements OnInit, OnDestroy {
  @Input() levelPage: any // latam || country || retailer;
  @Input() requestInfoChange: Observable<boolean>;

  selectedTab1: number = 1; // users vs conversions (1) or revenue vs aup (2) selection -> chart-multiple-axes
  selectedTab2: number = 1; // traffic (1) or conversions (2) -> countries, retailers and categories charts
  selectedTab3: number = 1; // selected category -> chart-bar-horizontal
  selectedTab4: number = 1; // traffic (1) or conversions (2) -> audience charts

  // kpis and conversion rates
  staticData = {
    kpis: [
      {
        metricTitle: 'total chats',
        metricName: 'total_chats',
        metricValue: 0,
        metricFormat: 'integer'
      },
      {
        metricTitle: 'promedio de chats por día',
        metricName: 'average_chats_by_day',
        metricValue: 0,
        metricFormat: 'integer'

      },
      {
        metricTitle: '% dedicado al cliente',
        metricName: 'average_of_answer_time',
        metricValue: 0,
        metricFormat: 'percentage'
      },
      {
        metricTitle: 'duración media de la sesión',
        metricName: 'median_chat_duration',
        metricValue: '00:00:00',
      },
      {
        metricTitle: 'páginas por sesión',
        metricName: 'pages_per_session',
        metricValue: 0,
        metricFormat: 'decimals'
      },
      {
        metricTitle: 'calificación del chat',
        metricName: 'chat_score',
        metricValue: 0,
        metricFormat: 'score',
        subMetricTitle: 'resultado',
        subMetricName: 'chat_score',
        subMetricValue: '0% - 0/5'
      },
      {
        metricTitle: 'usuarios',
        metricName: 'users',
        metricValue: 0,
        metricFormat: 'integer'
      },
      {
        metricTitle: 'conversiones',
        metricName: 'conversions',
        metricValue: 0,
        metricFormat: 'integer',
      },
      {
        metricTitle: 'tasa de conversión',
        metricName: 'conversion_rate',
        metricValue: 0,
        metricFormat: 'percentage',
      },
      {
        metricTitle: 'revenue',
        metricName: 'revenue',
        metricValue: 0,
        metricFormat: 'decimals',
        metricSymbol: 'USD'
      }
    ],
    conversionRateInitial: [
      {
        metricTitle: 'ps',
        metricName: 'PS',
        metricValue: 0,
        metricFormat: 'percentage'
      },
      {
        metricTitle: 'hw Print',
        metricName: 'HW Print',
        metricValue: 0,
        metricFormat: 'percentage'
      },
      {
        metricTitle: 'Supplies',
        metricName: 'Supplies',
        metricValue: 0,
        metricFormat: 'percentage',
      }
    ],
    conversionRate: []
  };
  staticDataReqStatus = [
    { name: 'kpis', reqStatus: 0 },
    { name: 'conversionRate', reqStatus: 0 },
  ];

  // users vs conversions or revenue vs aup
  usersOrRevenue: any[] = [];
  usersOrRevenueReqStatus: number = 0;

  // metrics for different levels (latam, country, retailer)
  dataByLevel = {};
  dataByLevelReqStatus = [
    { name: 'countries', reqStatus: 0 },
    { name: 'retailers', reqStatus: 0 },
    { name: 'category1', reqStatus: 0 },
    { name: 'category2', reqStatus: 0 },
  ];

  // conversions by products
  salesByProduct: any[] = [];
  salesByProductReqStatus: number = 0;

  // users, conversions and conversion rate
  usersSalesAndCR = {};
  usersSalesAndCRReqStatus: number = 0;

  // categories table
  performanceByCategoryColumns: TableItem[] = [
    {
      name: 'category',
      title: 'Categoría',
    },
    {
      name: 'users',
      title: 'Usuarios',
      formatValue: 'integer',
      textAlign: 'center',
    },
    {
      name: 'conversion_rate',
      title: 'Tasa de conversión',
      textAlign: 'center',
      formatValue: 'percentage'
    },
    {
      name: 'conversion_rate_yoy',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage'
    },
    {
      name: 'amount',
      title: 'Cantidad',
      textAlign: 'center',
      formatValue: 'integer',
    },
    {
      name: 'amount_yoy',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage',
    },
    {
      name: 'revenue',
      title: 'Revenue',
      textAlign: 'center',
      formatValue: 'currency',
    },
    {
      name: 'revenue_yoy',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage',
    }
  ];
  performanceByCategory = {
    data: [],
    reqStatus: 0
  }

  // all traffic or conversions submetrics
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

  // available tabs for salesByProduct
  selectedCategories: any[] = [];
  selectedCategoryTab3: any;

  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;

  constructor(
    private omnichatService: OmnichatService,
    private filtersStateService: FiltersStateService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.selectedCategories = this.filtersStateService.categories;

    // validate if filters are already loaded
    this.filtersAreReady() && this.getAllData();

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.filtersAreReady() && this.getAllData();
    });
  }

  getAllData() {
    this.selectedCategories = this.filtersStateService.categories;
    const previousCategory = this.selectedCategories?.find(category => category.id === this.selectedCategoryTab3?.id);
    const selectedCategory = previousCategory ? previousCategory : this.selectedCategories?.[0];

    let metricTab1 = this.selectedTab1 === 1 ? 'conversions-vs-users' : 'aup-vs-revenue';
    let metricTab2 = this.selectedTab2 === 1 ? 'traffic' : 'sales';
    let metricTab4 = this.selectedTab4 === 1 ? 'traffic' : 'sales';

    this.getStaticDataByMetric();
    this.getUsersOrRevenue(metricTab1);
    this.getDataByLevel(metricTab2);
    this.getSalesByProduct(selectedCategory);
    this.getUsersSalesAndCR(selectedCategory);
    this.getPerformanceByCategory();
    this.getAudienceByMetric(metricTab4);

    this.chartsInitLoad = true;
  }

  getStaticDataByMetric() {
    const requiredData = [
      { metricType: 'kpis', name: 'kpis' },
      { metricType: 'conversion-rate', subMtricType: 'category', name: 'conversionRate' }
    ];

    for (let metric of requiredData) {
      const reqStatusObj = this.staticDataReqStatus.find(item => item.name === metric.name);
      reqStatusObj.reqStatus = 1;

      this.omnichatService.getDataByMetric(this.levelPage.latam, metric.metricType, metric.subMtricType).subscribe(
        (resp: any[]) => {
          if (resp?.length < 1) {
            reqStatusObj.reqStatus = 2;
            return;
          }

          if (metric.name === 'kpis') {
            for (let i = 0; i < this.staticData.kpis.length; i++) {
              const baseObj = resp.find(item => item.string === this.staticData.kpis[i].metricName);

              if (!baseObj) {
                break;
              }

              const metricName = this.staticData.kpis[i].metricName;

              if (metricName === 'median_chat_duration') {
                this.staticData.kpis[i].metricValue = strTimeFormat(baseObj.value);
              } else if (metricName === 'chat_score') {
                const percentageScore = ((baseObj.value * 100) / 5).toFixed(2);
                this.staticData.kpis[i].metricValue = percentageScore;
                this.staticData.kpis[i].subMetricValue = `${percentageScore}% - ${baseObj.value.toFixed(2)}/5`;
              } else {
                this.staticData.kpis[i].metricValue = baseObj.value;
              }
            }

          } else if (metric.name === 'conversionRate') {
            this.staticData.conversionRate = this.staticData.conversionRateInitial.map(item => ({ ...item }));

            for (let i = 0; i < this.staticData.conversionRate.length; i++) {
              const baseObj = resp.find(item => item.name === this.staticData.conversionRate[i].metricName);
              if (baseObj) {
                this.staticData.conversionRate[i].metricValue = baseObj.value;
              }

            }

            // show only selected categories in general filters
            const selectedCategories = this.filtersStateService.categories.map(item => item.name.toLowerCase());
            this.staticData.conversionRate = this.staticData.conversionRate.filter(item => selectedCategories.includes(item.metricName.toLowerCase()));
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          metric.name === 'kpis' ? this.clearKpis() : this.clearConversionsRate();

          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getUsersOrRevenue(metricType: string) {
    this.usersOrRevenueReqStatus = 1;
    this.omnichatService.getDataByMetric(this.levelPage.latam, metricType).subscribe(
      (resp: any[]) => {
        this.usersOrRevenue = resp;
        this.usersOrRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
        this.usersOrRevenueReqStatus = 3;
      });

    this.selectedTab1 = metricType === 'conversions-vs-users' ? 1 : 2;
  }

  getDataByLevel(metricType: string) {
    let requiredData: any[];

    if (this.levelPage.latam) {
      requiredData = [
        { metricType, subMetricType: 'countries', name: 'countries' },
        { metricType, subMetricType: 'retailers', name: 'retailers' },
        { metricType, subMetricType: 'category', name: 'category1' }
      ]
    } else if (this.levelPage.country) {
      requiredData = [
        { metricType, subMetricType: 'retailers', name: 'retailers' },
        { metricType, subMetricType: 'category', name: 'category1' },
      ]
    } else if (this.levelPage.retailer) {
      requiredData = [
        { metricType: 'traffic', subMetricType: 'category', name: 'category1' },
        { metricType: 'sales', subMetricType: 'category', name: 'category2' }
      ];
    }

    for (let metric of requiredData) {
      const reqStatusObj = this.dataByLevelReqStatus.find(item => item.name === metric.name);
      reqStatusObj.reqStatus = 1;

      this.omnichatService.getDataByMetric(this.levelPage.latam, metric.metricType, metric.subMetricType).subscribe(
        (resp: any[]) => {
          if (metric.metricType === 'traffic') {
            this.dataByLevel[metric.name] = resp.sort((a, b) => (a?.chats < b?.chats ? -1 : 1));
          } else {
            this.dataByLevel[metric.name] = resp.sort((a, b) => (a?.value < b?.value ? -1 : 1));
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          this.dataByLevel[metric.name] = [];
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }

    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
  }

  getSalesByProduct(selectedCategory?: any) {
    this.salesByProductReqStatus = 1;
    this.selectedCategoryTab3 = selectedCategory;
    this.omnichatService.getDataByMetric(this.levelPage.latam, 'conversions', 'products', selectedCategory.id).subscribe(
      (resp: any[]) => {
        this.salesByProduct = resp.sort((a, b) => (a.quantity < b.quantity ? -1 : 1));
        this.salesByProductReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
        this.salesByProductReqStatus = 3;
      }
    )

    this.selectedTab3 = selectedCategory.id;
  }

  getUsersSalesAndCR(selectedCategory?: any) {
    this.usersSalesAndCRReqStatus = 1;
    this.omnichatService.getDataByMetric(this.levelPage.latam, 'conversion-rate', 'month', selectedCategory.id).subscribe(
      (months: any) => {
        const newMonthsObj = {};
        for (let item in months) {
          const date = item.split('-');
          const dateStrFormat = `${convertMonthToString(date[1])} ${date[0]}`;

          const obj = months[item];
          newMonthsObj[dateStrFormat] = obj;
        }

        this.usersSalesAndCR = newMonthsObj;
        this.usersSalesAndCRReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
        this.usersSalesAndCRReqStatus = 3;
      }
    )
  }

  getPerformanceByCategory() {
    this.performanceByCategory.reqStatus = 1;
    this.omnichatService.getDataByMetric(this.levelPage.latam, 'performance-by-category').subscribe(
      (categories: any) => {
        this.performanceByCategory.data = categories.map(item => {
          return { ...item, conversion_rate_yoy: '-', amount_yoy: '-', revenue_yoy: '-' };
        });
        this.performanceByCategory.reqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
        this.performanceByCategory.reqStatus = 3;
      }
    )
  }

  getAudienceByMetric(metricType: string) {
    const requiredData = [
      { subMetricType: 'device', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
      { subMetricType: 'weekday', name: 'weekday' },
      { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
      { subMetricType: 'hour', name: 'hour' }
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.audienceReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.omnichatService.getDataByMetric(this.levelPage.latam, metricType, subMetric.subMetricType).subscribe(
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
          console.error(`[omnichat-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab4 = metricType === 'traffic' ? 1 : 2;
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
    for (let kpi of this.staticData.kpis) {
      if (kpi.metricName.includes('median_chat')) {
        kpi.metricValue = '00:00:00';
      } else if (kpi.metricName === 'chat_score') {
        kpi.metricValue = '0';
        kpi.subMetricValue = '0% - 0/5';
      } else {
        kpi.metricValue = 0;
      }
    }
  }

  clearConversionsRate() {
    for (let kpi of this.staticData.conversionRate) {
      kpi.metricValue = 0;
    }
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
