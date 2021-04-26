import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-behaviour-wrapper',
  templateUrl: './behaviour-wrapper.component.html',
  styleUrls: ['./behaviour-wrapper.component.scss']
})
export class BehaviourWrapperComponent implements OnInit {

  generalBehaviour = [
    {
      name: 'Porcentaje de salidas',
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
      name: 'Porcentaje de rebote',
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
      name: 'Número de páginas vistas',
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

  sessionsVsRetVisitor = [
    { category: 'Sesiones nuevas', value: 3200 },
    { category: 'Visitante recurrente', value: 2800 }
  ]

  salesVsRetVisitor = [
    { category: 'Ventas nuevas', value: 130 },
    { category: 'Visitante recurrente', value: 240 }
  ]

  salesByConversionSource = [
    { category: 'Google', value: 100 },
    { category: 'Display', value: 30 },
    { category: 'Social', value: 40 },
    { category: 'Others', value: 10 }
  ]

  salesBySector = [
    { category: 'Search', value: 30 },
    { category: 'Marketing', value: 240 },
    { category: 'Ventas', value: 60 }
  ]

  sessionsByAudience = [
    { category: 'Prospecting', value: 49500 },
    { category: 'Remarketing', value: 15400 },
  ]

  quantityByAudience = [
    { category: 'Prospecting', value: 357 },
    { category: 'Remarketing', value: 18 },
  ]

  revenueVsAupAudience = [
    { category: 'Prospecting', revenue: 1200, aup: 400 },
    { category: 'Remarketing', revenue: 1600, aup: 810 }
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
