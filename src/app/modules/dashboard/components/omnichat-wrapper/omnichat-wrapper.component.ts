import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { convertMonthToString, convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { FiltersStateService } from '../../services/filters-state.service';
import { OmnichatService } from '../../services/omnichat.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-omnichat-wrapper',
  templateUrl: './omnichat-wrapper.component.html',
  styleUrls: ['./omnichat-wrapper.component.scss']
})
export class OmnichatWrapperComponent implements OnInit, OnDestroy {
  @Input() selectedLevelPage: any;
  @Input() requestInfoChange: Observable<boolean>;

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
        metricName: 'chats_day_avg',
        metricValue: 0,
        metricFormat: 'percentage'

      },
      {
        metricTitle: '% dedicado al cliente',
        metricName: 'chats_client',
        metricValue: 0,
        metricFormat: 'percentage'
      },
      {
        metricTitle: 'mediana de duración',
        metricName: 'median_duration',
        metricValue: '00:00:00',
        subMetricTitle: 'Esperado',
        subMetricName: 'cr',
        subMetricValue: ''
      },
      {
        metricTitle: 'mediana de retardo',
        metricName: 'median_delay',
        metricValue: '00:00:00',
        subMetricTitle: 'Benchmark',
        subMetricName: 'roas',
        subMetricValue: ''
      },
      {
        metricTitle: 'calificación del chat',
        metricName: 'chat_score',
        metricValue: 0,
        metricFormat: 'score',
        subMetricTitle: 'resultado',
        subMetricName: 'chat_score',
        subMetricValue: '0/5'
      },
      {
        metricTitle: 'usuarios',
        metricName: 'users',
        metricValue: 0,
        metricFormat: 'integer'
      },
      {
        metricTitle: 'conversiones',
        metricName: 'transactions',
        metricValue: 0,
        metricFormat: 'integer',
      },
      {
        metricTitle: 'conversion rate',
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
    conversionRate: [
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
    ]
  };
  staticDataReqStatus = [
    { name: 'kpis', reqStatus: 0 },
    { name: 'conversionRate', reqStatus: 0 },
  ];

  usersAndRevenue: any[] = [];
  usersAndRevenueReqStatus: number = 1;


  dataByLevel = {};
  dataByLevelReqStatus = [
    { name: 'country', reqStatus: 0 },
    { name: 'retailer', reqStatus: 0 },
    { name: 'category1', reqStatus: 0 },
    { name: 'category2', reqStatus: 0 },
  ];

  salesByProduct: any[] = [];
  salesByProductReqStatus: number = 0;

  usersSalesAndCR = {};
  usersSalesAndCRReqStatus: number = 0;

  performanceByCategoryColumns: TableItem[] = [
    {
      name: 'category',
      title: 'Categoría',
    },
    {
      name: 'users',
      title: 'usuarios',
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

  audience = {};
  audienceReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 },
    { name: 'weekday', reqStatus: 0 },
    { name: 'weekdayAndHour', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
  ]

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;

  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;

  // available tabs
  selectedCategories: any[] = []; // for salesByProduct
  selectedCategoryTab3: any;

  constructor(
    private omnichatService: OmnichatService,
    private filtersStateService: FiltersStateService
  ) { }

  ngOnInit(): void {
    this.getAllData();

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.getAllData();
    });
  }

  getAllData() {
    this.selectedCategories = this.filtersStateService.categories;
    const previousCategory = this.selectedCategories.find(category => category.id === this.selectedCategoryTab3?.id);
    const selectedCategory = previousCategory ? previousCategory : this.selectedCategories[0];

    let selectedMetricForTab1 = this.selectedTab1 === 1 ? 'conversions-vs-users' : 'aup-vs-revenue';
    let selectedMetricForTab2 = this.selectedTab2 === 1 ? 'traffic' : 'sales';
    let selectedMetricForTab3 = this.selectedTab3 === 1 ? 'traffic' : 'sales';

    this.getStaticDataByMetric();
    this.getUsersAndRevenue(selectedMetricForTab1);
    this.getDataByLevel(selectedMetricForTab2);
    this.getSalesByProduct(selectedCategory);
    this.getUsersSalesAndCR(selectedCategory);
    this.getPerformanceByCategory();
    this.getAudienceByMetric(selectedMetricForTab3);

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

      this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, metric.metricType, metric.subMtricType).subscribe(
        (resp: any[]) => {
          if (resp?.length < 1) {
            reqStatusObj.reqStatus = 2;
            return;
          }

          if (metric.name === 'conversionRate') {
            for (let i = 0; i < this.staticData.conversionRate.length; i++) {
              const baseObj = resp.find(item => item.name === this.staticData.conversionRate[i].metricName);
              this.staticData.conversionRate[i].metricValue = baseObj.value;
            }
          }
          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[omnichat.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getUsersAndRevenue(metricType: string) {
    this.usersAndRevenueReqStatus = 1;
    this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, metricType).subscribe(
      (resp: any[]) => {
        this.usersAndRevenue = resp;
        this.usersAndRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[omnichat.component]: ${errorMsg}`);
        this.usersAndRevenueReqStatus = 3;
      });

    this.selectedTab1 = metricType === 'conversions-vs-users' ? 1 : 2;
  }

  getDataByLevel(metricType: string) {
    let requiredData: any[];

    if (this.selectedLevelPage.latam) {
      requiredData = [
        { metricType, subMetricType: 'country', name: 'country' },
        { metricType, subMetricType: 'retailer', name: 'retailer' },
        { metricType, subMetricType: 'category', name: 'category1' }
      ]
    } else if (this.selectedLevelPage.country) {
      requiredData = [
        { metricType, subMetricType: 'retailer', name: 'retailer' },
        { metricType, subMetricType: 'category', name: 'category1' },
      ]
    } else if (this.selectedLevelPage.retailer) {
      requiredData = [
        { metricType: 'traffic', subMetricType: 'category', name: 'category1' },
        { metricType: 'sales', subMetricType: 'category', name: 'category2' }
      ];
    }

    for (let metric of requiredData) {
      const reqStatusObj = this.dataByLevelReqStatus.find(item => item.name === metric.name);
      reqStatusObj.reqStatus = 1;

      this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, metric.metricType, metric.subMetricType).subscribe(
        (resp: any[]) => {
          this.dataByLevel[metric.name] = resp;
          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[omnichat.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }

    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
  }

  getSalesByProduct(selectedCategory?: any) {
    this.salesByProductReqStatus = 1;
    this.selectedCategoryTab3 = selectedCategory;
    this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, 'conversions', 'products', selectedCategory.id).subscribe(
      (resp: any[]) => {
        this.salesByProduct = resp.sort((a, b) => (a.quantity < b.quantity ? -1 : 1));
        this.salesByProductReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.salesByProductReqStatus = 3;
      }
    )

    this.selectedTab3 = selectedCategory.id;
  }

  getUsersSalesAndCR(selectedCategory?: any) {
    this.usersSalesAndCRReqStatus = 1;
    this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, 'conversion-rate', 'month', selectedCategory.id).subscribe(
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
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.usersSalesAndCRReqStatus = 3;
      }
    )
  }

  getPerformanceByCategory() {
    this.performanceByCategory.reqStatus = 1;
    this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, 'performance-by-category').subscribe(
      (categories: any) => {
        this.performanceByCategory.data = categories.map(item => {
          return { ...item, conversion_rate_yoy: '-', amount_yoy: '-', revenue_yoy: '-' };
        });
        this.performanceByCategory.reqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
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

    // if (metricType === 'traffic') {
    //   requiredData.push(
    //     { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
    //     { subMetricType: 'hour', name: 'hour' }
    //   )
    // } else {
    //   this.audience['weekdayAndHour'] && delete this.audience['weekdayAndHour'];
    //   this.audience['hour'] && delete this.audience['hour'];
    // }

    for (let subMetric of requiredData) {
      const reqStatusObj = this.audienceReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.omnichatService.getDataByMetric(this.selectedLevelPage.latam, metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {

          if (subMetric.name === 'device' || subMetric.name === 'gender') {
            this.disaggregateMetric(subMetric.name, resp);

          } else if (subMetric.name === 'weekdayAndHour') {
            this.audience['weekdayAndHour'] = resp.map(item => {
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
          console.error(`[audiences-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab3 = metricType === 'traffic' ? 1 : 2;
    }

  }

  disaggregateMetric(subMetric: string, dataRaw: any[]) {
    switch (subMetric) {
      case 'device':
        const desktop = dataRaw.find(item => item.name === 'Desktop');
        const mobile = dataRaw.find(item => item.name === 'Mobile');

        let devicePerc = this.getPercentages(desktop?.value, mobile?.value);

        this.audience['deviceDesktop'] = [
          { name: 'empty', value: devicePerc.perc1 ? 100 - (+devicePerc.perc1) : 100 },
          { name: 'Desktop', value: devicePerc.perc1 ? devicePerc.perc1 : 0 },
        ];

        this.audience['deviceMobile'] = [
          { name: 'empty', value: devicePerc.perc2 ? 100 - (+devicePerc.perc2) : 100 },
          { name: 'Mobile', value: devicePerc.perc2 ? devicePerc.perc2 : 0 },
        ];

        if (!desktop) {
          this.audience['deviceDesktop'] = [];
          return;
        }

        if (!mobile) {
          this.audience['deviceMobile'] = [];
          return;
        }

        break;

      case 'gender':
        const man = dataRaw.find(item => item.name === 'Hombre');
        const woman = dataRaw.find(item => item.name === 'Mujer');

        let genderPerc = this.getPercentages(man?.value, woman?.value);

        this.audience['genderMan'] = [
          { name: 'empty', value: genderPerc.perc1 ? 100 - (+genderPerc.perc1) : 100 },
          { name: 'Hombre', value: genderPerc.perc1 ? genderPerc.perc1 : 0 },
        ];

        this.audience['genderWoman'] = [
          { name: 'empty', value: genderPerc.perc2 ? 100 - (+genderPerc.perc2) : 100 },
          { name: 'Mujer', value: genderPerc.perc2 ? genderPerc.perc2 : 0 },
        ];

        if (!man) {
          this.audience['genderMan'] = [];
        }

        if (!woman) {
          this.audience['genderWoman'] = [];
        }
        break;
    }
  }

  getPercentages(value1: any, value2: any) {
    let total = value1 + value2;
    let perc1 = ((value1 * 100) / total).toFixed(2);
    let perc2 = ((value2 * 100) / total).toFixed(2);
    return { perc1, perc2 };
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
