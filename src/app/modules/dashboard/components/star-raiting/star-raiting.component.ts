import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-raiting',
  templateUrl: './star-raiting.component.html',
  styleUrls: ['./star-raiting.component.scss']
})
export class StarRaitingComponent implements OnInit {

  @Input() value: number = 0;

  constructor() { }

  ngOnInit(): void {
  }
}
