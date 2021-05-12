import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  @Input() selectedID: number; // country or retailer id

  countryName: string;

  categoriesXRetailSearch: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 0
    }
  ]

  categoriesXRetailMkt: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 0
    }
  ]

  categoriesXRetailSales: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 0
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 1
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 0
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 1
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 1
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 0
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 1
    }
  ]

  categoriesXRetail = this.categoriesXRetailSearch;

  categoriesXSector: any[] = [
    {
      category: 'PS',
      sector: 'Search',
      value: 1
    },
    {
      category: 'Print',
      sector: 'Search',
      value: 0
    },
    {
      category: 'Supplies',
      sector: 'Search',
      value: 1
    },
    {
      category: 'PS',
      sector: 'Marketing',
      value: 0
    },
    {
      category: 'Print',
      sector: 'Marketing',
      value: 1
    },
    {
      category: 'Supplies',
      sector: 'Marketing',
      value: 0
    },
    {
      category: 'PS',
      sector: 'Ventas',
      value: 1
    },
    {
      category: 'Print',
      sector: 'Ventas',
      value: 0
    },
    {
      category: 'Supplies',
      sector: 'Ventas',
      value: 0
    }
  ]

  devicesByTraffic: any[] = [
    { name: 'Desktop', value: 2500 },
    { name: 'Mobile', value: 10500 },
  ]

  devicesBySales: any[] = [
    { name: 'Desktop', value: 300 },
    { name: 'Mobile', value: 450 },
  ]

  genderByTraffic: any[] = [
    { name: 'Hombre', value: 5500 },
    { name: 'Mujer', value: 7500 },
  ]

  genderBySales: any[] = [
    { name: 'Hombre', value: 1200 },
    { name: 'Mujer', value: 12800 },
  ]

  ageByTraffic: any[] = [
    {
      'age': '15-19',
      'visits': 3.8
    }, {
      'age': '20-24',
      'visits': 5.1
    }, {
      'age': '25-29',
      'visits': 5.1
    }, {
      'age': '30-34',
      'visits': 4.8
    }, {
      'age': '35-39',
      'visits': 4.1
    }, {
      'age': '40-44',
      'visits': 3.6
    }, {
      'age': '45-49',
      'visits': 3.0
    }, {
      'age': '50-54',
      'visits': 2.5
    }, {
      'age': '55-59',
      'visits': 1.9
    }, {
      'age': '60-64',
      'visits': 1.3
    }, {
      'age': '65-69',
      'visits': 1.0
    }, {
      'age': '70-74',
      'visits': 0.8
    }, {
      'age': '75-79',
      'visits': 0.6
    }, {
      'age': '80-54',
      'visits': 0.3
    }, {
      'age': '85+',
      'visits': 0.3
    }
  ]

  ageBySales: any[] = [
    {
      'age': '15-19',
      'visits': 1.8
    }, {
      'age': '20-24',
      'visits': 7.5
    }, {
      'age': '25-29',
      'visits': 8.1
    }, {
      'age': '30-34',
      'visits': 6.8
    }, {
      'age': '35-39',
      'visits': 5.1
    }, {
      'age': '40-44',
      'visits': 4.6
    }, {
      'age': '45-49',
      'visits': 3.0
    }, {
      'age': '50-54',
      'visits': 2.8
    }, {
      'age': '55-59',
      'visits': 2.0
    }, {
      'age': '60-64',
      'visits': 1.6
    }, {
      'age': '65-69',
      'visits': 1.2
    }, {
      'age': '70-74',
      'visits': 0.5
    }, {
      'age': '75-79',
      'visits': 0.4
    }, {
      'age': '80-54',
      'visits': 0.3
    }, {
      'age': '85+',
      'visits': 0.1
    }
  ]

  ageByGenderTraffic: any[] = [
    {
      'age': '85+',
      'male': -0.1,
      'female': 0.3
    }, {
      'age': '80-54',
      'male': -0.2,
      'female': 0.3
    }, {
      'age': '75-79',
      'male': -0.3,
      'female': 0.6
    }, {
      'age': '70-74',
      'male': -0.5,
      'female': 0.8
    }, {
      'age': '65-69',
      'male': -0.8,
      'female': 1.0
    }, {
      'age': '60-64',
      'male': -1.1,
      'female': 1.3
    }, {
      'age': '55-59',
      'male': -1.7,
      'female': 1.9
    }, {
      'age': '50-54',
      'male': -2.2,
      'female': 2.5
    }, {
      'age': '45-49',
      'male': -2.8,
      'female': 3.0
    }, {
      'age': '40-44',
      'male': -3.4,
      'female': 3.6
    }, {
      'age': '35-39',
      'male': -4.2,
      'female': 4.1
    }, {
      'age': '30-34',
      'male': -5.2,
      'female': 4.8
    }, {
      'age': '25-29',
      'male': -5.6,
      'female': 5.1
    }, {
      'age': '20-24',
      'male': -5.1,
      'female': 5.1
    }, {
      'age': '15-19',
      'male': -3.8,
      'female': 3.8
    }
  ]

  ageByGenderSales: any[] = [
    {
      'age': '85+',
      'male': -0.1,
      'female': 0.0
    }, {
      'age': '80-54',
      'male': -0.2,
      'female': 0.1
    }, {
      'age': '75-79',
      'male': -0.2,
      'female': 0.4
    }, {
      'age': '70-74',
      'male': -0.4,
      'female': 0.6
    }, {
      'age': '65-69',
      'male': -0.7,
      'female': 1.3
    }, {
      'age': '60-64',
      'male': -1.8,
      'female': 2.3
    }, {
      'age': '55-59',
      'male': -2.7,
      'female': 2.1
    }, {
      'age': '50-54',
      'male': -3.0,
      'female': 2.9
    }, {
      'age': '45-49',
      'male': -3.4,
      'female': 3.0
    }, {
      'age': '40-44',
      'male': -4.8,
      'female': 3.6
    }, {
      'age': '35-39',
      'male': -5.2,
      'female': 4.1
    }, {
      'age': '30-34',
      'male': -6.1,
      'female': 4.8
    }, {
      'age': '25-29',
      'male': -8.3,
      'female': 7.5
    }, {
      'age': '20-24',
      'male': -8.8,
      'female': 9.0
    }, {
      'age': '15-19',
      'male': -3.8,
      'female': 3.4
    }
  ]

  devices: any[] = this.devicesByTraffic;
  gender: any[] = this.genderByTraffic;
  age: any[] = this.ageByTraffic;
  ageByGender: any[] = this.ageByGenderTraffic;

  usersBySector: any[] = [
    {
      name: 'Search',
      serie: [
        { date: new Date(2021, 3, 15), value: 80 },
        { date: new Date(2021, 3, 16), value: 100 },
        { date: new Date(2021, 3, 17), value: 120 },
        { date: new Date(2021, 3, 18), value: 250 },
        { date: new Date(2021, 3, 19), value: 140 },
        { date: new Date(2021, 3, 20), value: 135 },
        { date: new Date(2021, 3, 21), value: 155 }
      ]
    },
    {
      name: 'Marketing',
      serie: [
        { date: new Date(2021, 3, 15), value: 95 },
        { date: new Date(2021, 3, 16), value: 56 },
        { date: new Date(2021, 3, 17), value: 82 },
        { date: new Date(2021, 3, 18), value: 75 },
        { date: new Date(2021, 3, 19), value: 130 },
        { date: new Date(2021, 3, 20), value: 240 },
        { date: new Date(2021, 3, 21), value: 260 }
      ]
    },
    {
      name: 'Ventas',
      serie: [
        { date: new Date(2021, 3, 15), value: 94 },
        { date: new Date(2021, 3, 16), value: 112 },
        { date: new Date(2021, 3, 17), value: 150 },
        { date: new Date(2021, 3, 18), value: 100 },
        { date: new Date(2021, 3, 19), value: 130 },
        { date: new Date(2021, 3, 20), value: 150 },
        { date: new Date(2021, 3, 21), value: 170 }
      ]
    }
  ]

  salesBySector: any[] = [
    {
      name: 'Search',
      serie: [
        { date: '2021-03-15', value: 2500 },
        { date: '2021-03-16', value: 4700 },
        { date: '2021-03-17', value: 4600 },
        { date: '2021-03-18', value: 4700 },
        { date: '2021-03-19', value: 4500 },
        { date: '2021-03-20', value: 4300 },
        { date: '2021-03-21', value: 4400 }
      ]
    },
    {
      name: 'Marketing',
      serie: [
        { date: '2021-03-15', value: 2000 },
        { date: '2021-03-16', value: 3500 },
        { date: '2021-03-17', value: 3200 },
        { date: '2021-03-18', value: 3600 },
        { date: '2021-03-19', value: 3000 },
        { date: '2021-03-20', value: 3400 },
        { date: '2021-03-21', value: 3000 }
      ]
    },
    {
      name: 'Ventas',
      serie: [
        { date: '2021-03-15', value: 4500 },
        { date: '2021-03-16', value: 3700 },
        { date: '2021-03-17', value: 3800 },
        { date: '2021-03-18', value: 3200 },
        { date: '2021-03-19', value: 3500 },
        { date: '2021-03-20', value: 4500 },
        { date: '2021-03-21', value: 4700 }
      ]
    }
  ]

  saleAndUsersBySector: any[] = this.usersBySector;

  investmentVsRevenue = [
    { date: '2021-03-15', investment: 12000, revenue: 4370 },
    { date: '2021-03-16', investment: 25000, revenue: 40500 },
    { date: '2021-03-17', investment: 40000, revenue: 35000 },
    { date: '2021-03-18', investment: 15000, revenue: 25000 },
    { date: '2021-03-19', investment: 13200, revenue: 10000 },
    { date: '2021-03-20', investment: 12400, revenue: 12000 },
    { date: '2021-03-21', investment: 80000, revenue: 14000 }
  ]

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

  categoriesBySector: any[];
  trafficAndSales = {};

  kpisReqStatus: number = 0;
  categoriesReqStatus: number = 0;
  trafficSalesReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'gender-and-age', reqStatus: 0 }
  ];

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

    this.filtersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    });

    this.appStateService.selectedCountry$.subscribe(country => {
      if (this.userRole !== 'retailer' && country?.id !== this.countryID) {
        this.countryID = country?.id !== this.countryID && country?.id;

        if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
          this.getAllData();
        }
      }

    });
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id !== this.retailerID && retailer?.id;
        if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
          // this.getAllData();
        }
      }
    });
  }

  getAllData() {
    this.getKpis();
    this.getCategoriesBySector('Search', 1);
    this.getDataByTrafficAndSales('traffic', 1);
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

  changeSectorData(category, selectedTab) {
    if (category === 'search') {
      this.categoriesXRetail = this.categoriesXRetailSearch;
      // this.valueName = 'Usuarios';
    } else if (category === 'marketing') {
      this.categoriesXRetail = this.categoriesXRetailMkt;
      // this.valueName = 'Ventas';
    } else if (category === 'sales') {
      this.categoriesXRetail = this.categoriesXRetailSales;
      // this.valueName = 'Ventas';
    }

    this.selectedTab1 = selectedTab;
  }

  changeSectorData2(category, selectedTab) {
    if (category === 'users') {
      this.saleAndUsersBySector = this.usersBySector;
      this.valueName = 'Usuarios';
    } else if (category === 'sales') {
      this.saleAndUsersBySector = this.salesBySector;
      this.valueName = 'Ventas';
    }

    this.selectedTab3 = selectedTab;
  }

  changeDeviceGenderData(category, selectedTab) {
    if (category === 'traffic') {
      this.devices = this.devicesByTraffic;
      this.gender = this.genderByTraffic;
      this.age = this.ageByTraffic;
      this.ageByGender = this.ageByGenderTraffic;
      // this.valueName = 'Usuarios';
    } else if (category === 'sales') {
      this.devices = this.devicesBySales;
      this.gender = this.genderBySales;
      this.age = this.ageBySales;
      this.ageByGender = this.ageByGenderSales;
      // this.valueName = 'Ventas';
    }

    this.selectedTab2 = selectedTab;
  }

  ngOnDestroy() {
    this.countrySub && this.countrySub.unsubscribe();
    this.retailerSub && this.retailerSub.unsubscribe();
    this.filtersSub && this.filtersSub.unsubscribe();
  }
}
