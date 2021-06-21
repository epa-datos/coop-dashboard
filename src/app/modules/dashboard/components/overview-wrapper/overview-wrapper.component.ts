import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FiltersStateService } from '../../services/filters-state.service';
import { OverviewService } from '../../services/overview.service';

@Component({
  selector: 'app-overview-wrapper',
  templateUrl: './overview-wrapper.component.html',
  styleUrls: ['./overview-wrapper.component.scss']
})
export class OverviewWrapperComponent implements OnInit, OnDestroy {

  @Input() selectedType: string; // country or retailer
  @Input() requestInfoChange: Observable<boolean>;
  @Input() showTrafficAndSalesSection: boolean = true;

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;

  kpisLegends1 = ['investment', 'clicks', 'bounce_rate', 'transactions', 'revenue']
  kpisLegends2 = ['ctr', 'users', 'cr', 'roas']
  kpis: any[] = [
    {
      metricTitle: 'inversión',
      metricName: 'investment',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'clicks',
      metricName: 'clicks',
      metricValue: 0,
      metricFormat: 'integer',
      subMetricTitle: 'ctr',
      subMetricName: 'ctr',
      subMetricValue: 0,
      subMetricFormat: 'percentage',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'bounce rate',
      metricName: 'bounce_rate',
      metricValue: 0,
      metricFormat: 'percentage',
      subMetricTitle: 'usuarios',
      subMetricName: 'users',
      subMetricValue: 0,
      subMetricFormat: 'integer',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'conversiones',
      metricName: 'transactions',
      metricValue: 0,
      metricFormat: 'integer',
      subMetricTitle: 'CR',
      subMetricName: 'cr',
      subMetricValue: 0,
      subMetricFormat: 'percentage',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      subMetricTitle: 'roas',
      subMetricName: 'roas',
      subMetricValue: 0,
      subMetricFormat: 'decimals',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#fbc001'
    }
  ];

  selectedSectors: any[] = [];
  selectedSectorTab: any;
  categoriesBySector: any[] = [];
  trafficAndSales = {};

  usersAndSalesBySector: any[] = [];
  investmentVsRevenue: any[] = [];

