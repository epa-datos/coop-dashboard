import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { disaggregatePictorialData } from 'src/app/tools/functions/chart-data';
import { convertMonthToString, convertWeekdayToString } from 'src/app/tools/functions/data-convert';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { FiltersStateService } from '../../services/filters-state.service';
import { PcSelectorService } from '../../services/pc-selector.service';

@Component({
  selector: 'app-pc-selector-wrapper',
  templateUrl: './pc-selector-wrapper.component.html',
  styleUrls: ['./pc-selector-wrapper.component.scss']
})
export class PcSelectorWrapperComponent implements OnInit, OnDestroy {
  @Input() levelPage: any // latam || country || retailer;
  @Input() requestInfoChange: Observable<boolean>;


  // Tráfico - Demográficos
  trafficDemographic = {
    desktop: [
      { name: 'empty', value: 12.5 },
      { name: 'Desktop', value: 87.5, rawValue: 36 },
    ],
    mobile: [
      { name: 'empty', value: 87.5 },
      { name: 'Mobile', value: 12.5, rawValue: 92 },
    ],
    women: [
      { name: 'empty', value: 55 },
      { name: 'woman', value: 45 },
    ],
    men: [
      { name: 'empty', value: 45 },
      { name: 'men', value: 55 },
    ],
    age: [
      {
        "age": "15-19",
        "visits": 3
      }, {
        "age": "20-24",
        "visits": 12
      }, {
        "age": "25-29",
        "visits": 60
      }, {
        "age": "30-34",
        "visits": 22
      }, {
        "age": "35-39",
        "visits": 45
      }, {
        "age": "40-44",
        "visits": 3
      }, {
        "age": "45-49",
        "visits": 3
      }, {
        "age": "50-54",
        "visits": 2
      }, {
        "age": "55-59",
        "visits": 1
      }, {
        "age": "60-64",
        "visits": 1
      }, {
        "age": "65-69",
        "visits": 1
      }, {
        "age": "70-74",
        "visits": 1
      }, {
        "age": "75-79",
        "visits": 0
      }, {
        "age": "80-54",
        "visits": 0
      }, {
        "age": "85+",
        "visits": 0
      }
    ],
    genderByAge: [
      {
        "age": "85+",
        "male": -0.1,
        "female": 0.3
      }, {
        "age": "80-54",
        "male": -0.2,
        "female": 0.3
      }, {
        "age": "75-79",
        "male": -0.3,
        "female": 0.6
      }, {
        "age": "70-74",
        "male": -0.5,
        "female": 0.8
      }, {
        "age": "65-69",
        "male": -0.8,
        "female": 1.0
      }, {
        "age": "60-64",
        "male": -1.1,
        "female": 1.3
      }, {
        "age": "55-59",
        "male": -1.7,
        "female": 1.9
      }, {
        "age": "50-54",
        "male": -2.2,
        "female": 2.5
      }, {
        "age": "45-49",
        "male": -2.8,
        "female": 3.0
      }, {
        "age": "40-44",
        "male": -3.4,
        "female": 3.6
      }, {
        "age": "35-39",
        "male": -4.2,
        "female": 4.1
      }, {
        "age": "30-34",
        "male": -5.2,
        "female": 4.8
      }, {
        "age": "25-29",
        "male": -5.6,
        "female": 5.1
      }, {
        "age": "20-24",
        "male": -5.1,
        "female": 5.1
      }, {
        "age": "15-19",
        "male": -3.8,
        "female": 3.8
      }
    ]
  }

  // Conversiones - Demográficos
  conversionsDemographic = {
    desktop: [
      { name: 'empty', value: 50 },
      { name: 'Desktop', value: 50, rawValue: 1 },
    ],
    mobile: [
      { name: 'empty', value: 50 },
      { name: 'Mobile', value: 50, rawValue: 1 },
    ],
    women: [],
    men: [],
    age: [],
    genderByAge: []
  }

