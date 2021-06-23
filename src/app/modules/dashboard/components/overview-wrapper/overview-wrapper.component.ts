import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
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
  selectedTab2: number = 2; // traffic (1) or conversions (2) selection -> demographics
  selectedTab3: number = 1; // users vs conversions (1) or investment vs revenue (2) or aup vs revenue (3) selection -> chart-multiple-axes
  selectedTab4: number = 1; // sector (1) or category (2) or source (3) selection ->  chart-multiple-axes
  selectedTab5: number = 1; // subtab (sector, category or source) selection ->  chart-multiple-axes

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

  // available tabs for usersInvOrAup
  selectedCategories: any[] = [];
  selectedSectors: any[] = [];
  selectedSources: any[] = [];

  // for usersInvOrAup selected tab
  selectedSectorTab: any;
  selectedCategoryTab: any
  selectedSourceTab: any;

  // for categoriesBySector (heatmap) selected tab
  selectedSectorTabHM: any;

  requestInfoSub: Subscription;
  chartsInitLoad: boolean = true;

  constructor(
    private filtersStateService: FiltersStateService,
    private overviewService: OverviewService,
    private translate: TranslateService
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
      { id: 'google', name: 'Google' },
      { id: 'social', name: 'Social' },
      { id: 'email', name: 'Email' },
      { id: 'display', name: 'Display' },
      { id: 'others', name: 'Otros' }
    ]

    let selectedSectorHM;
    let demographicMetric;

    let selectedSector;
    let selectedCategory;
    let selectedSource;

    if (!preserveSelectedTabs) {
      selectedSectorHM = this.selectedSectors[0];
      demographicMetric = 'traffic';

      // tabs for users vs conversions | investment vs revenue | revenue vs aup (chart-multiple-axes)
      this.selectedTab3 = 1;
      this.selectedTab4 = 1;
      this.selectedTab5 = 1;
      selectedSector = null;
      selectedCategory = null;
      selectedSource = null;

    } else {
      // PRESERVE PREVIOUS SELECTION (TABS)

      // sectors heatmap
      const previousSectorHM = this.selectedSectors.find(sector => sector.id === this.selectedSectorTabHM.id);
      selectedSectorHM = previousSectorHM ? previousSectorHM : this.selectedSectors[0];

      // demograhics
      demographicMetric = this.selectedTab2 === 1 ? 'traffic' : 'sales';

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
            previousCategory = this.selectedCategories.find(category => category.id === this.selectedCategoryTab?.id);
            break;

          case 3:
            // there's a previous selected source
            previousSource = this.selectedSources.find(source => source.id === this.selectedSourceTab?.id);
            break;
        }
      }

      selectedSector = previousSector ? previousSector : null;
      selectedCategory = previousCategory ? previousCategory : null;
      selectedSource = previousSource ? previousSource : null;
    }

    this.getKpis();
    this.getCategoriesBySector(selectedSectorHM);
    this.getDemographics(demographicMetric);
    this.getDataByUsersInvOrAup(null, selectedSector, selectedCategory, selectedSource);

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

  getDemographics(metricType: string) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age']

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.demographicsReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getDemographics(metricType, subMetricType).subscribe(
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
          console.error(`[overview-wrapper.component]: ${errorMsg}`);
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

    this.overviewService.getUsersInvOrAup(metricType, sector?.id, category?.id, source?.id).subscribe(
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

    if (!sector && !category && !source) {
      this.selectedSectorTab = this.selectedSectors[0];
      this.selectedTab5 = 1
    } else {
      this.selectedSectorTab = sector;
      this.selectedCategoryTab = category;
      this.selectedSourceTab = source;
    }
  }

  clearUsersAndSalesTabs() {
    this.selectedSectorTab && delete this.selectedSectorTab;
    this.selectedCategoryTab && delete this.selectedCategoryTab;
    this.selectedSourceTab && delete this.selectedSourceTab;
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
