import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  countryName: string;
  stats: any[] = [
    {
      metricTitle: 'Inversión',
      metricvalue: 'USD 35,000',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'Clicks',
      metricvalue: '280,0000',
      subMetricTitle: 'CTR',
      subMetricvalue: '000',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'Bounce Rate',
      metricvalue: '12%',
      subMetricTitle: 'Usuarios',
      subMetricvalue: '27000',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'Transacciones',
      metricvalue: '3,500',
      subMetricTitle: 'CR',
      subMetricvalue: '000',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'Revenue',
      metricvalue: '3,500',
      subMetricTitle: 'ROAS',
      subMetricvalue: '000',
      icon: 'fas fa-hand-holding-usd',

      iconBg: '#fbc001'

    }
  ];

  devices: any[] = [
    { id: 1, name: 'Escritorio', value: 3000 },
    { id: 2, name: 'Mobile', value: 10500 },
  ]

  gender: any[] = [
    { id: 1, name: 'Hombre', value: 1200 },
    { id: 2, name: 'Mujer', value: 12800 },
  ]

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
        { date: new Date(2021, 3, 15), value: 2500 },
        { date: new Date(2021, 3, 16), value: 4700 },
        { date: new Date(2021, 3, 17), value: 4600 },
        { date: new Date(2021, 3, 18), value: 4700 },
        { date: new Date(2021, 3, 19), value: 4500 },
        { date: new Date(2021, 3, 20), value: 4300 },
        { date: new Date(2021, 3, 21), value: 4400 }
      ]
    },
    {
      name: 'Marketing',
      serie: [
        { date: new Date(2021, 3, 15), value: 2000 },
        { date: new Date(2021, 3, 16), value: 3500 },
        { date: new Date(2021, 3, 17), value: 3200 },
        { date: new Date(2021, 3, 18), value: 3600 },
        { date: new Date(2021, 3, 19), value: 3000 },
        { date: new Date(2021, 3, 20), value: 3400 },
        { date: new Date(2021, 3, 21), value: 3000 }
      ]
    },
    {
      name: 'Ventas',
      serie: [
        { date: new Date(2021, 3, 15), value: 4500 },
        { date: new Date(2021, 3, 16), value: 3700 },
        { date: new Date(2021, 3, 17), value: 3800 },
        { date: new Date(2021, 3, 18), value: 3200 },
        { date: new Date(2021, 3, 19), value: 3500 },
        { date: new Date(2021, 3, 20), value: 4500 },
        { date: new Date(2021, 3, 21), value: 4700 }
      ]
    }
  ]

  saleAndUsersBySector: any[] = this.usersBySector;

  investmentVsRevenue = [
    { date: new Date(2021, 3, 15), value1: 12000, value2: 4370, previousDate: new Date(2021, 3, 15) },
    { date: new Date(2021, 3, 16), value1: 25000, value2: 40500, previousDate: new Date(2021, 3, 16) },
    { date: new Date(2021, 3, 17), value1: 40000, value2: 35000, previousDate: new Date(2021, 3, 17) },
    { date: new Date(2021, 3, 18), value1: 15000, value2: 25000, previousDate: new Date(2021, 3, 18) },
    { date: new Date(2021, 3, 19), value1: 13200, value2: 10000, previousDate: new Date(2021, 3, 19) },
    { date: new Date(2021, 3, 20), value1: 12400, value2: 12000, previousDate: new Date(2021, 3, 20) },
    { date: new Date(2021, 3, 21), value1: 80000, value2: 14000, previousDate: new Date(2021, 3, 21) }
  ]

  selectedTab1: number = 1;

  valueName = 'Usuarios';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
    });
  }

  changeSectorData(category, selectedTab) {
    if (category === 'users') {
      this.saleAndUsersBySector = this.usersBySector;
      this.valueName = 'Usuarios';
    } else if (category === 'sales') {
      this.saleAndUsersBySector = this.salesBySector;
      this.valueName = 'Ventas';
    }

    this.selectedTab1 = selectedTab;
  }
}
