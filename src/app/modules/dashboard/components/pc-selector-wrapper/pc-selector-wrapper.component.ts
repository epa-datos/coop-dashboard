import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-pc-selector-wrapper',
  templateUrl: './pc-selector-wrapper.component.html',
  styleUrls: ['./pc-selector-wrapper.component.scss']
})
export class PcSelectorWrapperComponent implements OnInit {

  // kpis
  kpis: any[] = [
    {
      metricTitle: 'usuarios',
      metricName: 'users',
      metricValue: 128,
      metricFormat: 'integer',
      icon: 'fas fa-users',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'usuarios nuevos',
      metricName: 'new_users',
      metricValue: 127,
      metricFormat: 'integer',
      icon: 'fas fa-user-plus',
      iconBg: '#2f9998'
    },
    {
      metricTitle: 'duración media de la sesión',
      metricName: 'avg_sessions_duration',
      metricValue: '00:01:05',
      icon: 'fas fa-user-clock',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'conversiones',
      metricName: 'transactions',
      metricValue: 2,
      metricFormat: 'integer',
      icon: 'fas fa-shopping-cart',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'conversion rate',
      metricName: 'conversion_rate',
      metricValue: 2.35,
      metricFormat: 'percentage',
      icon: 'fas fa-percentage',
      iconBg: '#fbc001'
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricValue: 16799.4,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2B96D5'
    }
  ];

  // Usuarios vs Conversiones
  usersVsConversions = [{
    date: '2021-06-02',
    traffic: 8,
    conversions: 0,
  }, {
    date: '2021-06-03',
    traffic: 12,
    conversions: 1,
  }, {
    date: '2021-06-04',
    traffic: 15,
    conversions: 0,
  }, {
    date: '2021-06-05',
    traffic: 11,
    conversions: 0,
  }, {
    date: '2021-06-06',
    traffic: 16,
    conversions: 0,
  }, {
    date: '2021-06-07',
    traffic: 21,
    conversions: 1,
  }, {
    date: '2021-06-08',
    traffic: 19,
    conversions: 0,
  }, {
    date: '2021-06-09',
    traffic: 18,
    conversions: 0,
  }, {
    date: '2021-06-10',
    traffic: 17,
    conversions: 1,
  }, {
    date: '2021-06-11',
    traffic: 15,
    conversions: 0,
  }, {
    date: '2021-06-12',
    traffic: 4,
    conversions: 0,
  }, {
    date: '2021-06-13',
    traffic: 16,
    conversions: 0,
  }, {
    date: '2021-06-14',
    traffic: 21,
    conversions: 1,
  }, {
    date: '2021-06-15',
    traffic: 19,
    conversions: 0,
  }, {
    date: '2021-06-16',
    traffic: 15,
    conversions: 0,
  }];

  // Revenue vs AUP
  aupVsRevenue = [{
    date: '2021-06-02',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-03',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-04',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-05',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-06',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-07',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-08',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-09',
    traffic: 0,
    conversions: 0,
  }, {
    date: '2021-06-10',
    revenue: 0,
    aup: 0,
  }, {
    date: '2021-06-11',
    revenue: 8399.7,
    aup: 8399.7,
  }, {
    date: '2021-06-12',
    revenue: 0,
    aup: 0,
  }, {
    date: '2021-06-13',
    revenue: 0,
    aup: 0,
  }, {
    date: '2021-06-14',
    revenue: 0,
    aup: 0,
  }, {
    date: '2021-06-15',
    revenue: 8399.7,
    aup: 8399.7,
  }, {
    date: '2021-06-16',
    revenue: 0,
    aup: 0,
  }];

  // Tráfico por país
  trafficByCountry = [
    { country: 'Panama', chats: 0 },
    { country: 'Honduras', chats: 0 },
    { country: 'Guatemala', chats: 0 },
    { country: 'El Salvador', chats: 0 },
    { country: 'Costa Rica', chats: 0 },
    { country: 'Brasil', chats: 0 },
    { country: 'Colombia', chats: 0 },
    { country: 'Argentina', chats: 0 },
    { country: 'Peru', chats: 0 },
    { country: 'Chile', chats: 0 },
    { country: 'Mexico', chats: 128 }
  ];

