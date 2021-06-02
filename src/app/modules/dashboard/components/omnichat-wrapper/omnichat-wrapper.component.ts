import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-omnichat-wrapper',
  templateUrl: './omnichat-wrapper.component.html',
  styleUrls: ['./omnichat-wrapper.component.scss']
})
export class OmnichatWrapperComponent implements OnInit {

  kpis: any[] = [
    {
      metricTitle: 'total chats',
      metricName: 'total_chats',
      metricValue: 380.092,
      metricFormat: 'decimals'
    },
    {
      metricTitle: 'promedio de chats por día',
      metricName: 'chats_day_avg',
      metricValue: 998,
      metricFormat: 'integer'

    },
    {
      metricTitle: '% dedicado al cliente',
      metricName: 'chats_client',
      metricValue: 41,
      metricFormat: 'percentage'
    },
    {
      metricTitle: 'mediana de duración',
      metricName: 'median_duration',
      metricValue: '00:05:34',
      subMetricTitle: 'Esperado',
      subMetricName: 'cr',
      subMetricValue: '< 10 Min'
    },
    {
      metricTitle: 'mediana de retardo',
      metricName: 'median_delay',
      metricValue: '00:00:11',
      subMetricTitle: 'Benchmark',
      subMetricName: 'roas',
      subMetricValue: '< 48 Seg'
    },
    {
      metricTitle: 'total chat',
      metricName: 'total_chat',
      metricValue: '4.56/5',
      subMetricTitle: 'roas',
      subMetricName: 'roas',
      subMetricValue: 91.14,
      subMetricFormat: 'percentage',
    },
    {
      metricTitle: 'transacciones',
      metricName: 'transactions',
      metricValue: 0,
      metricFormat: 'integer',
      subMetricTitle: 'CR',
      subMetricName: 'cr',
      subMetricValue: 0,
      subMetricFormat: 'percentage'
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
      subMetricFormat: 'decimals'
    }
  ];

  kpisReqStatus = 2;

  chatsByCountry = [
    { country: 'Panama', chats: 18 },
    { country: 'Honduras', chats: 135 },
    { country: 'Guatemala', chats: 202 },
    { country: 'El Salvador', chats: 405 },
    { country: 'Costa Rica', chats: 615 },
    { country: 'Brasil', chats: 625 },
    { country: 'Colombia', chats: 700 },
    { country: 'Argentina', chats: 950 },
    { country: 'Mexico', chats: 1150 },
    { country: 'Peru', chats: 1250 },
    { country: 'Chile', chats: 1300 },
  ];

  chatsByRetailer = [
    { retailer: 'MX - Pedidos', chats: 0 },
    { retailer: 'HN - Jestereo', chats: 0 },
    { retailer: 'HN - Office Depot', chats: 3 },
    { retailer: 'AR - Musimundo', chats: 4 },
    { retailer: 'GT - Office Depot', chats: 6 },
    { retailer: 'SV - Office Depot', chats: 8 },
    { retailer: 'MX - Dusof', chats: 10 },
    { retailer: 'CR - Unimart', chats: 20 },
    { retailer: 'CR - Office Depot', chats: 65 },
    { retailer: 'BR - Casas Bahia', chats: 70 },
    { retailer: 'AR - Carrefour', chats: 95 },
    { retailer: 'BR - Portinfo', chats: 99 },
    { retailer: 'AR - Fravega', chats: 100 },
    { retailer: 'BR - Kalunga', chats: 120 },
    { retailer: 'AR - Garbarino', chats: 145 },
    { retailer: 'BR - Portifino', chats: 150 },
    { retailer: 'AR - Compumundo', chats: 198 },
    { retailer: 'MX - Liverpool', chats: 215 },
    { retailer: 'MX - Walmart', chats: 250 },
    { retailer: 'PE - Rodelag', chats: 320 },
    { retailer: 'PE - Hiroka', chats: 450 },
    { retailer: 'PE - Riplay', chats: 550 },
    { retailer: 'CL- PC Factory', chats: 680 },
    { retailer: 'CL - Alkosto', chats: 750 },
  ];

