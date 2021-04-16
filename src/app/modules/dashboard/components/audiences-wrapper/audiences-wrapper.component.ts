import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audiences-wrapper',
  templateUrl: './audiences-wrapper.component.html',
  styleUrls: ['./audiences-wrapper.component.scss']
})
export class AudiencesWrapperComponent implements OnInit {

  trafficByMonths = []

  genderConversion = [
    { gender: 'Hombre', value: 19000 },
    { gender: 'Mujer', value: 23500 }
  ]

  genderAUP = [
    { gender: 'Hombre', value: 17000 },
    { gender: 'Mujer', value: 21000 }
  ]

  genderBR = [
    { gender: 'Hombre', value: 34000 },
    { gender: 'Mujer', value: 12000 }
  ]

  ageConversion = [
    { age: 20, value: 19000 },
    { age: 30, value: 35000 },
    { age: 40, value: 40000 },
    { age: 50, value: 23500 },
    { age: 60, value: 1200 },
    { age: 70, value: 800 },
  ]

  ageAUP = [
    { age: 20, value: 22000 },
    { age: 30, value: 15000 },
    { age: 40, value: 35000 },
    { age: 50, value: 23500 },
    { age: 60, value: 1600 },
    { age: 70, value: 700 },
  ]

  ageBR = [
    { age: 20, value: 35000 },
    { age: 30, value: 17000 },
    { age: 40, value: 12000 },
    { age: 50, value: 23500 },
    { age: 60, value: 4500 },
    { age: 70, value: 1300 },
  ]

  deviceConversion = [
    { device: 'Escritorio', value: 19000 },
    { device: 'Tablet', value: 35000 },
    { device: 'Celular', value: 40000 }
  ]

  deviceAUP = [
    { device: 'Escritorio', value: 22000 },
    { device: 'Tablet', value: 15000 },
    { device: 'Celular', value: 35000 },
  ]

  deviceBR = [
    { device: 'Escritorio', value: 35000 },
    { device: 'Tablet', value: 17000 },
    { device: 'Celular', value: 12000 },
  ]

  selectedTab1: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.getTrafficByMonths();
  }

  getTrafficByMonths() {
    let firstDate = new Date();
    firstDate.setDate(firstDate.getDate() - 90);
    let visits = 1200;
    for (var i = 0; i < 90; i++) {
      let newDate = new Date(firstDate);
      newDate.setDate(newDate.getDate() + i);

      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

      this.trafficByMonths.push({
        date: newDate,
        visits: visits
      });
    }
  }

}
