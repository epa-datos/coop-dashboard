import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-wrapper',
  templateUrl: './overview-wrapper.component.html',
  styleUrls: ['./overview-wrapper.component.scss']
})
export class OverviewWrapperComponent implements OnInit {

  @Input() selectedType: string; // country or retailer
  @Input() selectedID: number; // country or retailer id

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

  categoriesXSectorSearch: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 2990
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 2300
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 2400
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 1600
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 1350
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 2100
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 3400
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 1600
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 2800
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 1950
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 2000
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 900
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 1400
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 1700
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 1200
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 1150
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 1650
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 2400
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 2100
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 3600
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 1200
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 4200
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 3600
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 2800
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 2400
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 1400
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 1850
    }
  ]

  categoriesXSectorMkt: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 980
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 430
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 220
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 350
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 260
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 430
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 640
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 420
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 160
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 120
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 240
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 450
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 460
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 240
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 320
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 250
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 375
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 421
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 250
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 231
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 450
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 225
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 245
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 270
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 125
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 160
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 250
    }
  ]

  categoriesXSectorSales: any[] = [
    {
      category: 'PS',
      retailer: 'Abcdin',
      value: 1400
    },
    {
      category: 'Print',
      retailer: 'Abcdin',
      value: 1200
    },
    {
      category: 'Supplies',
      retailer: 'Abcdin',
      value: 1600
    },
    {
      category: 'PS',
      retailer: 'Alkosto',
      value: 800
    },
    {
      category: 'Print',
      retailer: 'Alkosto',
      value: 600
    },
    {
      category: 'Supplies',
      retailer: 'Alkosto',
      value: 1300
    },
    {
      category: 'PS',
      retailer: 'Compumundo',
      value: 700
    },
    {
      category: 'Print',
      retailer: 'Compumundo',
      value: 500
    },
    {
      category: 'Supplies',
      retailer: 'Compumundo',
      value: 1400
    },
    {
      category: 'PS',
      retailer: 'Fravega',
      value: 1250
    },
    {
      category: 'Print',
      retailer: 'Fravega',
      value: 1000
    },
    {
      category: 'Supplies',
      retailer: 'Fravega',
      value: 1440
    },
    {
      category: 'PS',
      retailer: 'Garbarino',
      value: 980
    },
    {
      category: 'Print',
      retailer: 'Garbarino',
      value: 970
    },
    {
      category: 'Supplies',
      retailer: 'Garbarino',
      value: 400
    },
    {
      category: 'PS',
      retailer: 'Liverpool',
      value: 430
    },
    {
      category: 'Print',
      retailer: 'Liverpool',
      value: 475
    },
    {
      category: 'Supplies',
      retailer: 'Liverpool',
      value: 480
    },
    {
      category: 'PS',
      retailer: 'Officemax',
      value: 1200
    },
    {
      category: 'Print',
      retailer: 'Officemax',
      value: 1000
    },
    {
      category: 'Supplies',
      retailer: 'Officemax',
      value: 600
    },
    {
      category: 'PS',
      retailer: 'Panamericana',
      value: 800
    },
    {
      category: 'Print',
      retailer: 'Panamericana',
      value: 950
    },
    {
      category: 'Supplies',
      retailer: 'Panamericana',
      value: 1000
    },
    {
      category: 'PS',
      retailer: 'Pcfactory',
      value: 800
    },
    {
      category: 'Print',
      retailer: 'Pcfactory',
      value: 700
    },
    {
      category: 'Supplies',
      retailer: 'Pcfactory',
      value: 600
    }
  ]

  categoriesXSector = this.categoriesXSectorSearch;

  devicesByTraffic: any[] = [
    { id: 1, name: 'Escritorio', value: 2500 },
    { id: 2, name: 'Mobile', value: 10500 },
  ]

  devicesBySales: any[] = [
    { id: 1, name: 'Escritorio', value: 300 },
    { id: 2, name: 'Mobile', value: 450 },
  ]

  genderByTraffic: any[] = [
    { id: 1, name: 'Hombre', value: 5500 },
    { id: 2, name: 'Mujer', value: 7500 },
  ]

  genderBySales: any[] = [
    { id: 1, name: 'Hombre', value: 1200 },
    { id: 2, name: 'Mujer', value: 12800 },
  ]

  devices: any[] = this.devicesByTraffic;
  gender: any[] = this.genderByTraffic;

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
  selectedTab2: number = 1;
  selectedTab3: number = 1;

  valueName = 'Usuarios';

  constructor() { }

  ngOnInit(): void {
  }

  changeSectorData(category, selectedTab) {
    if (category === 'search') {
      this.categoriesXSector = this.categoriesXSectorSearch;
      // this.valueName = 'Usuarios';
    } else if (category === 'marketing') {
      this.categoriesXSector = this.categoriesXSectorMkt;
      // this.valueName = 'Ventas';
    } else if (category === 'sales') {
      this.categoriesXSector = this.categoriesXSectorSales;
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
      // this.valueName = 'Usuarios';
    } else if (category === 'sales') {
      this.devices = this.devicesBySales;
      this.gender = this.genderBySales;
      // this.valueName = 'Ventas';
    }

    this.selectedTab2 = selectedTab;
  }
}