  // Tráfico por día de la semana y hora del día
  trafficHeatmapData = [
    {
      "hour": "12pm",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "1am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "2am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "3am",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "4am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "5am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "6am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "7am",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "8am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "9am",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "10am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "11am",
      "weekday": "Lun",
      "value": 2
    },
    {
      "hour": "12am",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "1pm",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "2pm",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "3pm",
      "weekday": "Lun",
      "value": 3
    },
    {
      "hour": "4pm",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "5pm",
      "weekday": "Lun",
      "value": 2
    },
    {
      "hour": "6pm",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "7pm",
      "weekday": "Lun",
      "value": 2
    },
    {
      "hour": "8pm",
      "weekday": "Lun",
      "value": 4
    },
    {
      "hour": "9pm",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "10pm",
      "weekday": "Lun",
      "value": 1
    },
    {
      "hour": "11pm",
      "weekday": "Lun",
      "value": 0
    },
    {
      "hour": "12pm",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "1am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "2am",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "3am",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "4am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "5am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "6am",
      "weekday": "Mar",
      "value": 3
    },
    {
      "hour": "7am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "8am",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "9am",
      "weekday": "Mar",
      "value": 2
    },
    {
      "hour": "10am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "11am",
      "weekday": "Mar",
      "value": 3
    },
    {
      "hour": "12am",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "1pm",
      "weekday": "Mar",
      "value": 2
    },
    {
      "hour": "2pm",
      "weekday": "Mar",
      "value": 3
    },
    {
      "hour": "3pm",
      "weekday": "Mar",
      "value": 4
    },
    {
      "hour": "4pm",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "5pm",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "6pm",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "7pm",
      "weekday": "Mar",
      "value": 4
    },
    {
      "hour": "8pm",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "9pm",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "10pm",
      "weekday": "Mar",
      "value": 1
    },
    {
      "hour": "11pm",
      "weekday": "Mar",
      "value": 0
    },
    {
      "hour": "12pm",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "1am",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "2am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "3am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "4am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "5am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "6am",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "7am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "8am",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "9am",
      "weekday": "Mie",
      "value": 2
    },
    {
      "hour": "10am",
      "weekday": "Mie",
      "value": 3
    },
    {
      "hour": "11am",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "12am",
      "weekday": "Mie",
      "value": 3
    },
    {
      "hour": "1pm",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "2pm",
      "weekday": "Mie",
      "value": 2
    },
    {
      "hour": "3pm",
      "weekday": "Mie",
      "value": 2
    },
    {
      "hour": "4pm",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "5pm",
      "weekday": "Mie",
      "value": 5
    },
    {
      "hour": "6pm",
      "weekday": "Mie",
      "value": 2
    },
    {
      "hour": "7pm",
      "weekday": "Mie",
      "value": 3
    },
    {
      "hour": "8pm",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "9pm",
      "weekday": "Mie",
      "value": 0
    },
    {
      "hour": "10pm",
      "weekday": "Mie",
      "value": 1
    },
    {
      "hour": "11pm",
      "weekday": "Mie",
      "value": 3
    },
    {
      "hour": "12pm",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "1am",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "2am",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "3am",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "4am",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "5am",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "6am",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "7am",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "8am",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "9am",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "10am",
      "weekday": "Jue",
      "value": 3
    },
    {
      "hour": "11am",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "12am",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "1pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "2pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "3pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "4pm",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "5pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "6pm",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "7pm",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "8pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "9pm",
      "weekday": "Jue",
      "value": 1
    },
    {
      "hour": "10pm",
      "weekday": "Jue",
      "value": 2
    },
    {
      "hour": "11pm",
      "weekday": "Jue",
      "value": 0
    },
    {
      "hour": "12pm",
      "weekday": "Vier",
      "value": 0
    },
    {
      "hour": "1am",
      "weekday": "Vier",
      "value": 0
    },
    {
      "hour": "2am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "3am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "4am",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "5am",
      "weekday": "Vier",
      "value": 0
    },
    {
      "hour": "6am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "7am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "8am",
      "weekday": "Vier",
      "value": 4
    },
    {
      "hour": "9am",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "10am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "11am",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "12am",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "1pm",
      "weekday": "Vier",
      "value": 3
    },
    {
      "hour": "2pm",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "3pm",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "4pm",
      "weekday": "Vier",
      "value": 3
    },
    {
      "hour": "5pm",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "6pm",
      "weekday": "Vier",
      "value": 3
    },
    {
      "hour": "7pm",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "8pm",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "9pm",
      "weekday": "Vier",
      "value": 2
    },
    {
      "hour": "10pm",
      "weekday": "Vier",
      "value": 3
    },
    {
      "hour": "11pm",
      "weekday": "Vier",
      "value": 1
    },
    {
      "hour": "12pm",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "1am",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "2am",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "3am",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "4am",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "5am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "6am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "7am",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "8am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "9am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "10am",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "11am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "12am",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "1pm",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "2pm",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "3pm",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "4pm",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "5pm",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "6pm",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "7pm",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "8pm",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "9pm",
      "weekday": "Sab",
      "value": 0
    },
    {
      "hour": "10pm",
      "weekday": "Sab",
      "value": 2
    },
    {
      "hour": "11pm",
      "weekday": "Sab",
      "value": 1
    },
    {
      "hour": "12pm",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "1am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "2am",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "3am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "4am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "5am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "6am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "7am",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "8am",
      "weekday": "Dom",
      "value": 2
    },
    {
      "hour": "9am",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "10am",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "11am",
      "weekday": "Dom",
      "value": 2
    },
    {
      "hour": "12am",
      "weekday": "Dom",
      "value": 2
    },
    {
      "hour": "1pm",
      "weekday": "Dom",
      "value": 2
    },
    {
      "hour": "2pm",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "3pm",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "4pm",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "5pm",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "6pm",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "7pm",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "8pm",
      "weekday": "Dom",
      "value": 2
    },
    {
      "hour": "9pm",
      "weekday": "Dom",
      "value": 1
    },
    {
      "hour": "10pm",
      "weekday": "Dom",
      "value": 0
    },
    {
      "hour": "11pm",
      "weekday": "Dom",
      "value": 0
    }
  ];

