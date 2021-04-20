import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-stat',
  templateUrl: './card-stat.component.html',
  styleUrls: ['./card-stat.component.scss']
})
export class CardStatComponent implements OnInit {

  @Input() stat;
  @Input() height: string = '120px' // valid css height property value

  constructor() { }

  ngOnInit(): void {
  }

}
