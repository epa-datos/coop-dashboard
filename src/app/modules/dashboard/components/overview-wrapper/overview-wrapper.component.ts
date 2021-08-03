import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { KpiCard } from 'src/app/models/kpi';
import { AppStateService } from 'src/app/services/app-state.service';
import { SOURCES } from 'src/app/tools/constants/filters';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertWeekdayToString } from 'src/app/tools/functions/data-convert';
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

  selectedTab1: number = 1; // sector (1) or category (2) selection -> chart-heat-map
  selectedTab2: number = 2; // traffic (1) or conversions (2) selection -> trafficOrSales
  selectedTab3: number = 1; // users vs conversions (1) or investment vs revenue (2) or aup vs revenue (3) selection -> chart-multiple-axes
  selectedTab4: number = 1; // sector (1) or category (2) or source (3) selection ->  chart-multiple-axes

  kpisLegends1 = ['investment', 'clicks', 'bounce_rate', 'transactions', 'revenue']
  kpisLegends2 = ['ctr', 'users', 'cr', 'roas', 'aup'];
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

  // available tabs for usersInvOrAup
  selectedCategories: any[] = [];
  selectedSectors: any[] = [];
  selectedSources: any[] = [];

  // for usersInvOrAup selected tab
  selectedSectorsTab: any;
  selectedCategoriesTab: any
  selectedSourcesTab: any;

  // for categoriesBySector (heatmap) selected tab
  selectedSectorTabHM: any;

  requestInfoSub: Subscription;
  chartsInitLoad: boolean = true;

  constructor(
    private filtersStateService: FiltersStateService,
    private appStateService: AppStateService,
    private overviewService: OverviewService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    let loadedFromInit: boolean; // first call to getAllData is from init
    let firstTimeSub: boolean = true; // first time requestInfoSub listen a change

    if (this.filtersAreReady()) {
      this.getAllData();

      // use loadedFromInit to avoid repeated calls to getAllData()
      // when dashboard component is loaded for first time
      // (e.g after page refresh or be redirected from other component that doesn't belong to to dashboard module)
      loadedFromInit = true
    }

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      // avoid repeated call to getAllData()
      if (loadedFromInit && firstTimeSub && !manualChange) {
        firstTimeSub = false;
        return;
      }

      firstTimeSub = false;
      loadedFromInit = false;


      if (this.appStateService.selectedPage === 'overview' && this.filtersAreReady() && !loadedFromInit) {
        this.getAllData(manualChange);
      }
    });
  }

  getAllData(preserveSelectedTabs?: boolean) {
    this.selectedSectors = this.filtersStateService.sectors;
    this.selectedCategories = this.filtersStateService.categories;

    // for country view selected sources in general filters are used
    if (this.selectedType === 'country') {
      this.selectedSources = this.filtersStateService.sources;

    } else if (this.selectedType === 'retailer') {
      // for retailer view all valid sources are used because sources filter isn't shown 
      this.selectedSources = SOURCES;
    }

    let selectedSectorHM;
    let demographicMetric;

    if (!preserveSelectedTabs) {
      selectedSectorHM = this.selectedSectors[0];
      demographicMetric = 'traffic';

      // tabs for users vs conversions | investment vs revenue | revenue vs aup (chart-multiple-axes)
      this.selectedTab3 = 1;
      this.selectedTab4 = 1;

    } else {
      // PRESERVE PREVIOUS SELECTION (TABS)

      // sectors heatmap
      const previousSectorHM = this.selectedSectors.find(sector => sector.id === this.selectedSectorTabHM.id);
      selectedSectorHM = previousSectorHM ? previousSectorHM : this.selectedSectors[0];

      // demograhics
      demographicMetric = this.selectedTab2 === 1 ? 'traffic' : 'sales';

      // users vs conversions | investment vs revenue | revenue vs aup (chart-multiple-axes)
      let previousSectors;
      let previousCategories;
      let previousSources;

      switch (this.selectedTab4) {
        case 1:
          // there's a previous selected sector
          previousSectors = this.selectedSectors.filter(sector => this.selectedSectorsTab?.includes(sector.id));
          break;

        case 2:
          // there's a previous selected category
          previousCategories = this.selectedCategories.filter(category => this.selectedCategoriesTab?.includes(category.id));
          break;

        case 3:
          // there's a previous selected source
          previousSources = this.selectedSources.filter(source => this.selectedSourcesTab?.includes(source.id));
          break;
      }

      this.selectedSectorsTab = previousSectors?.map(item => item.id);
      this.selectedCategoriesTab = previousCategories?.map(item => item.id);
      this.selectedSourcesTab = previousSources?.map(item => item.id);
    }

    this.getKpis();
    this.getCategoriesBySector(selectedSectorHM);
    this.getTrafficOrSales(demographicMetric);
    this.getDataByUsersInvOrAup(null, this.selectedSectorsTab, this.selectedCategoriesTab, this.selectedSourcesTab);

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
          baseObj.value = kpis1[i]['value'];

          if (i !== 0 && kpis2[i - 1]) {
            baseObj.subKpis[0].value = kpis2[i - 1]['value'];
          }

          if (this.kpis[i].name === 'revenue' && this.kpis[i].subKpis[1]) {
            this.kpis[i].subKpis[1].value = resp.find(kpi => kpi.string === 'aup')?.value;
          }
        }

        this.kpisReqStatus = 2;
      },
      error => {
        this.clearKpis();
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getCategoriesBySector(selectedSector: any) {
    this.categoriesReqStatus = 1;
    this.selectedSectorTabHM = selectedSector;
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
      this.overviewService.getTrafficOrSales(metricType, subMetric.subMetricType).subscribe(
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
          console.error(`[overview-wrapper.component]: ${errorMsg}`);
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

    this.overviewService.getUsersInvOrAup(metricType, sectors, categories, sources).subscribe(
      (resp: any[]) => {
        this.usersInvOrAup = resp;
        this.usersInvOrAupReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.usersInvOrAupReqStatus = 3;
      }
    )
  }

  filtersAreReady(): boolean {
    if (!this.filtersStateService.sectors ||
      !this.filtersStateService.categories ||
      !this.filtersStateService.period
    ) {
      return false;
    }

    if (this.selectedType === 'country' &&
      this.filtersStateService.sources) {
      return true;
    }

    if (this.selectedType === 'retailer' &&
      this.filtersStateService.campaigns) {
      return true;
    }

    return false;
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
    this.requestInfoSub?.unsubscribe();
  }
}
