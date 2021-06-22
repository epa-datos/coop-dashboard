import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FiltersStateService } from '../../services/filters-state.service';
import { OverviewService } from '../../services/overview.service';
import { TableItem } from '../../components/generic-table/generic-table.component';
import { TranslateService } from '@ngx-translate/core';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';

@Component({
  selector: 'app-overview-latam',
  templateUrl: './overview-latam.component.html',
  styleUrls: ['./overview-latam.component.scss']
})
export class OverviewLatamComponent implements OnInit, OnDestroy {

  activeTabView = 1;

  selectedTab1: number = 1;
  selectedTab2: number = 2;
  selectedTab3: number = 1;
  selectedTab4: number = 1;
  selectedTab5: number = 1;
  selectedTab6: number = 1;

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

  categoriesBySector: any[] = [];
  trafficAndSales = {};

  usersAndSalesMetrics: string[] = ['sector', 'categoría', 'medio'];
  usersAndSalesByMetric: any[] = [];
  investmentVsRevenue: any[] = [];

  // top products
  topProductsColumns: TableItem[] = [
    {
      name: 'rank',
      title: 'Posición',
      tooltip: true,
    },
    {
      name: 'product',
      title: 'Producto',
      tooltip: true,
    },
    {
      name: 'amount',
      title: 'Cantidad',
      textAlign: 'center',
      formatValue: 'integer'
    }
  ];

  topProducts = {
    data: [],
    reqStatus: 0
  }

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

  // available tabs
  selectedCategories: any[] = []; // for topProducts and usersAndSalesByMetric
  selectedSectors: any[] = []; // for usersAndSalesByMetric
  selectedSources: any[] = []; // for usersAndSalesByMetric

  selectedCategoryTab1: any // for usersAndSalesByMetric selected tab
  selectedCategoryTab2: any; // for topProducts selected tab
  selectedSectorTab: any;
  selectedSourceTab: any;

  filtersSub: Subscription;
  translateSub: Subscription;
  chartsInitLoad: boolean = true;

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

  constructor(
    private filtersStateService: FiltersStateService,
    private overviewService: OverviewService,
    private translate: TranslateService
  ) {

    this.translateSub = translate.stream('overviewLatam').subscribe(() => {
      this.kpis[0].metricTitle = this.translate.instant('kpis.investment');
      this.kpis[2].subMetricTitle = this.translate.instant('general.users');
      this.kpis[3].metricTitle = this.translate.instant('kpis.transactions');

      this.topProductsColumns[0].title = this.translate.instant('general.ranking');
      this.topProductsColumns[1].title = this.translate.instant('general.product');
      this.topProductsColumns[2].title = this.translate.instant('general.amount');

      this.usersAndSalesMetrics[0] = this.translate.instant('general.sector').toLowerCase();
      this.usersAndSalesMetrics[1] = this.translate.instant('general.category').toLowerCase();
      this.usersAndSalesMetrics[2] = this.translate.instant('general.source').toLowerCase();

      if (this.trafficAndSales['men']?.length > 0) {
        this.trafficAndSales['men'][1].name = this.translate.instant('others.men');
      }

      if (this.trafficAndSales['women']?.length > 0) {
        this.trafficAndSales['women'][1].name = this.translate.instant('others.women');
      }
    });
  }

