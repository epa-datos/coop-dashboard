import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserService } from 'src/app/services/user.service';
import { FiltersStateService } from '../../services/filters-state.service';
import { OverviewService } from '../../services/overview.service';

@Component({
  selector: 'app-overview-wrapper',
  templateUrl: './overview-wrapper.component.html',
  styleUrls: ['./overview-wrapper.component.scss']
})
export class OverviewWrapperComponent implements OnInit, OnDestroy {

  @Input() selectedType: string; // country or retailer

  countryName: string;

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;

  valueName = 'Usuarios';

  countryID: number;
  retailerID: number;
  userRole: string;

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

  usersAndSalesBySector: any[] = [];
  investmentVsRevenue: any[] = [];

  countrySub: Subscription;
  retailerSub: Subscription;
  filtersSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
    private overviewService: OverviewService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userRole = this.userService.user.role_name;

    const selectedCountry = this.appStateService.selectedCountry;
    this.countryID = selectedCountry?.id && selectedCountry?.id;

    if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
      console.log('getAllData init')
      this.filtersStateService.clearCampaignsSelection();
      this.getAllData();
    }

    this.filtersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      console.log('getAllData filtersChange subs')
      this.getAllData();
    });

    if (this.selectedType === 'retailer') {
      this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
        if (retailer?.id !== this.retailerID) {
          this.retailerID = retailer?.id !== this.retailerID && retailer?.id;
          if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {

            if (this.retailerID) {
              console.log('getAllData retailer subs')
              this.filtersStateService.clearCampaignsSelection();
              this.getAllData();
            }

          }
        }
      });
    }

    if (this.selectedType === 'country') {
      this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
        if (country?.id !== this.countryID) {
          this.countryID = country?.id;

          if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {

            if (!this.retailerID) {
              this.filtersStateService.clearCampaignsSelection();
              console.log('getAllData country subs')
              this.getAllData();
            }

          }
        }
      });
    }
  }

  getAllData() {
    this.getKpis();
    this.getCategoriesBySector('Search', 1);
    this.getDataByTrafficAndSales('traffic', 1);
    this.getDataByUsersAndSales('users', 1);
    this.getInvestmentVsRevenue();
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

  getCategoriesBySector(sector: string, selectedTab: number) {
    this.categoriesReqStatus = 1;
    this.overviewService.getCategoriesBySector(sector).subscribe(
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
      this.overviewService.getTrafficAndSales(metricType, subMetricType).subscribe(
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

      this.selectedTab2 = selectedTab;
    }
  }

  getDataByUsersAndSales(metricType: string, selectedTab: number) {
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

    this.selectedTab3 = selectedTab;
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

  ngOnDestroy() {
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