  // Conversiones por país
  conversionsByCountry = [
    { country: 'Panama', chats: 0 },
    { country: 'Honduras', chats: 0 },
    { country: 'Guatemala', chats: 0 },
    { country: 'El Salvador', chats: 0 },
    { country: 'Costa Rica', chats: 0 },
    { country: 'Brasil', chats: 0 },
    { country: 'Colombia', chats: 0 },
    { country: 'Argentina', chats: 0 },
    { country: 'Peru', chats: 0 },
    { country: 'Chile', chats: 0 },
    { country: 'Mexico', chats: 2 },
  ];

  // Tráfico por retailer
  trafficByRetailer = [
    {
      "retailer": "SV - Office Depot",
      "chats": 0
    },
    {
      "retailer": "PE - Ripley",
      "chats": 0
    },
    {
      "retailer": "PE - Plaza Vea",
      "chats": 0
    },
    {
      "retailer": "PE - La Curaçao",
      "chats": 0
    },
    {
      "retailer": "PE - Hiraoka",
      "chats": 0
    },
    {
      "retailer": "PA - Rodelag",
      "chats": 0
    },
    {
      "retailer": "PA - Panafoto",
      "chats": 0
    },
    {
      "retailer": "PA - Office Depot",
      "chats": 0
    },
    {
      "retailer": "MX - Radio Shack",
      "chats": 0
    },
    {
      "retailer": "MX - Office Max",
      "chats": 0
    },
    {
      "retailer": "MX - Office Depot",
      "chats": 0
    },
    {
      "retailer": "MX - Liverpool",
      "chats": 0
    },
    {
      "retailer": "MX - El Palacio de Hierro",
      "chats": 0
    },
    {
      "retailer": "MX - Dusof",
      "chats": 0
    },
    {
      "retailer": "MX - Cyberpuerta",
      "chats": 0
    },
    {
      "retailer": "HN - Office Depot",
      "chats": 0
    },
    {
      "retailer": "HN - Jetstereo",
      "chats": 0
    },
    {
      "retailer": "GT - Office Depot",
      "chats": 0
    },
    {
      "retailer": "CR - Unimart",
      "chats": 0
    },
    {
      "retailer": "CR - Office Depot",
      "chats": 0
    },
    {
      "retailer": "CO - Teknopolis",
      "chats": 0
    },
    {
      "retailer": "CO - Panamericana",
      "chats": 0
    },
    {
      "retailer": "CO - Éxito",
      "chats": 0
    },
    {
      "retailer": "CO - Alkosto",
      "chats": 0
    },
    {
      "retailer": "CL - Ripley",
      "chats": 0
    },
    {
      "retailer": "CL - PC Factory",
      "chats": 0
    },
    {
      "retailer": "CL - Lider",
      "chats": 0
    },
    {
      "retailer": "CL - AbcDin",
      "chats": 0
    },
    {
      "retailer": "BR - Portinfo",
      "chats": 0
    },
    {
      "retailer": "BR - Kalunga",
      "chats": 0
    },
    {
      "retailer": "BR - Casas Bahia",
      "chats": 0
    },
    {
      "retailer": "AR - Walmart",
      "chats": 0
    },
    {
      "retailer": "AR - Musimundo",
      "chats": 0
    },
    {
      "retailer": "AR - Garbarino",
      "chats": 0
    },
    {
      "retailer": "AR - Fravega",
      "chats": 0
    },
    {
      "retailer": "AR - Compumundo",
      "chats": 0
    },
    {
      "retailer": "AR - Carrefour",
      "chats": 0
    },
    {
      "retailer": "MX - Pedidos",
      "chats": 128
    },
  ]

  // Tasa de Abandono al inicio del proceso
  churnRateInInit = [
    { category: 'Abandona', value: 1 },
    { category: 'No abandona', value: 99 }
  ];

  // Tasa de Uso de Asistente Virtual
  useRateVirtualAssistant = [
    { category: 'Utiliza', value: 10 },
    { category: 'No utiliza', value: 118 }
  ];

  // Tasa de Abandono por pregunta
  churnRateByQuestion = [{
    'name': 'Pregunta 2',
    'value': 14
  }, {
    'name': 'Pregunta 3',
    'value': 14
  }, {
    'name': 'Pregunta 5',
    'value': 12
  }, {
    'name': 'Pregunta 9',
    'value': 11
  }, {
    'name': 'Termina el proceso',
    'value': 9
  }];

