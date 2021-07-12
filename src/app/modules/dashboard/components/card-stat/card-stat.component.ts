import { Component, Input, OnInit } from '@angular/core';
import { KpiCard } from 'src/app/models/kpi';

@Component({
  selector: 'app-card-stat',
  templateUrl: './card-stat.component.html',
  styleUrls: ['./card-stat.component.scss']
})
export class CardStatComponent implements OnInit {

  @Input() stat: KpiCard;
  @Input() height: string = '120px' // valid css height property value
  @Input() loader: boolean;
  @Input() smallHeader: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
