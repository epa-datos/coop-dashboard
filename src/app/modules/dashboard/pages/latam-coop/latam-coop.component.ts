import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FiltersStateService } from '../../services/filters-state.service';
import { OverviewService } from '../../services/overview.service';

@Component({
  selector: 'app-latam-coop',
  templateUrl: './latam-coop.component.html',
  styleUrls: ['./latam-coop.component.scss']
})
export class LatamCoopComponent implements OnInit, OnDestroy {

  activeTabView = 1;

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;
  selectedTab4: number = 1;

  kpisLegends1 = ['investment', 'clicks', 'bounce_rate', 'transactions', 'revenue']
  kpisLegends2 = ['ctr', 'users', 'cr', 'roas']
  kpis: any[] = [
    {
      metricTitle: 'inversión',
      metricName: 'investment',
      metricFormat: 'currency',
      metricSymbol: 'USD',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'clicks',
      metricName: 'clicks',
      subMetricTitle: 'ctr',
      subMetricName: 'ctr',
      subMetricFormat: 'percentage',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'bounce rate',
      metricName: 'bounce_rate',
      metricFormat: 'percentage',
      subMetricTitle: 'usuarios',
      subMetricName: 'users',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'transacciones',
      metricName: 'transactions',
      subMetricTitle: 'CR',
      subMetricName: 'cr',
      subMetricFormat: 'percentage',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricFormat: 'currency',
      subMetricTitle: 'roas',
      subMetricName: 'roas',
      subMetricFormat: 'decimals',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#fbc001'
    }
  ];

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

  filtersSub: Subscription;
  chartsInitLoad: boolean = true;

  constructor(
    private filtersStateService: FiltersStateService,
    private overviewService: OverviewService) { }

  ngOnInit(): void {
    if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
      this.filtersStateService.clearCampaignsSelection();
      this.getAllData();
    }

    this.filtersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.getKpis();
    this.getCategoriesBySector('Search', 1);
    this.getDataByTrafficAndSales('sales', 2);
    this.getDataByUsersAndSales('sales', 2);
    this.getInvestmentVsRevenue();

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
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getCategoriesBySector(sector: string, selectedTab: number) {
    this.categoriesReqStatus = 1;
    this.overviewService.getCategoriesBySectorLatam(sector).subscribe(
      (resp: any[]) => {
        this.categoriesBySector = resp;
        this.categoriesReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.categoriesReqStatus = 3;
      });

    this.selectedTab1 = selectedTab;
  }

  getDataByTrafficAndSales(metricType: string, selectedTab: number) {
    const requiredData = ['device', 'gender', 'age', 'gender-and-age']

    for (let subMetricType of requiredData) {
      const reqStatusObj = this.trafficSalesReqStatus.find(item => item.name === subMetricType);
      reqStatusObj.reqStatus = 1;
      this.overviewService.getTrafficAndSalesLatam(metricType, subMetricType).subscribe(
        (resp: any[]) => {
          if (subMetricType === 'gender-and-age') {
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

      this.selectedTab1 = selectedTab;
    }
  }

  getDataByUsersAndSales(metricType: string, selectedTab: number) {
    this.usersAndSalesReqStatus = 1;
    this.overviewService.getUsersAndSalesLatam(metricType).subscribe(
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

    this.selectedTab2 = selectedTab;
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
        console.error(`[overview-wrapper.component]: ${errorMsg}`);
        this.invVsRevenueReqStatus = 3;
      }
    )
  }

  ngOnDestroy() {
    this.filtersSub?.unsubscribe();
  }
}
