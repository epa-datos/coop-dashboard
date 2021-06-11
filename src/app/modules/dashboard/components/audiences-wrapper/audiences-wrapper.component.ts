import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-audiences-wrapper',
  templateUrl: './audiences-wrapper.component.html',
  styleUrls: ['./audiences-wrapper.component.scss']
})
export class AudiencesWrapperComponent implements OnInit, OnDestroy {

  devicesByTraffic: any[] = [
    { id: 1, name: 'Desktop', value: 2500 },
    { id: 2, name: 'Mobile', value: 10500 },
  ]

  devicesByConversions: any[] = [
    { id: 1, name: 'Desktop', value: 300 },
    { id: 2, name: 'Mobile', value: 450 },
  ]

  desktopByBR: any[] = [
    { name: 'empty', value: 55 },
    { id: 1, name: 'Desktop', value: 45 },
  ]

  mobileByBR: any[] = [
    { name: 'empty', value: 20 },
    { id: 1, name: 'Mobile', value: 80 },
  ]

  womenByBR: any[] = [
    { name: 'empty', value: 55 },
    { id: 1, name: 'woman', value: 45 },
  ]

  menByBR: any[] = [
    { name: 'empty', value: 30 },
    { id: 1, name: 'men', value: 70 },
  ]


  genderByTraffic: any[] = [
    { id: 1, name: 'Hombre', value: 5500 },
    { id: 2, name: 'Mujer', value: 7500 },
  ]

  genderByConversions: any[] = [
    { id: 1, name: 'Hombre', value: 1200 },
    { id: 2, name: 'Mujer', value: 12800 },
  ]

  ageByTraffic: any[] = [
    {
      'age': '15-19',
      'value': 3.8
    }, {
      'age': '20-24',
      'value': 5.1
    }, {
      'age': '25-29',
      'value': 5.1
    }, {
      'age': '30-34',
      'value': 4.8
    }, {
      'age': '35-39',
      'value': 4.1
    }, {
      'age': '40-44',
      'value': 3.6
    }, {
      'age': '45-49',
      'value': 3.0
    }, {
      'age': '50-54',
      'value': 2.5
    }, {
      'age': '55-59',
      'value': 1.9
    }, {
      'age': '60-64',
      'value': 1.3
    }, {
      'age': '65-69',
      'value': 1.0
    }, {
      'age': '70-74',
      'value': 0.8
    }, {
      'age': '75-79',
      'value': 0.6
    }, {
      'age': '80-54',
      'value': 0.3
    }, {
      'age': '85+',
      'value': 0.3
    }
  ]

  ageByConversions: any[] = [
    {
      'age': '15-19',
      'value': 1.8
    }, {
      'age': '20-24',
      'value': 7.5
    }, {
      'age': '25-29',
      'value': 8.1
    }, {
      'age': '30-34',
      'value': 6.8
    }, {
      'age': '35-39',
      'value': 5.1
    }, {
      'age': '40-44',
      'value': 4.6
    }, {
      'age': '45-49',
      'value': 3.0
    }, {
      'age': '50-54',
      'value': 2.8
    }, {
      'age': '55-59',
      'value': 2.0
    }, {
      'age': '60-64',
      'value': 1.6
    }, {
      'age': '65-69',
      'value': 1.2
    }, {
      'age': '70-74',
      'value': 0.5
    }, {
      'age': '75-79',
      'value': 0.4
    }, {
      'age': '80-54',
      'value': 0.3
    }, {
      'age': '85+',
      'value': 0.1
    }
  ]

