import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { KpiCard } from 'src/app/models/kpi';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-campaign-in-retail-wrapper',
  templateUrl: './campaign-in-retail-wrapper.component.html',
  styleUrls: ['./campaign-in-retail-wrapper.component.scss']
})
export class CampaignInRetailWrapperComponent implements OnInit, OnDestroy {

  @Input() requestInfoChange: Observable<boolean>;

  kpisLegends1 = ['investment', 'clicks', 'bounce_rate', 'transactions', 'revenue'];
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
          format: 'percentage'
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
          format: 'integer'
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
          format: 'percentage'
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

  metricBySectorInitial = [
    {
      id: 1,
      title: 'search',
      name: 'Search',
      value: 0,
      icon: 'fab fa-google',
      iconBg: '#172b4d'
    },
    {
      id: 2,
      title: 'marketing',
      name: 'Marketing',
      value: 0,
      icon: 'fas fa-bullhorn',
      iconBg: '#0096d6'
    },
    {
      id: 3,
      title: 'ventas',
      name: 'Ventas',
      value: 0,
      icon: 'fas fa-store',
      iconBg: '#a77dcc'
    }
  ];

  roasBySector: any[];
  crBySector: any[];

  kpisReqStatus: number = 0;
  roasReqStatus: number = 0;

  extPanelIsOpen = {
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false
  }

  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;
  translateSub: Subscription;

  constructor(
    private campInRetailService: CampaignInRetailService,
    private filtersStateService: FiltersStateService,
    private translate: TranslateService,
  ) {

    this.translateSub = translate.stream('campInRetail').subscribe(() => {
      this.loadI18nContent();
    });
  }

  ngOnInit(): void {
    this.generalFiltersSub = this.requestInfoChange.subscribe(() => {
      this.getAllData();
    })

    this.retailFiltersSub = this.filtersStateService.retailFiltersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.getKpis();

    this.getSelectedSectors();
    this.getRoasAndCrBySector();
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.campInRetailService.getKpis().subscribe(
      (resp: any[]) => {

        if (resp?.length < 1) {
          this.kpisReqStatus = 2;
          return;
        }

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
        this.clearStats(this.kpis);
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[campaign-in-retail.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getSelectedSectors() {
    // selected sectors in general filters
    const selectedSectorsIds = this.filtersStateService.sectors.map(item => item.id);

    // This is to use different object references based on metricBySectorInitial objects
    const selectedSectorsRoas = [];
    const selectedSectorsCR = [];

    for (let item of this.metricBySectorInitial) {
      if (selectedSectorsIds.includes(item.id)) {
        selectedSectorsRoas.push({ ...item, format: 'decimal' });
        selectedSectorsCR.push({ ...item, format: 'percentage' });
      }
    }

    this.roasBySector = [...selectedSectorsRoas];
    this.crBySector = [...selectedSectorsCR];
  }

  getRoasAndCrBySector() {
    const requiredData = [
      { metricType: 'roas', name: 'roas' },
      { metricType: 'conversion-rate', subMetricType: 'sectors', name: 'cr' },
    ];

    for (let metric of requiredData) {
      const arrayNameRef = `${metric.name}BySector`;
      const reqStatusNameRef = `${metric.name}ReqStatus`;

      this[reqStatusNameRef] = 1;

      this.campInRetailService.getDataByMetric(metric.metricType, metric?.subMetricType).subscribe(
        (resp: any[]) => {
          if (resp?.length < 1) {
            this[reqStatusNameRef] = 2;
            return;
          }

          for (let i = 0; i < this[arrayNameRef].length; i++) {
            const baseObj = resp.find(item => item.name === this[arrayNameRef][i].name);
            this[arrayNameRef][i].value = baseObj.value;
          }

          this[reqStatusNameRef] = 2;
        },
        error => {
          this.clearStats(this[arrayNameRef]);
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[campaign-in-retail.component]: ${errorMsg}`);
          this[reqStatusNameRef] = 3;
        });
    }
  }

  panelChange(panel, value) {
    this.extPanelIsOpen[panel] = value;
  }

  clearStats(stats) {
    for (let stat of stats) {
      stat.value = 0;

      stat.subKpis?.forEach(item => {
        item.value = 0;
      });
    }
  }

  loadI18nContent() {
    this.kpis[0].title = this.translate.instant('general.investment');
    this.kpis[2].subKpis[0].title = this.translate.instant('general.users');
    this.kpis[3].title = this.translate.instant('general.conversions');

    this.metricBySectorInitial[2].title = this.translate.instant('general.sales');
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }

}
