import { Component, OnInit } from '@angular/core';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-indexed-wrapper',
  templateUrl: './indexed-wrapper.component.html',
  styleUrls: ['./indexed-wrapper.component.scss']
})
export class IndexedWrapperComponent implements OnInit {

  selectedTab1: number = 1;
  mainTabs = [
    {
      title: 'Usuarios',
      name: 'users'
    },
    {
      title: 'Usuarios nuevos',
      name: 'new_users'
    },
    {
      title: 'Sesiones',
      name: 'sessions'
    },
    {
      title: 'Porcentaje de rebote',
      name: 'bounce_rate'
    },
    {
      title: 'Páginas/sesión',
      name: 'pages_sessions'
    },
    {
      title: 'Duración media de la sesión',
      name: 'avg_session_duration'
    }
  ];

  trafficDemographics = {
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

  trafficDemoStatus = [
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

  brAndPagesView = [
    {
      name: 'Porcentaje de salidas',
      serie: [
        { date: '2021-03-15', value: 10 },
        { date: '2021-03-16', value: 12 },
        { date: '2021-03-17', value: 18 },
        { date: '2021-03-18', value: 35 },
        { date: '2021-03-19', value: 41 },
        { date: '2021-03-20', value: 25 },
        { date: '2021-03-21', value: 44 }
      ],
      valueFormat: '%'
    },
    {
      name: 'Porcentaje de rebote',
      serie: [
        { date: '2021-03-15', value: 30 },
        { date: '2021-03-16', value: 15 },
        { date: '2021-03-17', value: 18 },
        { date: '2021-03-18', value: 25 },
        { date: '2021-03-19', value: 12 },
        { date: '2021-03-20', value: 8 },
        { date: '2021-03-21', value: 45 }
      ],
      valueFormat: '%'
    },
    {
      name: 'Número de páginas vistas',
      serie: [
        { date: '2021-03-15', value: 7 },
        { date: '2021-03-16', value: 6 },
        { date: '2021-03-17', value: 5 },
        { date: '2021-03-18', value: 2 },
        { date: '2021-03-19', value: 3 },
        { date: '2021-03-20', value: 1 },
        { date: '2021-03-21', value: 6 }
      ]
    }
  ]

  sessionsVsRetVisitor = [
    { category: 'Visitantes nuevos', value: 3200 },
    { category: 'Visitante recurrentes', value: 2800 }
  ]

  categoryCoverage = [
    { category: 'Beauty & Wellness/Frequently Visits Salons', users: 1600 },
    { category: 'Lifestyles & Hobbies/Family-Focused', users: 2000 },
    { category: 'Technology/Technophiles', users: 2400 },
    { category: 'Home & Garden/Do-It-Yourselfers', users: 2900 },
    { category: 'Lifestyles & Hobbies/Green Living Enthusiasts', users: 3200 },
    { category: 'Shoppers/Luxury Shoppers', users: 3600 },
    { category: 'Lifestyles & Hobbies/Business Professional', users: 3800 },
    { category: 'Media & Entertainment/Movie Lovers', users: 4000 },
    { category: 'Food & Dining/Cooking Enthusiasts/30 Minute Chefs', users: 4500 },
    { category: 'Shoppers/Value Shoppers', users: 4731 },
  ];

  marketSegment = [
    { category: 'Autos & Vehicles/Motor Vehicles/Motor Vehicles (Used)', users: 1200 },
    { category: 'Autos & Vehicles/Motor Vehicles/Motor Vehicles (New)', users: 1400 },
    { category: 'Business Services/Advertising & Marketing Services', users: 1600 },
    { category: 'Computers & Peripherals/Computers/Laptops', users: 1700 },
    { category: 'Financial Services/Credit & Lending', users: 1990 },
    { category: 'Home & Garden/Home Appliances', users: 2300 },
    { category: 'Financial Services/Investment Services', users: 2400 },
    { category: 'Financial Services/Credit & Lending/Credit Cards', users: 3100 },
    { category: 'Consumer Electronics/Mobile Phones', users: 3200 },
    { category: 'Financial Services/Banking Services', users: 4731 },
  ]

  mostVistitedColumns: TableItem[] = [
    {
      name: 'rank',
      title: 'Posición'
    },
    {
      name: 'category',
      title: 'categoría del evento',
      tooltip: true,
    },
    {
      name: 'sessions',
      title: 'Sessiones',
      textAlign: 'center',
      formatValue: 'integer',
    }
  ];

  mostVisitedModels = {
    data: [
      { rank: 1, category: 'Impresora Multifuncional HP Ink', sessions: 24569 },
      { rank: 2, category: 'Impresora Multifuncional HP Ink 2', sessions: 23547 },
      { rank: 3, category: 'Cartucho HP 662 preto Original', sessions: 22475 },
      { rank: 4, category: 'Cartucho HP 664 preto Original', sessions: 14685 },
      { rank: 5, category: 'Cartucho tinta HP 122 preto Original', sessions: 14145 }
    ],
    reqStatus: 2
  }

  mostVisitedCategories = {
    data: [
      { rank: 1, category: 'Cartucho HP 662 preto Original', sessions: 22475 },
      { rank: 2, category: 'Cartucho HP 664 preto Original', sessions: 14685 },
      { rank: 3, category: 'Cartucho tinta HP 122 preto Original', sessions: 14145 },
      { rank: 4, category: 'Impresora Multifuncional HP Ink', sessions: 24569 },
      { rank: 5, category: 'Impresora Multifuncional HP Ink 2', sessions: 23547 },
    ],
    reqStatus: 2
  }

  constructor() { }

  ngOnInit(): void {
  }

  getDataByMetric(metric: string, selectedTab: number) {
    this.selectedTab1 = selectedTab;
  }
}