  ageByAup: any[] = [
    {
      'age': '15-19',
      'value': 150
    }, {
      'age': '20-24',
      'value': 560
    }, {
      'age': '25-29',
      'value': 750
    }, {
      'age': '30-34',
      'value': 780
    }, {
      'age': '35-39',
      'value': 640
    }, {
      'age': '40-44',
      'value': 600
    }, {
      'age': '45-49',
      'value': 420
    }, {
      'age': '50-54',
      'value': 415
    }, {
      'age': '55-59',
      'value': 350
    }, {
      'age': '60-64',
      'value': 300
    }, {
      'age': '65-69',
      'value': 300
    }, {
      'age': '70-74',
      'value': 250
    }, {
      'age': '75-79',
      'value': 230
    }, {
      'age': '80-54',
      'value': 200
    }, {
      'age': '85+',
      'value': 185
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

  ageByGenderConversions: any[] = [
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

  ageByGenderByAup: any[] = [
    {
      'age': '85+',
      'male': -70,
      'female': 75
    }, {
      'age': '80-54',
      'male': -80,
      'female': 85
    }, {
      'age': '75-79',
      'male': -95,
      'female': 105
    }, {
      'age': '70-74',
      'male': -115,
      'female': 100
    }, {
      'age': '65-69',
      'male': -120,
      'female': 135
    }, {
      'age': '60-64',
      'male': -126,
      'female': 155
    }, {
      'age': '55-59',
      'male': -180,
      'female': 185
    }, {
      'age': '50-54',
      'male': -250,
      'female': 280
    }, {
      'age': '45-49',
      'male': -265,
      'female': 265
    }, {
      'age': '40-44',
      'male': -320,
      'female': 300
    }, {
      'age': '35-39',
      'male': -350,
      'female': 370
    }, {
      'age': '30-34',
      'male': -450,
      'female': 480
    }, {
      'age': '25-29',
      'male': -650,
      'female': 700
    }, {
      'age': '20-24',
      'male': -750,
      'female': 720
    }, {
      'age': '15-19',
      'male': -250,
      'female': 280
    }
  ]

  devices: any[] = this.devicesByTraffic;
  gender: any[] = this.genderByTraffic;
  age: any[] = this.ageByTraffic;
  ageByGender: any[] = this.ageByGenderTraffic;

  selectedTab1: number = 1;
  selectedTab2: number = 1;

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

  conversionsTrafficPerDay = [
    { date: new Date(2021, 3, 15), value1: 150, value2: 280, },
    { date: new Date(2021, 3, 16), value1: 280, value2: 550 },
    { date: new Date(2021, 3, 17), value1: 130, value2: 430 },
    { date: new Date(2021, 3, 18), value1: 140, value2: 470 },
    { date: new Date(2021, 3, 19), value1: 160, value2: 500 },
    { date: new Date(2021, 3, 20), value1: 80, value2: 750 },
    { date: new Date(2021, 3, 21), value1: 88, value2: 650 }
  ]

  conversionsTrafficPerHour = [
    { date: '07:00', value1: 2, value2: 16 },
    { date: '09:00', value1: 9, value2: 45 },
    { date: '12:00', value1: 13, value2: 30 },
    { date: '15:00', value1: 10, value2: 18 },
    { date: '18:00', value1: 16, value2: 50 },
    { date: '20:00', value1: 6, value2: 16 },
    { date: '22:00', value1: 3, value2: 60 },
    { date: '23:00', value1: 9, value2: 14 }
  ]

  // *************************************************

  filtersSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService
  ) { }

  ngOnInit(): void {
    this.getAllData();

    this.filtersSub = this.filtersStateService.retailFiltersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    console.log('getAllData')
  }

  changeData(category, selectedTab) {

    switch (category) {
      case 'traffic':
        this.devices = this.devicesByTraffic;
        this.gender = this.genderByTraffic;
        this.age = this.ageByTraffic;
        this.ageByGender = this.ageByGenderTraffic;
        break;

      case 'conversions':
        this.devices = this.devicesByConversions;
        this.gender = this.genderByConversions;
        this.age = this.ageByConversions;
        this.ageByGender = this.ageByGenderConversions;
        break;

      case 'aup':
        this.devices = this.devicesByConversions;
        this.gender = this.genderByConversions;
        this.age = this.ageByAup;
        this.ageByGender = this.ageByGenderByAup;
        break;

      case 'br':
        this.devices = this.devicesByTraffic;
        this.gender = this.genderByTraffic;
        this.age = this.ageByTraffic;
        this.ageByGender = this.ageByGenderTraffic;
        break;

    }
    this.selectedTab1 = selectedTab;
  }

  ngOnDestroy() {
    this.filtersSub?.unsubscribe();
  }
}
