import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-omnichat-wrapper',
  templateUrl: './omnichat-wrapper.component.html',
  styleUrls: ['./omnichat-wrapper.component.scss']
})
export class OmnichatWrapperComponent implements OnInit, OnDestroy {

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
      metricTitle: 'calificación del chat',
      metricName: 'chat_score',
      metricValue: 91.1,
      metricFormat: 'score',
      subMetricTitle: 'resultado',
      subMetricName: 'chat_score',
      subMetricValue: '4.56/5'
    },
    {
      metricTitle: 'usuarios',
      metricName: 'users',
      metricValue: '4500',
      metricFormat: 'integer'
    },
    {
      metricTitle: 'conversiones',
      metricName: 'transactions',
      metricValue: 0,
      metricFormat: 'integer',
    },
    {
      metricTitle: 'conversion rate',
      metricName: 'conversion_rate',
      metricValue: 0,
      metricFormat: 'percentage',
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD'
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
    { name: 'Desktop', value: 2500 },
    { name: 'Mobile', value: 10500 }
  ];

  devicesReqStatus = 2;

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

  transactionsData = [
    {
      metricTitle: 'usuarios *',
      metricName: 'users',
      metricValue: 173199,
      metricFormat: 'integer'
    },
    {
      metricTitle: 'transacciones',
      metricName: 'transactions',
      metricValue: 6695,
      metricFormat: 'integer'
    },
    {
      metricTitle: 'tasa de conversión',
      metricName: 'transactions',
      metricValue: 3.9,
      metricFormat: 'percentage',
    }
  ]

  trafficVsConversions = [{
    date: '2021-03-15',
    traffic: 1298,
    conversions: 66,
  }, {
    date: '2021-03-16',
    traffic: 816,
    conversions: 39,
  }, {
    date: '2021-03-17',
    traffic: 1963,
    conversions: 43,
  }, {
    date: '2021-03-18',
    traffic: 1809,
    conversions: 29,
  }, {
    date: '2021-03-19',
    traffic: 1434,
    conversions: 36,
  }, {
    date: '2021-03-20',
    traffic: 2359,
    conversions: 16,
  }, {
    date: '2021-03-21',
    traffic: 2114,
    conversions: 66,
  }];

  conversionByCategories = [
    {
      metricTitle: 'ps',
      metricName: 'ps',
      metricValue: 2.6,
      metricFormat: 'percentage'
    },
    {
      metricTitle: 'hw Print',
      metricName: 'hw_print',
      metricValue: 7.6,
      metricFormat: 'percentage'
    },
    {
      metricTitle: 'Supplies',
      metricName: 'supplies',
      metricValue: 16.2,
      metricFormat: 'percentage',
    }
  ]

  transactionsByProduct = [
    { product: 'Impresora Multifunción HP In 2', transactions: 7 },
    { product: 'Impresora HP Ink Tank 115 - HP 2', transactions: 8 },
    { product: 'Impresora Multifunción HP Ink 2', transactions: 10 },
    { product: 'Impresora Láser HP 107W - HP 2', transactions: 20 },
    { product: 'Impresora Multifunción HP Deskjet 2', transactions: 25 },
    { product: 'Impresora HP Deskjet Ink Advance 2', transactions: 28 },
    { product: 'Impresora Multifunción HP In', transactions: 30 },
    { product: 'Impresora HP Ink Tank 115 - HP', transactions: 37 },
    { product: 'Impresora Multifunción HP Ink', transactions: 41 },
    { product: 'Impresora Láser HP 107W - HP', transactions: 41 },
    { product: 'Impresora Multifunción HP Deskjet', transactions: 74 },
    { product: 'Impresora HP Deskjet Ink Advance', transactions: 89 },

  ]

  aupVsRevenue = [{
    date: '2021-03-15',
    revenue: 2816.232,
    aup: 35977,
  }, {
    date: '2021-03-16',
    revenue: 3517.643,
    aup: 22677,
  }, {
    date: '2021-03-17',
    revenue: 8923.765,
    aup: 25541,
  }, {
    date: '2021-03-18',
    revenue: 6205.837,
    aup: 28172,
  }, {
    date: '2021-03-19',
    revenue: 2326.599,
    aup: 26498,
  }, {
    date: '2021-03-20',
    revenue: 3585.788,
    aup: 43770,
  }, {
    date: '2021-03-21',
    revenue: 4850.785,
    aup: 40874,
  }];

  categoryAndUsersColumns: string[] = ['category', 'users', 'conversion_rate', 'conversion_rate_yoy', 'amount', 'amount_yoy', 'revenue', 'revenue_yoy', 'aup', 'aup_yoy'];
  private categoryAndUsers = [
    { category: 'PS', users: 5388, conversion_rate: 8, conversion_rate_yoy: 2, amount: 300, amount_yoy: -3, revenue: 3480, revenue_yoy: 6, aup: 10358, aup_yoy: -1 },
    { category: 'HW Print', users: 2345, conversion_rate: 16, conversion_rate_yoy: 14, amount: 150, amount_yoy: 4, revenue: 7350, revenue_yoy: -4, aup: 10358, aup_yoy: 8 },
    { category: 'Supplies', users: 1345, conversion_rate: 3, conversion_rate_yoy: -4, amount: 180, amount_yoy: 8, revenue: 12000, revenue_yoy: 0, aup: 10358, aup_yoy: -3 }
  ];

  categoryAndUsersSource = new MatTableDataSource<any>(this.categoryAndUsers);
  categoryAndUsersReqStatus = 2;


  usersTransactionsConversion = {
    'Ene 21': {
      'users': 1517,
      'transactions': 68,
      'conversion_rate': 5
    },
    'Feb 21': {
      'users': 2400,
      'transactions': 81,
      'conversion_rate': 6
    },
    'Abr 21': {
      'users': 2941,
      'transactions': 134,
      'conversion_rate': 7
    },
    'May 21': {
      'users': 6780,
      'transactions': 328,
      'conversion_rate': 9
    }
  }


  dataByUsersAndRevenue: any[] = this.trafficVsConversions;

  sessionsAndConversions = [{
    date: '2021-03-15',
    conversions: 2816.232,
    sessions: 35977,
  }, {
    date: '2021-03-16',
    conversions: 3517.643,
    sessions: 22677,
  }, {
    date: '2021-03-17',
    conversions: 8923.765,
    sessions: 25541,
  }, {
    date: '2021-03-18',
    conversions: 6205.837,
    sessions: 28172,
  }, {
    date: '2021-03-19',
    conversions: 2326.599,
    sessions: 26498,
  }, {
    date: '2021-03-20',
    conversions: 3585.788,
    sessions: 43770,
  }, {
    date: '2021-03-21',
    conversions: 4850.785,
    sessions: 40874,
  }];


  selectedTab1 = 1;
  selectedTab2 = 1;
  selectedTab3 = 1;
  selectedTab4 = 1;
  selectedTab5 = 1;

  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;

  countryID: number;
  retailerID: number;

  latamView: boolean;
  countryView: boolean;
  retailerView: boolean;

  constructor(
    private router: Router,
    private appStateService: AppStateService,

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
      this.getActiveView();
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
      this.getActiveView();
    });
  }

  getDataByTrafficAndSales(metricType: string) {
    this.selectedTab1 = metricType === 'traffic' ? 1 : 2;
  }

  getDataByTrafficAndSales2(metricType: string) {
    this.selectedTab4 = metricType === 'traffic' ? 1 : 2;
  }

  getDataByUsersAndRevenue(metricType: string) {
    this.selectedTab1 = metricType === 'users' ? 1 : 2;

    if (metricType === 'users') {
      this.dataByUsersAndRevenue = this.trafficVsConversions;
    } else if (metricType === 'revenue') {
      this.dataByUsersAndRevenue = this.aupVsRevenue;
    }

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
  }

  getDataByTrafficAndConversions(metricType: string) {
    this.selectedTab2 = metricType === 'traffic' ? 1 : 2;
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
  }
}