  // Conversiones por retailer
  conversionsByRetailer = [
    {
      "retailer": "SV - Office Depot",
      "chats": 0
    },
    {
      "retailer": "PE - Ripley",
      "chats": 0
    },
    {
      "retailer": "PE - Plaza Vea",
      "chats": 0
    },
    {
      "retailer": "PE - La Curaçao",
      "chats": 0
    },
    {
      "retailer": "PE - Hiraoka",
      "chats": 0
    },
    {
      "retailer": "PA - Rodelag",
      "chats": 0
    },
    {
      "retailer": "PA - Panafoto",
      "chats": 0
    },
    {
      "retailer": "PA - Office Depot",
      "chats": 0
    },
    {
      "retailer": "MX - Radio Shack",
      "chats": 0
    },
    {
      "retailer": "MX - Office Max",
      "chats": 0
    },
    {
      "retailer": "MX - Office Depot",
      "chats": 0
    },
    {
      "retailer": "MX - Liverpool",
      "chats": 0
    },
    {
      "retailer": "MX - El Palacio de Hierro",
      "chats": 0
    },
    {
      "retailer": "MX - Dusof",
      "chats": 0
    },
    {
      "retailer": "MX - Cyberpuerta",
      "chats": 0
    },
    {
      "retailer": "HN - Office Depot",
      "chats": 0
    },
    {
      "retailer": "HN - Jetstereo",
      "chats": 0
    },
    {
      "retailer": "GT - Office Depot",
      "chats": 0
    },
    {
      "retailer": "CR - Unimart",
      "chats": 0
    },
    {
      "retailer": "CR - Office Depot",
      "chats": 0
    },
    {
      "retailer": "CO - Teknopolis",
      "chats": 0
    },
    {
      "retailer": "CO - Panamericana",
      "chats": 0
    },
    {
      "retailer": "CO - Éxito",
      "chats": 0
    },
    {
      "retailer": "CO - Alkosto",
      "chats": 0
    },
    {
      "retailer": "CL - Ripley",
      "chats": 0
    },
    {
      "retailer": "CL - PC Factory",
      "chats": 0
    },
    {
      "retailer": "CL - Lider",
      "chats": 0
    },
    {
      "retailer": "CL - AbcDin",
      "chats": 0
    },
    {
      "retailer": "BR - Portinfo",
      "chats": 0
    },
    {
      "retailer": "BR - Kalunga",
      "chats": 0
    },
    {
      "retailer": "BR - Casas Bahia",
      "chats": 0
    },
    {
      "retailer": "AR - Walmart",
      "chats": 0
    },
    {
      "retailer": "AR - Musimundo",
      "chats": 0
    },
    {
      "retailer": "AR - Garbarino",
      "chats": 0
    },
    {
      "retailer": "AR - Fravega",
      "chats": 0
    },
    {
      "retailer": "AR - Compumundo",
      "chats": 0
    },
    {
      "retailer": "AR - Carrefour",
      "chats": 0
    },
    {
      "retailer": "MX - Pedidos",
      "chats": 2
    },
  ];

  // Conversiones por producto
  conversionsByProduct = [
    { product: 'LAPTOP HP 15 EF1007LA AMD RYZEN 3 12 GB SSD 256 GB', transactions: 0 },
    { product: 'LAPTOP HP 240 G7 INTEL CORE I3 RAM 4 GB DD 500 GB WINDOWS 10 HOME', transactions: 0 },
    { product: 'LAPTOP HP 14-CK2097LA PROCESADOR INTEL CELERON RAM 4 GB DD 1 TB', transactions: 0 },
    { product: 'LAPTOP HP CHROMEBOOK 11A G8 EE APU AMD A4 RAM 4 GB DD 32 GB EMMC', transactions: 0 },
    { product: 'LAPTOP HP 240 G7 153J8LT INTEL CORE I5 RAM 8 GB DD 1 TB', transactions: 0 },
    { product: 'LAPTOP HP 240 G7-151F5LT PROCESADOR INTEL CORE I5 RAM 8 GB DD 1 TB WINDOWS 10 HOME', transactions: 0 },
    { product: 'LAPTOP HP 14 DK1010LA AMD ATHLON SILVER 3050U 4 GB 500 GB', transactions: 0 },
    { product: 'LAPTOP HP 245 G7 AMD RYZEN 3 8 GB 1 TB', transactions: 0 },
    { product: 'LAPTOP HP 445 G7 AMD RYZEN 7 RAM 8 GB DD 512 GB SSD', transactions: 0 },
    { product: 'LAPTOP HP NOTEBOOK 250 G7 PROCESADOR INTEL CORE I3 RAM 8 GB DD 1 TB', transactions: 0 },
    { product: 'LAPTOP HP PROBOOK X360 435 G7 PROCESADOR AMD RYZEN 5 RAM 8 GB DD SSD 256 GB', transactions: 0 },
    { product: 'LAPTOP HP 240 G7 INTEL CELERON N4020 4 GB 500 GB', transactions: 2 },
  ]