  chatsByDevices = [
    { name: 'desktop', value: 2500 },
    { name: 'mobile', value: 10500 }
  ];

  devicesReqStatus = 2;

  chatHistory = [{
    date: '2020-11-01',
    value: 73
  }, {
    date: '2020-11-02',
    value: 67
  }, {
    date: '2020-11-03',
    value: 68
  }, {
    date: '2020-11-04',
    value: 65
  }, {
    date: '2020-11-05',
    value: 71
  }, {
    date: '2020-11-06',
    value: 75
  }, {
    date: '2020-11-07',
    value: 74
  }, {
    date: '2020-11-08',
    value: 71
  }, {
    date: '2020-11-09',
    value: 76
  }, {
    date: '2020-11-10',
    value: 77
  }, {
    date: '2020-11-11',
    value: 81
  }, {
    date: '2020-11-12',
    value: 83
  }, {
    date: '2020-11-13',
    value: 80
  }, {
    date: '2020-11-14',
    value: 81
  }, {
    date: '2020-11-15',
    value: 87
  }, {
    date: '2020-11-16',
    value: 82
  }, {
    date: '2020-11-17',
    value: 86
  }, {
    date: '2020-11-18',
    value: 80
  }, {
    date: '2020-11-19',
    value: 87
  }, {
    date: '2020-11-20',
    value: 83
  }, {
    date: '2020-11-21',
    value: 85
  }, {
    date: '2020-11-22',
    value: 84
  }, {
    date: '2020-11-23',
    value: 82
  }, {
    date: '2020-11-24',
    value: 73
  }, {
    date: '2020-11-25',
    value: 71
  }, {
    date: '2020-11-26',
    value: 75
  }, {
    date: '2020-11-27',
    value: 79
  }, {
    date: '2020-11-28',
    value: 70
  }, {
    date: '2020-11-29',
    value: 73
  }, {
    date: '2020-11-30',
    value: 61
  }, {
    date: '2020-12-01',
    value: 62
  }, {
    date: '2020-12-02',
    value: 66
  }, {
    date: '2020-12-03',
    value: 65
  }, {
    date: '2020-12-04',
    value: 73
  }, {
    date: '2020-12-05',
    value: 79
  }, {
    date: '2020-12-06',
    value: 78
  }, {
    date: '2020-12-07',
    value: 78
  }, {
    date: '2020-12-08',
    value: 78
  }, {
    date: '2020-12-09',
    value: 74
  }, {
    date: '2020-12-10',
    value: 73
  }, {
    date: '2020-12-11',
    value: 75
  }, {
    date: '2020-12-12',
    value: 70
  }, {
    date: '2020-12-13',
    value: 77
  }, {
    date: '2020-12-14',
    value: 67
  }, {
    date: '2020-12-15',
    value: 62
  }, {
    date: '2020-12-16',
    value: 64
  }, {
    date: '2020-12-17',
    value: 61
  }, {
    date: '2020-12-18',
    value: 59
  }, {
    date: '2020-12-19',
    value: 53
  }, {
    date: '2020-12-20',
    value: 54
  }, {
    date: '2020-12-21',
    value: 56
  }, {
    date: '2020-12-22',
    value: 59
  }, {
    date: '2020-12-23',
    value: 58
  }, {
    date: '2020-12-24',
    value: 55
  }, {
    date: '2020-12-25',
    value: 52
  }, {
    date: '2020-12-26',
    value: 54
  }, {
    date: '2020-12-27',
    value: 50
  }, {
    date: '2020-12-28',
    value: 50
  }, {
    date: '2020-12-29',
    value: 51
  }, {
    date: '2020-12-30',
    value: 52
  }, {
    date: '2020-12-31',
    value: 58
  }, {
    date: '2021-01-01',
    value: 60
  }, {
    date: '2021-01-02',
    value: 67
  }, {
    date: '2021-01-03',
    value: 64
  }, {
    date: '2021-01-04',
    value: 66
  }, {
    date: '2021-01-05',
    value: 60
  }, {
    date: '2021-01-06',
    value: 63
  }, {
    date: '2021-01-07',
    value: 61
  }, {
    date: '2021-01-08',
    value: 60
  }, {
    date: '2021-01-09',
    value: 65
  }, {
    date: '2021-01-10',
    value: 75
  }, {
    date: '2021-01-11',
    value: 77
  }, {
    date: '2021-01-12',
    value: 78
  }, {
    date: '2021-01-13',
    value: 70
  }, {
    date: '2021-01-14',
    value: 70
  }, {
    date: '2021-01-15',
    value: 73
  }, {
    date: '2021-01-16',
    value: 71
  }, {
    date: '2021-01-17',
    value: 74
  }, {
    date: '2021-01-18',
    value: 78
  }, {
    date: '2021-01-19',
    value: 85
  }, {
    date: '2021-01-20',
    value: 82
  }, {
    date: '2021-01-21',
    value: 83
  }, {
    date: '2021-01-22',
    value: 88
  }, {
    date: '2021-01-23',
    value: 85
  }, {
    date: '2021-01-24',
    value: 85
  }, {
    date: '2021-01-25',
    value: 80
  }, {
    date: '2021-01-26',
    value: 87
  }, {
    date: '2021-01-27',
    value: 84
  }, {
    date: '2021-01-28',
    value: 83
  }, {
    date: '2021-01-29',
    value: 84
  }, {
    date: '2021-01-30',
    value: 81
  }];

