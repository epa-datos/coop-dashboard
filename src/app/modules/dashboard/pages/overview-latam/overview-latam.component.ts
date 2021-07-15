import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FiltersStateService } from '../../services/filters-state.service';
import { OverviewService } from '../../services/overview.service';
import { TableItem } from '../../components/generic-table/generic-table.component';
import { TranslateService } from '@ngx-translate/core';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { KpiCard } from 'src/app/models/kpi';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-overview-latam',
  templateUrl: './overview-latam.component.html',
  styleUrls: ['./overview-latam.component.scss']
})
export class OverviewLatamComponent implements OnInit, OnDestroy {
  activeTabView = 1;

  selectedTab1: number = 1; // sector (1) or category (2) selection -> chart-heat-map
  selectedTab2: number = 2; // traffic (1) or conversions (2) selection -> trafficOrSales
  selectedTab3: number = 1; // users vs conversions (1) or investment vs revenue (2) or aup vs revenue (3) selection -> chart-multiple-axes
  selectedTab4: number = 1; // sector (1) or category (2) or source (3) selection ->  chart-multiple-axes
  selectedTab5: number = 1; // category selection -> generic-table (top products)

  selectionList: number[] = [1];

  kpisLegends1 = ['investment', 'clicks', 'bounce_rate', 'transactions', 'revenue'] // main kpis
  kpisLegends2 = ['ctr', 'users', 'cr', 'roas', 'aup']; // sub kpis
  kpis: KpiCard[] = [
    {
      title: 'inversión',
      name: 'investment',
      value: 0,
      format: 'decimal',
      symbol: 'USD',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      title: 'clicks',
      name: 'clicks',
      value: 0,
      format: 'integer',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998',
      subKpis: [
        {
          title: 'ctr',
          name: 'ctr',
          value: 0,
          format: 'percentage',
        }
      ]
    },
    {
      title: 'bounce rate',
      name: 'bounce_rate',
      value: 0,
      format: 'percentage',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc',
      subKpis: [
        {
          title: 'usuarios',
          name: 'users',
          value: 0,
          format: 'integer',
        }
      ]
    },
    {
      title: 'conversiones',
      name: 'transactions',
      value: 0,
      format: 'integer',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934',
      subKpis: [
        {
          title: 'CR',
          name: 'cr',
          value: 0,
          format: 'percentage',
        }
      ]
    },
    {
      title: 'revenue',
      name: 'revenue',
      value: 0,
      format: 'decimal',
      symbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#fbc001',
      subKpis: [
        {
          title: 'roas',
          name: 'roas',
          value: 0,
          format: 'decimal',
        },
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

  categoriesBySector: any[] = [];

  trafficOrSales = {};

  usersInvOrAupMetrics: string[] = ['sector', 'categoría', 'fuente'];
  usersInvOrAup: any[] = [];

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
  usersInvOrAupReqStatus: number = 0;
  invVsRevenueReqStatus: number = 0;
  trafficOrSalesReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 },
    { name: 'weekdayAndHour', reqStatus: 0 }
  ];

  // available tabs
  selectedCategories: any[] = []; // for topProducts and usersInvOrAup
  selectedSectors: any[] = []; // for usersInvOrAup
  selectedSources: any[] = []; // for usersInvOrAup

  selectedCategoryTab2: any; // for topProducts selected tab

  selectedCategoriesTab: any[] = [] // for usersInvOrAup selected tab
  selectedSectorsTab: any[] = [];
  selectedSourcesTab: any[] = [];

  filtersSub: Subscription;
  translateSub: Subscription;
  chartsInitLoad: boolean = true;


  constructor(
    private filtersStateService: FiltersStateService,
    private appStateService: AppStateService,
    private overviewService: OverviewService,
    private translate: TranslateService
  ) {

    this.translateSub = translate.stream('overviewLatam').subscribe(() => {
      this.kpis[0].title = this.translate.instant('kpis.investment');
      this.kpis[2].subKpis[0].title = this.translate.instant('general.users');
      this.kpis[3].title = this.translate.instant('kpis.transactions');

      this.topProductsColumns[0].title = this.translate.instant('general.ranking');
      this.topProductsColumns[1].title = this.translate.instant('general.product');
      this.topProductsColumns[2].title = this.translate.instant('general.amount');

      this.usersInvOrAupMetrics[0] = this.translate.instant('general.sector').toLowerCase();
      this.usersInvOrAupMetrics[1] = this.translate.instant('general.category').toLowerCase();
      this.usersInvOrAupMetrics[2] = this.translate.instant('general.source').toLowerCase();

      if (this.trafficOrSales['men']?.length > 0) {
        this.trafficOrSales['men'][1].name = this.translate.instant('others.men');
      }

      if (this.trafficOrSales['women']?.length > 0) {
        this.trafficOrSales['women'][1].name = this.translate.instant('others.women');
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
      this.appStateService.selectedPage === 'overview' && this.getAllData();
    });
  }

  getAllData() {
    this.selectedSectors = this.filtersStateService.sectors;
    this.selectedCategories = this.filtersStateService.categories;
    this.selectedSources = this.filtersStateService.sources;

    // PRESERVE PREVIOUS SELECTION (TABS)

    // sectors and categories (chart-heat-map)
    const sectorsOrCategoriesMetric = this.selectedTab1 === 1 ? 'sectors' : this.selectedTab1 === 2 ? 'categories' : 'funds';

    // demograhics
    const demohraphicMetric = this.selectedTab2 === 1 ? 'traffic' : 'sales';

    // top products
    const previousCategory2 = this.selectedCategories.find(category => category.id === this.selectedCategoryTab2?.id);

    // users vs conversions | investment vs revenue | revenue vs aup (chart-multiple-axes)
    let previousSectors;
    let previousCategories;
    let previousSources;

    switch (this.selectedTab4) {
      case 1:
        // there's previous selected sectors
        previousSectors = this.selectedSectors.filter(sector => this.selectedSectorsTab?.includes(sector.id));
        break;

      case 2:
        // there's previous selected categories
        previousCategories = this.selectedCategories.filter(category => this.selectedCategoriesTab?.includes(category.id));
        break;

      case 3:
        // there's previous selected sources
        previousSources = this.selectedSources.filter(source => this.selectedSourcesTab?.includes(source.id));
        break;
    }

    this.selectedSectorsTab = previousSectors?.map(item => item.id);
    this.selectedCategoriesTab = previousCategories?.map(item => item.id);
    this.selectedSourcesTab = previousSources?.map(item => item.id);

    const selectedCategoryTab = previousCategory2 ? previousCategory2 : this.selectedCategories[0];

    this.getKpis();
    this.getSectorsAndCategories(sectorsOrCategoriesMetric);
    this.getTrafficOrSales(demohraphicMetric);
    this.getDataByUsersInvOrAup(null, this.selectedSectorsTab, this.selectedCategoriesTab, this.selectedSourcesTab);
    this.getTopProducts(selectedCategoryTab);

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
          baseObj.value = kpis1[i]['value'];

          if (i !== 0 && kpis2[i - 1]) {
            baseObj.subKpis[0].value = kpis2[i - 1]['value'];
          }

          if (this.kpis[i].name === 'revenue' && this.kpis[i].subKpis[1]) {
            baseObj.subKpis[1].value = resp.find(kpi => kpi.string === 'aup')?.value;
          }
        }

        this.kpisReqStatus = 2;
      },
      error => {
        this.clearKpis();
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

    this.selectedTab1 = metricType === 'sectors' ? 1 : metricType === 'categories' ? 2 : 3;
  }

  getTrafficOrSales(metricType: string) {
    const requiredData = [
      { subMetricType: 'device', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
      { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.trafficOrSalesReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getTrafficOrSalesLatam(metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetric.name === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.trafficOrSales = { ...this.trafficOrSales, desktop, mobile };

          } else if (subMetric.name === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.trafficOrSales = { ...this.trafficOrSales, men: hombre, women: mujer };

          } else if (subMetric.name === 'weekdayAndHour') {
            this.trafficOrSales[subMetric.name] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });

          } else {
            this.trafficOrSales[subMetric.name] = resp;
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

  multipleSelectorChange(option: string, selectedIds: any[]) {
    let originalItemsLength;

    switch (option) {
      case 'sectors':
        this.selectedSectorsTab = selectedIds;
        originalItemsLength = this.selectedSectors.length;
        break;

      case 'categories':
        this.selectedCategoriesTab = selectedIds;
        originalItemsLength = this.selectedCategories.length;
        break;


      case 'sources':
        this.selectedSourcesTab = selectedIds;
        originalItemsLength = this.selectedSources.length;
        break;
    }

    this.getDataByUsersInvOrAup(null, this.selectedSectorsTab, this.selectedCategoriesTab, this.selectedSourcesTab);
  }

  getDataByUsersInvOrAup(metricType?: string, sectors?: any, categories?: any, sources?: any) {

    this.usersInvOrAupReqStatus = 1;

    if (metricType) {
      // for main tabs interactions
      // use current selection (metricType value) to define selectedTab3
      this.selectedTab3 = metricType === 'users-vs-conversions' ? 1 : metricType === 'investment-vs-revenue' ? 2 : 3;
    } else {
      // for init, filtersChange event or sub tabs interactions
      // use current selection (selectTab3 value) to define metricType
      metricType = this.selectedTab3 === 1 ? 'users-vs-conversions' : this.selectedTab3 === 2 ? 'investment-vs-revenue' : 'aup-vs-revenue';
    }

    this.overviewService.getUsersInvOrAupLatam(metricType, sectors, categories, sources).subscribe(
      (resp: any[]) => {
        this.usersInvOrAup = resp;
        this.usersInvOrAupReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-latam.component]: ${errorMsg}`);
        this.usersInvOrAupReqStatus = 3;
      }
    );

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

    this.selectedTab5 = selectedCategory.id;
  }

  clearSubtabsSelection() {
    this.selectedSectorsTab && delete this.selectedSectorsTab;
    this.selectedCategoriesTab && delete this.selectedCategoriesTab;
    this.selectedSourcesTab && delete this.selectedSourcesTab;
  }

  clearKpis() {
    for (let kpi of this.kpis) {
      kpi.value = 0;

      kpi.subKpis?.forEach(item => {
        item.value = 0;
      });
    }
  }

  ngOnDestroy() {
    this.filtersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
