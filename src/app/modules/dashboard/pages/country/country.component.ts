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
      metricValue: 'USD 35,000',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'Clicks',
      metricValue: '280,0000',
      subMetricTitle: 'CTR',
      subMetricValue: '000',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'Bounce Rate',
      metricValue: '12%',
      subMetricTitle: 'Usuarios',
      subMetricValue: '27000',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'Transacciones',
      metricValue: '3,500',
      subMetricTitle: 'CR',
      subMetricValue: '000',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'Revenue',
      metricValue: '3,500',
      subMetricTitle: 'ROAS',
      subMetricValue: '000',
      icon: 'fas fa-hand-holding-usd',

      iconBg: '#fbc001'

    }
  ];

  devices: any[] = [
    { id: 1, name: 'Escritorio', value: 3000 },
    { id: 2, name: 'Tablet', value: 500 },
    { id: 3, name: 'Celular', value: 10500 }
  ]

  gender: any[] = [
    { id: 1, name: 'Hombre', value: 1200 },
    { id: 2, name: 'Mujer', value: 12800 },
  ]

  usersBySector: any[] = [
    {
      name: 'Search',
      value: 3500
    },
    {
      name: 'Marketing',
      value: 1500
    },
    {
      name: 'Ventas',
      value: 9000
    }
  ]

  salesBySector: any[] = [
    {
      name: 'Search',
      value: 250000
    },
    {
      name: 'Marketing',
      value: 37500
    },
    {
      name: 'Ventas',
      value: 85700
    }
  ];

  investmentVsRevenue = [
    { date: new Date(2021, 3, 12), value1: 12000, value2: 4370, previousDate: new Date(2021, 2, 5) },
    { date: new Date(2021, 3, 13), value1: 25000, value2: 40500, previousDate: new Date(2021, 2, 6) },
    { date: new Date(2021, 3, 14), value1: 40000, value2: 35000, previousDate: new Date(2021, 2, 7) },
    { date: new Date(2021, 3, 15), value1: 15000, value2: 25000, previousDate: new Date(2021, 2, 8) },
    { date: new Date(2021, 3, 16), value1: 13200, value2: 10000, previousDate: new Date(2021, 2, 9) },
    { date: new Date(2021, 3, 17), value1: 12400, value2: 12000, previousDate: new Date(2021, 2, 10) },
    { date: new Date(2021, 3, 18), value1: 80000, value2: 14000, previousDate: new Date(2021, 2, 11) }
  ]


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
    });
  }
}
