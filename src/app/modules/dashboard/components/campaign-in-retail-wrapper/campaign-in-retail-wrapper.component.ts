import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
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
  kpisLegends2 = ['ctr', 'users', 'cr', 'roas'];
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

  roasBySector = [
    {
      metricTitle: 'search',
      metricName: 'Search',
      metricValue: 0,
      metricFormat: 'decimals',
      icon: 'fab fa-google',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'marketing',
      metricName: 'Marketing',
      metricValue: 0,
      metricFormat: 'decimals',
      icon: 'fas fa-bullhorn',
      iconBg: '#0096d6'
    },
    {
      metricTitle: 'ventas',
      metricName: 'Ventas',
      metricValue: 0,
      metricFormat: 'decimals',
      icon: 'fas fa-store',
      iconBg: '#a77dcc'
    }

  ];

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

  constructor(
    private campInRetailService: CampaignInRetailService,
    private filtersStateService: FiltersStateService
  ) { }

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
    this.getRoasBySector();
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
          baseObj.metricValue = kpis1[i]['value'];

          if (i !== 0 && kpis2[i - 1]) {
            baseObj.subMetricValue = kpis2[i - 1]['value'];
          }

        }
        this.kpisReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[campaign-in-retail.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getRoasBySector() {
    this.roasReqStatus = 1;
    this.campInRetailService.getRoasBySector().subscribe(
      (resp: any[]) => {
        if (resp?.length < 1) {
          this.roasReqStatus = 2;
          return;
        }

        for (let i = 0; i < this.roasBySector.length; i++) {
          const baseObj = resp.find(item => item.name === this.roasBySector[i].metricName);
          this.roasBySector[i].metricValue = baseObj.value;
        }

        this.roasReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[campaign-in-retail.component]: ${errorMsg}`);
        this.roasReqStatus = 3;
      });
  }

  panelChange(panel, value) {
    this.extPanelIsOpen[panel] = value;
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
  }

}