  // requests status
  kpisReqStatus: number = 0;
  categoriesReqStatus: number = 0;
  usersAndSalesReqStatus: number = 0;
  invVsRevenueReqStatus: number = 0;
  trafficSalesReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'gender-and-age', reqStatus: 0 }
  ];

  requestInfoSub: Subscription;
  chartsInitLoad: boolean = true;

  /// DATA MOCK
  /// DATA MOCK
  trafficVsConversionsM = [{
    date: '2021-06-02',
    traffic: 434,
    conversions: 15,
  }, {
    date: '2021-06-03',
    traffic: 634,
    conversions: 25,
  }, {
    date: '2021-06-04',
    traffic: 574,
    conversions: 20,
  }, {
    date: '2021-06-05',
    traffic: 615,
    conversions: 16,
  }, {
    date: '2021-06-06',
    traffic: 732,
    conversions: 5,
  }, {
    date: '2021-06-07',
    traffic: 1412,
    conversions: 32,
  }, {
    date: '2021-06-08',
    traffic: 716,
    conversions: 11,
  }, {
    date: '2021-06-09',
    traffic: 3710,
    conversions: 22,
  }, {
    date: '2021-06-10',
    traffic: 1298,
    conversions: 66,
  }, {
    date: '2021-06-11',
    traffic: 816,
    conversions: 39,
  }, {
    date: '2021-06-12',
    traffic: 1963,
    conversions: 43,
  }, {
    date: '2021-06-13',
    traffic: 1809,
    conversions: 29,
  }, {
    date: '2021-06-14',
    traffic: 1434,
    conversions: 36,
  }, {
    date: '2021-06-15',
    traffic: 2359,
    conversions: 16,
  }, {
    date: '2021-06-16',
    traffic: 2114,
    conversions: 66,
  }];

  investmentVsRevenueM = [
    {
      date: '2021-06-02',
      investment: 4516.232,
      revenue: 34977,
    }, {
      date: '2021-06-03',
      investment: 3816.232,
      revenue: 15977,
    }, {
      date: '2021-06-04',
      investment: 3717.643,
      revenue: 12677,
    }, {
      date: '2021-06-05',
      investment: 4723.765,
      revenue: 24141,
    }, {
      date: '2021-06-06',
      investment: 4205.837,
      revenue: 24172,
    }, {
      date: '2021-06-07',
      investment: 4326.599,
      revenue: 11498,
    }, {
      date: '2021-06-08',
      investment: 2485.788,
      revenue: 43770,
    }, {
      date: '2021-06-09',
      investment: 3710.785,
      revenue: 20874,
    }, {
      date: '2021-06-10',
      investment: 2816.232,
      revenue: 25977.84,
    }, {
      date: '2021-06-11',
      investment: 3517.643,
      revenue: 1375.64,
    }, {
      date: '2021-06-12',
      investment: 4923.765,
      revenue: 35541.75,
    }, {
      date: '2021-06-13',
      investment: 7205.837,
      revenue: 58172.32,
    }, {
      date: '2021-06-14',
      investment: 2121.599,
      revenue: 23498.33,
    }, {
      date: '2021-06-15',
      investment: 3585.788,
      revenue: 13770.55,
    }, {
      date: '2021-06-16',
      investment: 3850.785,
      revenue: 40874.56,
    }
  ]

  aupVsRevenueM = [{
    date: '2021-06-02',
    revenue: 4816.232,
    aup: 35977,
  }, {
    date: '2021-06-03',
    revenue: 3816.232,
    aup: 35977,
  }, {
    date: '2021-06-04',
    revenue: 3717.643,
    aup: 22677,
  }, {
    date: '2021-06-05',
    revenue: 4723.765,
    aup: 25541,
  }, {
    date: '2021-06-06',
    revenue: 4205.837,
    aup: 28172,
  }, {
    date: '2021-06-07',
    revenue: 4326.599,
    aup: 26498,
  }, {
    date: '2021-06-08',
    revenue: 2585.788,
    aup: 43770,
  }, {
    date: '2021-06-09',
    revenue: 4710.785,
    aup: 40874,
  }, {
    date: '2021-06-10',
    revenue: 2116.232,
    aup: 35977,
  }, {
    date: '2021-06-11',
    revenue: 3517.643,
    aup: 22677,
  }, {
    date: '2021-06-12',
    revenue: 8923.765,
    aup: 25541,
  }, {
    date: '2021-06-13',
    revenue: 6205.837,
    aup: 28172,
  }, {
    date: '2021-06-14',
    revenue: 2326.599,
    aup: 26498,
  }, {
    date: '2021-06-15',
    revenue: 3585.788,
    aup: 43770,
  }, {
    date: '2021-06-16',
    revenue: 4850.785,
    aup: 40874,
  }];

  usersAndSalesMetrics: string[] = ['sector', 'categoría', 'medio'];
  // available tabs
  selectedCategories: any[] = []; // for topProducts and usersAndSalesByMetric
  selectedSources: any[] = []; // for usersAndSalesByMetric
  selectedCategoryTab1;
  selectedSourceTab;

  selectedTab4;
  selectedTab5;

  // selectedSectorsTab = ['Todo', 'Sarach', 'Mrketing', 'Ventas'];
  // this.selectedCategories = ['Todo', 'PS', 'HW Print', 'Supplies'];
  // this.selectedSources = ['Google', 'Social', 'Email', 'Display']

  constructor(
    private filtersStateService: FiltersStateService,
    private overviewService: OverviewService
  ) { }

  ngOnInit(): void {
    if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
      // removed line and used it from country & retailer components (init)
      // this.filtersStateService.restoreFilters();
      this.getAllData();
    }

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.getAllData(manualChange);
    })
  }

  getAllData(preserveSelectedTabs?: boolean) {
    this.selectedSectors = this.filtersStateService.sectors;
    this.selectedCategories = this.filtersStateService.categories;
    this.selectedSources = [
      { id: 1, name: 'Google' },
      { id: 2, name: 'Social' },
      { id: 3, name: 'Email' },
      { id: 4, name: 'Display' }
    ]
    let selectedSector;
    let trafficOrSales;
    let usersOrSales;

    selectedSector = this.selectedSectors[0];
    trafficOrSales = 'traffic';
    usersOrSales = 'users';

    this.selectedTab4 = 1;
    this.selectedTab5 = 1;


    if (!preserveSelectedTabs) {
      selectedSector = this.selectedSectors[0];
      trafficOrSales = 'traffic';
      usersOrSales = 'users';
    } else {
      const previousSector = this.selectedSectors.find(sector => sector.id === this.selectedSectorTab.id);
      const previousCategory = this.selectedCategories.find(category => category.id === this.selectedCategoryTab1?.id);
      const previousSource = this.selectedSources.find(source => source.id === this.selectedSourceTab?.id);
      selectedSector = previousSector ? previousSector : this.selectedSectors[0];
      trafficOrSales = this.selectedTab2 === 1 ? 'traffic' : 'sales';
      usersOrSales = this.selectedTab3 === 1 ? 'users' : 'sales';
    }

    this.getKpis();
    this.getCategoriesBySector(selectedSector);
    this.getDataByTrafficAndSales(trafficOrSales);
    this.getDataByUsersAndSales(usersOrSales);
    this.getInvestmentVsRevenue();

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.overviewService.getKpis().subscribe(
      (resp: any[]) => {
        const kpis1 = resp.filter(kpi => this.kpisLegends1.includes(kpi.string));
        const kpis2 = resp.filter(kpi => this.kpisLegends2.includes(kpi.string));

        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = this.kpis[i];
          baseObj.metricValue = kpis1[i]['value'];

          if (i !== 0 && kpis2[i - 1]) {
            baseObj.subMetricValue = kpis2[i - 1]['value'];
          }

        }
        this.kpisReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getCategoriesBySector(selectedSector: any) {
    this.categoriesReqStatus = 1;
    this.selectedSectorTab = selectedSector;
    this.overviewService.getCategoriesBySector(selectedSector?.name).subscribe(
      (resp: any[]) => {
        this.categoriesBySector = resp;
        this.categoriesReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.categoriesReqStatus = 3;
      });

    // Tabs are only used for country view
    this.selectedTab1 = selectedSector.id;
  }

  getDataByTrafficAndSales(metricType: string) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age']

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.trafficSalesReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getTrafficAndSales(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'device' || subMetricType === 'gender') {
            this.disaggregateMetric(subMetricType, resp);
          } else if (subMetricType === 'gender-and-age') {
            this.trafficAndSales['genderByAge'] = resp;
          } else {
            this.trafficAndSales[subMetricType] = resp;
          }
          reqStatusObj.reqStatus = 2;

        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[overview-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
    }
  }

  getDataByUsersAndSales(metricType: string) {
    this.usersAndSalesReqStatus = 1;
    this.overviewService.getUsersAndSales(metricType).subscribe(
      (resp: any[]) => {
        this.usersAndSalesBySector = resp;
        this.usersAndSalesReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.usersAndSalesReqStatus = 3;
      }
    )

    this.selectedTab3 = metricType === 'users' ? 1 : 2;
  }

  getInvestmentVsRevenue() {
    this.invVsRevenueReqStatus = 1;
    this.overviewService.getInvestmentVsRevenue().subscribe(
      (resp: any[]) => {
        this.investmentVsRevenue = resp;
        this.invVsRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.invVsRevenueReqStatus = 3;
      }
    )
  }

  disaggregateMetric(subMetric: string, dataRaw: any[]) {
    switch (subMetric) {
      case 'device':
        const desktop = dataRaw.find(item => item.name === 'Desktop');
        const mobile = dataRaw.find(item => item.name === 'Mobile');

        let devicePerc = this.getPercentages(desktop?.value, mobile?.value);

        if (desktop) {
          this.trafficAndSales['deviceDesktop'] = [
            { name: 'empty', value: devicePerc.perc1 ? 100 - (+devicePerc.perc1) : 100 },
            { name: 'Desktop', value: devicePerc.perc1 ? devicePerc.perc1 : 0, rawValue: desktop.value },
          ];
        } else {
          this.trafficAndSales['deviceDesktop'] = [];
        }

        if (mobile) {
          this.trafficAndSales['deviceMobile'] = [
            { name: 'empty', value: devicePerc.perc2 ? 100 - (+devicePerc.perc2) : 100 },
            { name: 'Mobile', value: devicePerc.perc2 ? devicePerc.perc2 : 0, rawValue: mobile.value },
          ];
        } else {
          this.trafficAndSales['deviceMobile'] = [];
        }

        break;

      case 'gender':
        const man = dataRaw.find(item => item.name === 'Hombre');
        const woman = dataRaw.find(item => item.name === 'Mujer');

        let genderPerc = this.getPercentages(man?.value, woman?.value);

        if (man) {
          this.trafficAndSales['genderMan'] = [
            { name: 'empty', value: genderPerc.perc1 ? 100 - (+genderPerc.perc1) : 100 },
            { name: 'Hombre', value: genderPerc.perc1 ? genderPerc.perc1 : 0, rawValue: man.value },
          ];
        } else {
          this.trafficAndSales['genderMan'] = [];
        }

        if (woman) {
          this.trafficAndSales['genderWoman'] = [
            { name: 'empty', value: genderPerc.perc2 ? 100 - (+genderPerc.perc2) : 100 },
            { name: 'Mujer', value: genderPerc.perc2 ? genderPerc.perc2 : 0, rawValue: woman.value },
          ];
        } else {
          this.trafficAndSales['genderWoman'] = [];
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

  clearUsersAndSalesTabs() {
    this.selectedSectorTab && delete this.selectedSectorTab;
    this.selectedCategoryTab1 && delete this.selectedCategoryTab1;
    this.selectedSourceTab && delete this.selectedSourceTab;
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