  chatsByCategories = [
    { category: 'PS', value: 3200 },
    { category: 'HW Print', value: 1200 },
    { category: 'Supplies', value: 400 }
  ]
  chartsInitLoad: boolean = true;
  trafficAndSales = {
    device: [
      {
        "name": "Desktop",
        "value": 13000
      },
      {
        "name": "Mobile",
        "value": 10000
      }
    ],
    gender: [
      {
        "name": "Hombre",
        "value": 5500
      },
      {
        "name": "Mujer",
        "value": 7500
      }
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

  trafficSalesReqStatus = [
    { name: 'device', reqStatus: 2 },
    { name: 'gender', reqStatus: 2 },
    { name: 'age', reqStatus: 2 },
    { name: 'gender-and-age', reqStatus: 2 }
  ];

  heatmapData = [
    {
      "hour": "12pm",
      "weekday": "Lun",
      "value": 3346
    },
    {
      "hour": "1am",
      "weekday": "Lun",
      "value": 2725
    },
    {
      "hour": "2am",
      "weekday": "Lun",
      "value": 3052
    },
    {
      "hour": "3am",
      "weekday": "Lun",
      "value": 3876
    },
    {
      "hour": "4am",
      "weekday": "Lun",
      "value": 4453
    },
    {
      "hour": "5am",
      "weekday": "Lun",
      "value": 3972
    },
    {
      "hour": "6am",
      "weekday": "Lun",
      "value": 4644
    },
    {
      "hour": "7am",
      "weekday": "Lun",
      "value": 5715
    },
    {
      "hour": "8am",
      "weekday": "Lun",
      "value": 7080
    },
    {
      "hour": "9am",
      "weekday": "Lun",
      "value": 8022
    },
    {
      "hour": "10am",
      "weekday": "Lun",
      "value": 8446
    },
    {
      "hour": "11am",
      "weekday": "Lun",
      "value": 9313
    },
    {
      "hour": "12am",
      "weekday": "Lun",
      "value": 9011
    },
    {
      "hour": "1pm",
      "weekday": "Lun",
      "value": 8508
    },
    {
      "hour": "2pm",
      "weekday": "Lun",
      "value": 8515
    },
    {
      "hour": "3pm",
      "weekday": "Lun",
      "value": 8399
    },
    {
      "hour": "4pm",
      "weekday": "Lun",
      "value": 8649
    },
    {
      "hour": "5pm",
      "weekday": "Lun",
      "value": 7869
    },
    {
      "hour": "6pm",
      "weekday": "Lun",
      "value": 6933
    },
    {
      "hour": "7pm",
      "weekday": "Lun",
      "value": 5969
    },
    {
      "hour": "8pm",
      "weekday": "Lun",
      "value": 5552
    },
    {
      "hour": "9pm",
      "weekday": "Lun",
      "value": 5434
    },
    {
      "hour": "10pm",
      "weekday": "Lun",
      "value": 5070
    },
    {
      "hour": "11pm",
      "weekday": "Lun",
      "value": 4851
    },
    {
      "hour": "12pm",
      "weekday": "Mar",
      "value": 4468
    },
    {
      "hour": "1am",
      "weekday": "Mar",
      "value": 3306
    },
    {
      "hour": "2am",
      "weekday": "Mar",
      "value": 3906
    },
    {
      "hour": "3am",
      "weekday": "Mar",
      "value": 4413
    },
    {
      "hour": "4am",
      "weekday": "Mar",
      "value": 4726
    },
    {
      "hour": "5am",
      "weekday": "Mar",
      "value": 4584
    },
    {
      "hour": "6am",
      "weekday": "Mar",
      "value": 5717
    },
    {
      "hour": "7am",
      "weekday": "Mar",
      "value": 6504
    },
    {
      "hour": "8am",
      "weekday": "Mar",
      "value": 8104
    },
    {
      "hour": "9am",
      "weekday": "Mar",
      "value": 8813
    },
    {
      "hour": "10am",
      "weekday": "Mar",
      "value": 9278
    },
    {
      "hour": "11am",
      "weekday": "Mar",
      "value": 10425
    },
    {
      "hour": "12am",
      "weekday": "Mar",
      "value": 10137
    },
    {
      "hour": "1pm",
      "weekday": "Mar",
      "value": 9290
    },
    {
      "hour": "2pm",
      "weekday": "Mar",
      "value": 9255
    },
    {
      "hour": "3pm",
      "weekday": "Mar",
      "value": 9614
    },
    {
      "hour": "4pm",
      "weekday": "Mar",
      "value": 9713
    },
    {
      "hour": "5pm",
      "weekday": "Mar",
      "value": 9667
    },
    {
      "hour": "6pm",
      "weekday": "Mar",
      "value": 8774
    },
    {
      "hour": "7pm",
      "weekday": "Mar",
      "value": 8649
    },
    {
      "hour": "8pm",
      "weekday": "Mar",
      "value": 9937
    },
    {
      "hour": "9pm",
      "weekday": "Mar",
      "value": 10286
    },
    {
      "hour": "10pm",
      "weekday": "Mar",
      "value": 9175
    },
    {
      "hour": "11pm",
      "weekday": "Mar",
      "value": 8581
    },
    {
      "hour": "12pm",
      "weekday": "Mie",
      "value": 8145
    },
    {
      "hour": "1am",
      "weekday": "Mie",
      "value": 7177
    },
    {
      "hour": "2am",
      "weekday": "Mie",
      "value": 5657
    },
    {
      "hour": "3am",
      "weekday": "Mie",
      "value": 6802
    },
    {
      "hour": "4am",
      "weekday": "Mie",
      "value": 8159
    },
    {
      "hour": "5am",
      "weekday": "Mie",
      "value": 8449
    },
    {
      "hour": "6am",
      "weekday": "Mie",
      "value": 9453
    },
    {
      "hour": "7am",
      "weekday": "Mie",
      "value": 9947
    },
    {
      "hour": "8am",
      "weekday": "Mie",
      "value": 11471
    },
    {
      "hour": "9am",
      "weekday": "Mie",
      "value": 12492
    },
    {
      "hour": "10am",
      "weekday": "Mie",
      "value": 9388
    },
    {
      "hour": "11am",
      "weekday": "Mie",
      "value": 9928
    },
    {
      "hour": "12am",
      "weekday": "Mie",
      "value": 9644
    },
    {
      "hour": "1pm",
      "weekday": "Mie",
      "value": 9034
    },
    {
      "hour": "2pm",
      "weekday": "Mie",
      "value": 8964
    },
    {
      "hour": "3pm",
      "weekday": "Mie",
      "value": 9069
    },
    {
      "hour": "4pm",
      "weekday": "Mie",
      "value": 8898
    },
    {
      "hour": "5pm",
      "weekday": "Mie",
      "value": 8322
    },
    {
      "hour": "6pm",
      "weekday": "Mie",
      "value": 6909
    },
    {
      "hour": "7pm",
      "weekday": "Mie",
      "value": 5810
    },
    {
      "hour": "8pm",
      "weekday": "Mie",
      "value": 5151
    },
    {
      "hour": "9pm",
      "weekday": "Mie",
      "value": 4911
    },
    {
      "hour": "10pm",
      "weekday": "Mie",
      "value": 4487
    },
    {
      "hour": "11pm",
      "weekday": "Mie",
      "value": 4118
    },
    {
      "hour": "12pm",
      "weekday": "Jue",
      "value": 3689
    },
    {
      "hour": "1am",
      "weekday": "Jue",
      "value": 3081
    },
    {
      "hour": "2am",
      "weekday": "Jue",
      "value": 6525
    },
    {
      "hour": "3am",
      "weekday": "Jue",
      "value": 6228
    },
    {
      "hour": "4am",
      "weekday": "Jue",
      "value": 6917
    },
    {
      "hour": "5am",
      "weekday": "Jue",
      "value": 6568
    },
    {
      "hour": "6am",
      "weekday": "Jue",
      "value": 6405
    },
    {
      "hour": "7am",
      "weekday": "Jue",
      "value": 8106
    },
    {
      "hour": "8am",
      "weekday": "Jue",
      "value": 8542
    },
    {
      "hour": "9am",
      "weekday": "Jue",
      "value": 8501
    },
    {
      "hour": "10am",
      "weekday": "Jue",
      "value": 8802
    },
    {
      "hour": "11am",
      "weekday": "Jue",
      "value": 9420
    },
    {
      "hour": "12am",
      "weekday": "Jue",
      "value": 8966
    },
    {
      "hour": "1pm",
      "weekday": "Jue",
      "value": 8135
    },
    {
      "hour": "2pm",
      "weekday": "Jue",
      "value": 8224
    },
    {
      "hour": "3pm",
      "weekday": "Jue",
      "value": 8387
    },
    {
      "hour": "4pm",
      "weekday": "Jue",
      "value": 8218
    },
    {
      "hour": "5pm",
      "weekday": "Jue",
      "value": 7641
    },
    {
      "hour": "6pm",
      "weekday": "Jue",
      "value": 6469
    },
    {
      "hour": "7pm",
      "weekday": "Jue",
      "value": 5441
    },
    {
      "hour": "8pm",
      "weekday": "Jue",
      "value": 4952
    },
    {
      "hour": "9pm",
      "weekday": "Jue",
      "value": 4643
    },
    {
      "hour": "10pm",
      "weekday": "Jue",
      "value": 4393
    },
    {
      "hour": "11pm",
      "weekday": "Jue",
      "value": 4017
    },
    {
      "hour": "12pm",
      "weekday": "Vier",
      "value": 4022
    },
    {
      "hour": "1am",
      "weekday": "Vier",
      "value": 3063
    },
    {
      "hour": "2am",
      "weekday": "Vier",
      "value": 3638
    },
    {
      "hour": "3am",
      "weekday": "Vier",
      "value": 3968
    },
    {
      "hour": "4am",
      "weekday": "Vier",
      "value": 4070
    },
    {
      "hour": "5am",
      "weekday": "Vier",
      "value": 4019
    },
    {
      "hour": "6am",
      "weekday": "Vier",
      "value": 4548
    },
    {
      "hour": "7am",
      "weekday": "Vier",
      "value": 5465
    },
    {
      "hour": "8am",
      "weekday": "Vier",
      "value": 6909
    },
    {
      "hour": "9am",
      "weekday": "Vier",
      "value": 7706
    },
    {
      "hour": "10am",
      "weekday": "Vier",
      "value": 7867
    },
    {
      "hour": "11am",
      "weekday": "Vier",
      "value": 8615
    },
    {
      "hour": "12am",
      "weekday": "Vier",
      "value": 8218
    },
    {
      "hour": "1pm",
      "weekday": "Vier",
      "value": 7604
    },
    {
      "hour": "2pm",
      "weekday": "Vier",
      "value": 7429
    },
    {
      "hour": "3pm",
      "weekday": "Vier",
      "value": 7488
    },
    {
      "hour": "4pm",
      "weekday": "Vier",
      "value": 7493
    },
    {
      "hour": "5pm",
      "weekday": "Vier",
      "value": 6998
    },
    {
      "hour": "6pm",
      "weekday": "Vier",
      "value": 5941
    },
    {
      "hour": "7pm",
      "weekday": "Vier",
      "value": 5068
    },
    {
      "hour": "8pm",
      "weekday": "Vier",
      "value": 4636
    },
    {
      "hour": "9pm",
      "weekday": "Vier",
      "value": 4241
    },
    {
      "hour": "10pm",
      "weekday": "Vier",
      "value": 3858
    },
    {
      "hour": "11pm",
      "weekday": "Vier",
      "value": 3833
    },
    {
      "hour": "12pm",
      "weekday": "Sab",
      "value": 3503
    },
    {
      "hour": "1am",
      "weekday": "Sab",
      "value": 2842
    },
    {
      "hour": "2am",
      "weekday": "Sab",
      "value": 2808
    },
    {
      "hour": "3am",
      "weekday": "Sab",
      "value": 2399
    },
    {
      "hour": "4am",
      "weekday": "Sab",
      "value": 2280
    },
    {
      "hour": "5am",
      "weekday": "Sab",
      "value": 2139
    },
    {
      "hour": "6am",
      "weekday": "Sab",
      "value": 2527
    },
    {
      "hour": "7am",
      "weekday": "Sab",
      "value": 2940
    },
    {
      "hour": "8am",
      "weekday": "Sab",
      "value": 3066
    },
    {
      "hour": "9am",
      "weekday": "Sab",
      "value": 3494
    },
    {
      "hour": "10am",
      "weekday": "Sab",
      "value": 3287
    },
    {
      "hour": "11am",
      "weekday": "Sab",
      "value": 3416
    },
    {
      "hour": "12am",
      "weekday": "Sab",
      "value": 3432
    },
    {
      "hour": "1pm",
      "weekday": "Sab",
      "value": 3523
    },
    {
      "hour": "2pm",
      "weekday": "Sab",
      "value": 3542
    },
    {
      "hour": "3pm",
      "weekday": "Sab",
      "value": 3347
    },
    {
      "hour": "4pm",
      "weekday": "Sab",
      "value": 3292
    },
    {
      "hour": "5pm",
      "weekday": "Sab",
      "value": 3416
    },
    {
      "hour": "6pm",
      "weekday": "Sab",
      "value": 3131
    },
    {
      "hour": "7pm",
      "weekday": "Sab",
      "value": 3057
    },
    {
      "hour": "8pm",
      "weekday": "Sab",
      "value": 3227
    },
    {
      "hour": "9pm",
      "weekday": "Sab",
      "value": 3060
    },
    {
      "hour": "10pm",
      "weekday": "Sab",
      "value": 2855
    },
    {
      "hour": "11pm",
      "weekday": "Sab",
      "value": 2625
    },
    {
      "hour": "12pm",
      "weekday": "Dom",
      "value": 2990
    },
    {
      "hour": "1am",
      "weekday": "Dom",
      "value": 2520
    },
    {
      "hour": "2am",
      "weekday": "Dom",
      "value": 2334
    },
    {
      "hour": "3am",
      "weekday": "Dom",
      "value": 2230
    },
    {
      "hour": "4am",
      "weekday": "Dom",
      "value": 2325
    },
    {
      "hour": "5am",
      "weekday": "Dom",
      "value": 2019
    },
    {
      "hour": "6am",
      "weekday": "Dom",
      "value": 2128
    },
    {
      "hour": "7am",
      "weekday": "Dom",
      "value": 2246
    },
    {
      "hour": "8am",
      "weekday": "Dom",
      "value": 2421
    },
    {
      "hour": "9am",
      "weekday": "Dom",
      "value": 2788
    },
    {
      "hour": "10am",
      "weekday": "Dom",
      "value": 2959
    },
    {
      "hour": "11am",
      "weekday": "Dom",
      "value": 3018
    },
    {
      "hour": "12am",
      "weekday": "Dom",
      "value": 3154
    },
    {
      "hour": "1pm",
      "weekday": "Dom",
      "value": 3172
    },
    {
      "hour": "2pm",
      "weekday": "Dom",
      "value": 3368
    },
    {
      "hour": "3pm",
      "weekday": "Dom",
      "value": 3464
    },
    {
      "hour": "4pm",
      "weekday": "Dom",
      "value": 3746
    },
    {
      "hour": "5pm",
      "weekday": "Dom",
      "value": 3656
    },
    {
      "hour": "6pm",
      "weekday": "Dom",
      "value": 3336
    },
    {
      "hour": "7pm",
      "weekday": "Dom",
      "value": 3292
    },
    {
      "hour": "8pm",
      "weekday": "Dom",
      "value": 3269
    },
    {
      "hour": "9pm",
      "weekday": "Dom",
      "value": 3300
    },
    {
      "hour": "10pm",
      "weekday": "Dom",
      "value": 3403
    },
    {
      "hour": "11pm",
      "weekday": "Dom",
      "value": 3323
    }
  ];

  trafficByDay = [
    { weekday: 'Dom', value: 180 },
    { weekday: 'Sab', value: 166 },
    { weekday: 'Vier', value: 166 },
    { weekday: 'Jue', value: 267 },
    { weekday: 'Mier', value: 277 },
    { weekday: 'Mar', value: 270 },
    { weekday: 'Lun', value: 230 },
  ]

  trafficByHour = [
    { hour: '12 AM', visits: 5 },
    { hour: '3 AM', visits: 1 },
    { hour: '6 AM', visits: 9 },
    { hour: '9 AM', visits: 67 },
    { hour: '12 PM', visits: 101 },
    { hour: '3 PM', visits: 81 },
    { hour: '6 PM', visits: 105 },
    { hour: '9 PM', visits: 100 }
  ]

  proactiveChatData = {
    metricTitle: 'chats proactivos manual con respuesta',
    metricName: 'proactive_chats',
    metricValue: 100,
    metricFormat: 'integer',
    metricSymbol: '%',
    subMetricTitle: 'benchmark',
    subMetricName: 'benchmark',
    subMetricValue: 33,
    subMetricFormat: 'integer',
    subMetricSymbol: '%',
  }


  selectedTab1 = 1;
  selectedTab2 = 1;

  constructor() { }

  ngOnInit(): void {
  }

  getDataByTrafficAndSales(metricType: string) {
    this.selectedTab1 = metricType === 'traffic' ? 1 : 2;
  }

}