  // Tráfico por día de la semana
  trafficByDay = [
    { weekday: 'Dom', value: 21 },
    { weekday: 'Sab', value: 32 },
    { weekday: 'Vier', value: 32 },
    { weekday: 'Jue', value: 27 },
    { weekday: 'Mier', value: 39 },
    { weekday: 'Mar', value: 25 },
    { weekday: 'Lun', value: 18 },
  ];

  // Tráfico por hora del día
  trafficByHour = [
    { hour: '12 AM', visits: 11 },
    { hour: '3 AM', visits: 8 },
    { hour: '6 AM', visits: 20 },
    { hour: '9 AM', visits: 34 },
    { hour: '12 PM', visits: 33 },
    { hour: '3 PM', visits: 35 },
    { hour: '6 PM', visits: 32 },
    { hour: '9 PM', visits: 21 }
  ]

  // Conversiones por día de la semana
  conversionsByDay = [
    { weekday: 'Dom', value: 0 },
    { weekday: 'Sab', value: 0 },
    { weekday: 'Vier', value: 0 },
    { weekday: 'Jue', value: 1 },
    { weekday: 'Mier', value: 0 },
    { weekday: 'Mar', value: 0 },
    { weekday: 'Lun', value: 1 },
  ];


  chartsReqStatus = {
    countries: 2,
    retailers: 2,
    categories: 2
  }

  trafficSalesReqStatus = [
    { name: 'device', reqStatus: 2 },
    { name: 'gender', reqStatus: 2 },
    { name: 'age', reqStatus: 2 },
    { name: 'gender-and-age', reqStatus: 2 }
  ];


  // kpis
  kpis: any[] = [
    {
      metricTitle: 'usuarios',
      metricName: 'users',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-users',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'usuarios nuevos',
      metricName: 'new_users',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-user-plus',
      iconBg: '#2f9998'
    },
    {
      metricTitle: 'duración media de la sesión',
      metricName: 'avg_session_duration',
      metricValue: '00:00:00',
      icon: 'fas fa-user-clock',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'conversiones',
      metricName: 'conversions',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-shopping-cart',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'conversion rate',
      metricName: 'conversion_rate',
      metricValue: 0,
      metricFormat: 'percentage',
      icon: 'fas fa-percentage',
      iconBg: '#fbc001'
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2B96D5'
    }
  ];
  kpisReqStatus: number = 0;