  ngOnInit(): void {
    if (this.filtersStateService.countries &&
      this.filtersStateService.retailers &&
      this.filtersStateService.period &&
      this.filtersStateService.sectors &&
      this.filtersStateService.categories &&
      this.filtersStateService.sources) {

      this.filtersStateService.restoreFilters();
      this.getAllData();
    }

    this.filtersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.selectedSectors = this.filtersStateService.sectors;
    this.selectedCategories = this.filtersStateService.categories;
    this.selectedSources = this.filtersStateService.sources;

    const sectorOrCategory = this.selectedTab1 === 1 ? 'sectors' : 'categories';
    const trafficOrSales = this.selectedTab2 === 1 ? 'traffic' : 'sales';
    const usersOrSales = this.selectedTab3 === 1 ? 'users' : 'sales';

    const previousSector = this.selectedSectors.find(sector => sector.id === this.selectedSectorTab?.id);
    const previousCategory = this.selectedCategories.find(category => category.id === this.selectedCategoryTab1?.id);
    const previousSource = this.selectedSources.find(source => source.id === this.selectedSourceTab?.id);
    const previousCategory2 = this.selectedCategories.find(category => category.id === this.selectedCategoryTab2?.id);

    const selectedSector = previousSector ? previousSector : null;
    const selectedCategory = previousCategory ? previousCategory : null;
    const selectedSources = previousSource ? previousSource : null;
    const selectedCategory2 = previousCategory2 ? previousCategory2 : this.selectedCategories[0];

    this.getKpis();
    this.getSectorsAndCategories(sectorOrCategory);
    this.getDataByTrafficAndSales(trafficOrSales);
    this.getDataByUsersAndSales(usersOrSales, selectedSector, selectedCategory, selectedSources);

    this.getInvestmentVsRevenue();
    this.getTopProducts(selectedCategory2);

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.overviewService.getKpisLatam().subscribe(
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
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getSectorsAndCategories(metricType: string) {
    this.categoriesReqStatus = 1;
    this.overviewService.getSectorsAndCategoriesLatam(metricType).subscribe(
      (resp: any[]) => {
        this.categoriesBySector = resp;
        this.categoriesReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.categoriesReqStatus = 3;
      });

    this.selectedTab1 = metricType === 'sectors' ? 1 : 2;
  }

  getDataByTrafficAndSales(metricType: string) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age']

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.trafficSalesReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getTrafficAndSalesLatam(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.trafficAndSales = { ...this.trafficAndSales, desktop, mobile };

          } else if (subMetricType === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre[1].name = this.translate.instant('others.men');
            mujer[1].name = this.translate.instant('others.women');

            this.trafficAndSales = { ...this.trafficAndSales, men: hombre, women: mujer };

          } else if (subMetricType === 'gender-and-age') {
            this.trafficAndSales['genderByAge'] = resp;

          } else {
            this.trafficAndSales[subMetricType] = resp;
          }

          reqStatusObj.reqStatus = 2;

        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[overview-latam.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });

      this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
    }
  }

  getDataByUsersAndSales(metricType: string, sector?: any, category?: any, source?: any) {
    this.usersAndSalesReqStatus = 1;

    this.overviewService.getUsersAndSalesLatam(metricType, sector?.id, category?.id, source?.id).subscribe(
      (resp: any[]) => {
        // this.usersAndSalesByMetric = resp;
        this.usersAndSalesByMetric = resp.filter(serie => +serie.name >= 2021);
        this.usersAndSalesReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.usersAndSalesReqStatus = 3;
      }
    )
    this.selectedTab3 = metricType === 'users' ? 1 : 2;

    if (!sector && !category && !source) {
      this.selectedSectorTab = this.selectedSectors[0];
      this.selectedTab5 = 1
    } else {
      this.selectedSectorTab = sector;
      this.selectedCategoryTab1 = category;
      this.selectedSourceTab = source;
    }
  }

  getInvestmentVsRevenue() {
    this.invVsRevenueReqStatus = 1;
    this.overviewService.getInvestmentVsRevenueLatam().subscribe(
      (resp: any[]) => {
        this.investmentVsRevenue = resp;
        this.invVsRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.invVsRevenueReqStatus = 3;
      }
    )
  }

  getTopProducts(selectedCategory?: any) {
    this.topProducts.reqStatus = 1;
    this.selectedCategoryTab2 = selectedCategory;
    this.overviewService.getTopProductsLatam(selectedCategory.id).subscribe(
      (resp: any[]) => {
        this.topProducts.data = resp;
        this.topProducts.reqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.topProducts.reqStatus = 3;
      }
    )

    this.selectedTab6 = selectedCategory.id;
  }

  clearUsersAndSalesTabs() {
    this.selectedSectorTab && delete this.selectedSectorTab;
    this.selectedCategoryTab1 && delete this.selectedCategoryTab1;
    this.selectedSourceTab && delete this.selectedSourceTab;
  }

  ngOnDestroy() {
    this.filtersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
