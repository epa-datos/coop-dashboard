import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss']
})
export class RetailerComponent implements OnInit {

  countryName;
  retailerName;
  activeTabView: number = 1;

  campMetrics = [
    {
      name: 'Clicks',
      serie: [
        { date: new Date(2021, 1, 1), value: 25000 },
        { date: new Date(2021, 2, 1), value: 47000 },
        { date: new Date(2021, 3, 1), value: 50000 }
      ]
    },
    {
      name: 'Impresiones',
      serie: [
        { date: new Date(2021, 1, 1), value: 20000 },
        { date: new Date(2021, 2, 1), value: 35000 },
        { date: new Date(2021, 3, 1), value: 40000 }
      ]
    },
    {
      name: 'CPC',
      serie: [
        { date: new Date(2021, 1, 1), value: 45000 },
        { date: new Date(2021, 2, 1), value: 37000 },
        { date: new Date(2021, 3, 1), value: 40000 }
      ]
    },
    {
      name: 'Inversión',
      serie: [
        { date: new Date(2021, 1, 1), value: 30000 },
        { date: new Date(2021, 2, 1), value: 27510 },
        { date: new Date(2021, 3, 1), value: 50000 }
      ]
    },
    {
      name: 'Inversión',
      serie: [
        { date: new Date(2021, 1, 1), value: 30000 },
        { date: new Date(2021, 2, 1), value: 27510 },
        { date: new Date(2021, 3, 1), value: 50000 }
      ]
    }
  ]

  displayedColumns: string[] = ['name', 'investment', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc'];
  private campaigns = [
    { name: 'Campaign 1', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, cpm: 750, cpc: 50 },
    { name: 'Campaign 2', investment: 7000, impressions: 150000, clicks: 8000, ctr: 20.55, cpm: 450, cpc: 30 },
    { name: 'Campaign 3', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, cpm: 120, cpc: 80 }
  ];
  dataSource = new MatTableDataSource<any>(this.campaigns);
  getReqStatus: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
      this.retailerName = params['retailer']
    });
  }

}