  usersAndRevenue: any[] = [];
  usersAndRevenueReqStatus: number = 0;

  trafficOrConversions = {};
  trafficOrConversionsReqStatus = [
    { name: 'countries', reqStatus: 0 },
    { name: 'retailers', reqStatus: 0 },
    { name: 'exitRate', reqStatus: 0 },
    { name: 'exitRateByStep', reqStatus: 0 },
    { name: 'useRate', reqStatus: 0 },
    { name: 'products', reqStatus: 0 }
  ];

  performance: {};
  performanceReqStatus: number = 0;


  audience = {};
  audienceReqStatus = [
    { name: 'device', reqStatus: 0 },
    { name: 'gender', reqStatus: 0 },
    { name: 'age', reqStatus: 0 },
    { name: 'genderAndAge', reqStatus: 0 },
    { name: 'weekday', reqStatus: 0 },
    { name: 'weekdayAndHour', reqStatus: 0 },
    { name: 'hour', reqStatus: 0 },
  ]


  demographics: any = this.trafficDemographic;
  weekdays: any[] = this.trafficByDay;

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;
  selectedTab4: number = 1;

  chartsInitLoad: boolean = true;

  requestInfoSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private pcSelectorService: PcSelectorService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // validate if filters are already loaded
    this.filtersAreReady() && this.getAllData();

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.filtersAreReady() && this.getAllData();
    });
  }

  getAllData() {
    console.log('getAllData')

    let metricTab1 = this.selectedTab1 === 1 ? 'conversions' : 'aup-vs-revenue';
    let subMetricTab1 = this.selectedTab1 === 1 && 'users';
    let metricTab2 = this.selectedTab2 === 1 ? 'traffic' : 'conversions';
    let metricTab3 = this.selectedTab3 === 1 ? 'traffic' : 'conversions';

    this.getKpis();
    this.getUsersOrRevenue(metricTab1, subMetricTab1);
    this.getTrafficOrConversions(metricTab2);
    this.getPerformance();
    this.getAudienceByMetric(metricTab3);

    this.chartsInitLoad = true;
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, 'kpis').subscribe(
      (resp: any[]) => {
        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = resp.find(item => item.string === this.kpis[i].metricName);

          if (!baseObj) {
            continue;
          }

          if (this.kpis[i].metricName === 'avg_session_duration') {
            this.kpis[i].metricValue = strTimeFormat(baseObj.value);
          } else {
            this.kpis[i].metricValue = baseObj.value;
          }
        }
        this.kpisReqStatus = 2;
      },
      error => {
        this.clearKpis();
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getUsersOrRevenue(metricType: string, subMetricType?: string) {
    this.selectedTab1 = metricType === 'conversions' ? 1 : 2;

    this.usersAndRevenueReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, metricType, subMetricType).subscribe(
      (resp: any[]) => {
        this.usersAndRevenue = resp;
        console.log('new resp', resp)
        this.usersAndRevenueReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector.component]: ${errorMsg}`);
        this.usersAndRevenueReqStatus = 3;
      });
  }

  getTrafficOrConversions(metricType: string) {
    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;

    let requiredData: any[] = [];

    // required data by metricType
    if (metricType === 'traffic') {
      requiredData.push(
        { metricType: 'funnel', subMetricType: 'exit-rate', name: 'exitRate' },
        { metricType: 'funnel', subMetricType: 'exit-rate-by-step', name: 'exitRateByStep' },
        { metricType: 'funnel', subMetricType: 'use-rate', name: 'useRate' }
      );
    } else if (metricType === 'conversions') {
      requiredData.push(
        { metricType: 'conversions', subMetricType: 'products', name: 'products' }
      );
    }

    // required data by levelPage
    if (this.levelPage.latam) {
      requiredData.push(
        { metricType, subMetricType: 'countries', name: 'countries' },
        { metricType, subMetricType: 'retailers', name: 'retailers' }
      );
    } else if (this.levelPage.country) {
      requiredData.push(
        { metricType, subMetricType: 'retailers', name: 'retailers' }
      );
    }

    for (let metric of requiredData) {
      const reqStatusObj = this.trafficOrConversionsReqStatus.find(item => item.name === metric.name);
      reqStatusObj.reqStatus = 1;

      this.pcSelectorService.getDataByMetric(this.levelPage.latam, metric.metricType, metric.subMetricType).subscribe(
        (resp: any[]) => {
          if (metric.metricType === 'traffic' && (metric.name === 'countries' || metric.name === 'retailers')) {
            this.trafficOrConversions[metric.name] = resp.sort((a, b) => (a?.chats < b?.chats ? -1 : 1));

          } else if (metric.metricType === 'sales' && (metric.name === 'countries' || metric.name === 'retailers')) {
            this.trafficOrConversions[metric.name] = resp.sort((a, b) => (a?.value < b?.value ? -1 : 1));

          } else {
            this.trafficOrConversions[metric.name] = resp;
          }

          console.log('trafficOrConversions', this.trafficOrConversions)

          reqStatusObj.reqStatus = 2;
        },
        error => {
          this.trafficOrConversions[metric.name] = [];
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[pc-selector.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  getPerformance() {
    this.performanceReqStatus = 1;
    this.pcSelectorService.getDataByMetric(this.levelPage.latam, 'performance').subscribe(
      (months: any) => {
        const newMonthsObj = {};
        for (let item in months) {
          const date = item.split('-');
          const dateStrFormat = `${convertMonthToString(date[1])} ${date[0]}`;

          const obj = months[item];
          newMonthsObj[dateStrFormat] = obj;
        }

        this.performance = newMonthsObj;
        this.performanceReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[pc-selector.component]: ${errorMsg}`);
        this.performanceReqStatus = 3;
      });
  }

  getAudienceByMetric(metricType: string) {
    this.selectedTab3 = metricType === 'traffic' ? 1 : 2;

    const requiredData = [
      { subMetricType: 'device', name: 'device' },
      { subMetricType: 'gender', name: 'gender' },
      { subMetricType: 'age', name: 'age' },
      { subMetricType: 'gender-and-age', name: 'genderAndAge' },
      { subMetricType: 'weekday', name: 'weekday' },
    ];

    if (metricType === 'traffic') {
      requiredData.push(
        { subMetricType: 'weekday-and-hour', name: 'weekdayAndHour' },
        { subMetricType: 'hour', name: 'hour' }
      );
    }

    for (let subMetric of requiredData) {
      const reqStatusObj = this.audienceReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;
      this.pcSelectorService.getDataByMetric(this.levelPage.latam, metricType, subMetric.subMetricType).subscribe(
        (resp: any[]) => {

          if (subMetric.name === 'device') {
            const { desktop, mobile }: any = disaggregatePictorialData('Desktop', 'Mobile', resp);
            this.audience = { ...this.audience, desktop, mobile };

          } else if (subMetric.name === 'gender') {
            const { hombre, mujer }: any = disaggregatePictorialData('Hombre', 'Mujer', resp);

            hombre.length > 0 && (hombre[1].name = this.translate.instant('others.men'));
            mujer.length > 0 && (mujer[1].name = this.translate.instant('others.women'));

            this.audience = { ...this.audience, men: hombre, women: mujer };

          } else if (subMetric.name === 'weekdayAndHour') {
            this.audience['weekdayAndHour'] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else if (subMetric.name === 'weekday') {
            resp = resp.sort((a, b) => (a.weekday > b.weekday ? -1 : 1));
            this.audience[subMetric.name] = resp.map(item => {
              return { ...item, weekdayName: convertWeekdayToString(item.weekday) }
            });
          } else {
            this.audience[subMetric.name] = resp;
          }

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[pc-selector-wrapper.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  filtersAreReady(): boolean {
    if (!this.levelPage ||
      !this.filtersStateService.period) {
      return false;
    }

    if (this.levelPage.latam &&
      this.filtersStateService.countries &&
      this.filtersStateService.retailers
    ) {
      return true;

    } else if (!this.levelPage.latam) {
      return true;

    } else {
      return false;
    }
  }

  clearKpis() {
    for (let kpi of this.kpis) {
      if (kpi.metricName === 'avg_session_duration') {
        kpi.metricValue = '00:00:00';
      } else {
        kpi.metricValue = 0;
      }
    }
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
