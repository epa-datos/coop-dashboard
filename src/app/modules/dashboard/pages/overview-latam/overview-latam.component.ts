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

  selectedTab1: number = 1; // sector (1) or category (2) selection -> chart-heat-map
  selectedTab2: number = 2; // traffic (1) or conversions (2) selection -> demographics
  selectedTab3: number = 1; // users vs conversions (1) or investment vs revenue (2) or aup vs revenue (3) selection -> chart-multiple-axes
  selectedTab4: number = 1; // sector (1) or category (2) or source (3) selection ->  chart-multiple-axes
  selectedTab5: number = 1; // subtab (sector, category or source) selection ->  chart-multiple-axes
  selectedTab6: number = 1; // category selection -> generic-table (top products)

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

  demographics = {};

  usersInvOrAupMetrics: string[] = ['sector', 'categoría', 'medio'];
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
  demographicsReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'gender-and-age', reqStatus: 0 }
  ];

  // available tabs
  selectedCategories: any[] = []; // for topProducts and usersInvOrAup
  selectedSectors: any[] = []; // for usersInvOrAup
  selectedSources: any[] = []; // for usersInvOrAup

  selectedCategoryTab1: any // for usersInvOrAup selected tab
  selectedCategoryTab2: any; // for topProducts selected tab
  selectedSectorTab: any;
  selectedSourceTab: any;

  filtersSub: Subscription;
  translateSub: Subscription;
  chartsInitLoad: boolean = true;

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

      this.usersInvOrAupMetrics[0] = this.translate.instant('general.sector').toLowerCase();
      this.usersInvOrAupMetrics[1] = this.translate.instant('general.category').toLowerCase();
      this.usersInvOrAupMetrics[2] = this.translate.instant('general.source').toLowerCase();

      if (this.demographics['men']?.length > 0) {
        this.demographics['men'][1].name = this.translate.instant('others.men');
      }

      if (this.demographics['women']?.length > 0) {
        this.demographics['women'][1].name = this.translate.instant('others.women');
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

    // PRESERVE PREVIOUS SELECTION (TABS)

    // sectors and categories (chart-heat-map)
    const sectorsOrCategoriesMetric = this.selectedTab1 === 1 ? 'sectors' : 'categories';

    // demograhics
    const demohraphicMetric = this.selectedTab2 === 1 ? 'traffic' : 'sales';

    // top products
    const previousCategory2 = this.selectedCategories.find(category => category.id === this.selectedCategoryTab2?.id);

    // users vs conversions | investment vs revenue | revenue vs aup (chart-multiple-axes)
    let previousSector;
    let previousCategory;
    let previousSource;

    if (this.selectedTab5 !== 1) {
      switch (this.selectedTab4) {
        case 1:
          // there's a previous selected sector
          previousSector = this.selectedSectors.find(sector => sector.id === this.selectedSectorTab?.id);
          break;

        case 2:
          // there's a previous selected category
          previousCategory = this.selectedCategories.find(category => category.id === this.selectedCategoryTab1?.id);
          break;

        case 3:
          // there's a previous selected source
          previousSource = this.selectedSources.find(source => source.id === this.selectedSourceTab?.id);
          break;
      }
    }

    const selectedSector = previousSector ? previousSector : null;
    const selectedCategory = previousCategory ? previousCategory : null;
    const selectedSource = previousSource ? previousSource : null;
    const selectedCategory2 = previousCategory2 ? previousCategory2 : this.selectedCategories[0];

    this.getKpis();
    this.getSectorsAndCategories(sectorsOrCategoriesMetric);
    this.getDemographics(demohraphicMetric);
    this.getDataByUsersInvOrAup(null, selectedSector, selectedCategory, selectedSource);
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

  getDemographics(metricType: string) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age']

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.demographicsReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getDemographicsLatam(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.demographics = { ...this.demographics, desktop, mobile };

          } else if (subMetricType === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.demographics = { ...this.demographics, men: hombre, women: mujer };

          } else if (subMetricType === 'gender-and-age') {
            this.demographics['genderByAge'] = resp;

          } else {
            this.demographics[subMetricType] = resp;
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

  getDataByUsersInvOrAup(metricType?: string, sector?: any, category?: any, source?: any) {
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

    this.overviewService.getUsersInvOrAupLatam(metricType, sector?.id, category?.id, source?.id).subscribe(
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

    if (!sector && !category && !source) {
      this.selectedSectorTab = this.selectedSectors[0];
      this.selectedTab5 = 1
    } else {
      this.selectedSectorTab = sector;
      this.selectedCategoryTab1 = category;
      this.selectedSourceTab = source;
    }
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