  // Usuarios, Conversiones y Tasa de conversión por fecha
  usersTransactionsConversion: any = {
    'Mar 21': {
      'users': 0,
      'transactions': 0,
      'conversion_rate': 0
    },
    'Abr 21': {
      'users': 0,
      'transactions': 0,
      'conversion_rate': 0
    },
    'May 21': {
      'users': 0,
      'transactions': 0,
      'conversion_rate': 0
    },
    'Jun 21': {
      'users': 85,
      'transactions': 2,
      'conversion_rate': 2.35
    }
  }

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

  kpisReqStatus = 2;


  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;

  countryID: number;
  retailerID: number;

  latamView: boolean;
  countryView: boolean;
  retailerView: boolean;

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

  dataByUsersAndRevenue: any[] = this.usersVsConversions;
  countries: any[] = this.trafficByCountry;
  retailers: any[] = this.trafficByRetailer;
  demographics: any = this.trafficDemographic;
  weekdays: any[] = this.trafficByDay;

  selectedTab1: number = 1;
  selectedTab2: number = 1;
  selectedTab3: number = 1;
  selectedTab4: number = 1;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.latamView = this.router.url.includes('latam') ? true : false;

    if (this.countryID || this.retailerID || this.latamView) {
      this.getActiveView();
    }

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event instanceof NavigationEnd)
          this.latamView = this.router.url.includes('latam') ? true : false;
        this.getActiveView();
      });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
    });
  }

  getActiveView() {
    if (this.retailerID) {
      this.retailerView = true;
      this.countryView = false;
      this.latamView = false;
    } else if (this.countryID) {
      this.countryView = true;
      this.retailerView = false;
      this.latamView = false;
    } else if (this.latamView) {
      this.countryView = false;
      this.retailerView = false;
    }

    if (this.countryView) {
      this.retailers = this.retailers.filter(item => item.retailer.includes('MX'));
    } else {
      this.retailers = this.trafficByRetailer;
    }
  }

  getDataByUsersAndRevenue(metricType: string) {
    this.selectedTab1 = metricType === 'users' ? 1 : 2;

    if (metricType === 'users') {
      this.dataByUsersAndRevenue = this.usersVsConversions;
    } else if (metricType === 'revenue') {
      this.dataByUsersAndRevenue = this.aupVsRevenue;
    }
  }

  getDataByCountriesAndRetailers(metricType: string) {
    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;

    if (metricType === 'traffic') {
      this.countries = this.trafficByCountry;
      this.retailers = this.trafficByRetailer
    } else if (metricType === 'conversions') {
      this.countries = this.conversionsByCountry;
      this.retailers = this.conversionsByRetailer;
    }

    console.log('retailers', this.retailers)

    if (this.countryView) {
      this.retailers = this.retailers.filter(item => item.retailer.includes('MX'));
    }
  }

  getDataByTrafficAndSales(metricType: string) {
    this.selectedTab3 = metricType === 'traffic' ? 1 : 2;

    if (metricType === 'traffic') {
      this.demographics = this.trafficDemographic;
      this.weekdays = this.trafficByDay;
    } else if (metricType === 'conversions') {
      this.demographics = this.conversionsDemographic;
      this.weekdays = this.conversionsByDay;
    }
  }
}
