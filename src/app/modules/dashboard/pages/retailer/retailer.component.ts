import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { MatFormFieldControl } from '@angular/material/form-field';


@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: RetailerComponent }
  ]
})
export class RetailerComponent implements OnInit, AfterViewInit {

  countryName;
  retailerName;
  activeTabView: number = 1;

  campMetrics = [
    {
      name: 'Inversión',
      serie: [
        { date: new Date(2021, 3, 15), value: 25000 },
        { date: new Date(2021, 3, 16), value: 47000 },
        { date: new Date(2021, 3, 17), value: 50000 },
        { date: new Date(2021, 3, 18), value: 45000 },
        { date: new Date(2021, 3, 19), value: 41000 },
        { date: new Date(2021, 3, 20), value: 43500 },
        { date: new Date(2021, 3, 21), value: 44000 },
      ],
      disable: true,
    },
    {
      name: 'Impresiones',
      serie: [
        { date: new Date(2021, 3, 15), value: 20000 },
        { date: new Date(2021, 3, 16), value: 35000 },
        { date: new Date(2021, 3, 17), value: 40000 },
        { date: new Date(2021, 3, 18), value: 36000 },
        { date: new Date(2021, 3, 19), value: 38500 },
        { date: new Date(2021, 3, 20), value: 37000 },
        { date: new Date(2021, 3, 21), value: 38700 }
      ]
    },
    {
      name: 'Clicks',
      serie: [
        { date: new Date(2021, 3, 15), value: 45000 },
        { date: new Date(2021, 3, 16), value: 37000 },
        { date: new Date(2021, 3, 17), value: 40000 },
        { date: new Date(2021, 3, 18), value: 39000 },
        { date: new Date(2021, 3, 19), value: 37000 },
        { date: new Date(2021, 3, 20), value: 38500 },
        { date: new Date(2021, 3, 21), value: 38000 }
      ]
    },
    {
      name: 'Conversiones',
      serie: [
        { date: new Date(2021, 3, 15), value: 30000 },
        { date: new Date(2021, 3, 16), value: 27510 },
        { date: new Date(2021, 3, 17), value: 50000 },
        { date: new Date(2021, 3, 18), value: 52000 },
        { date: new Date(2021, 3, 19), value: 54000 },
        { date: new Date(2021, 3, 20), value: 50000 },
        { date: new Date(2021, 3, 21), value: 48000 },
      ]
    }
  ]

  displayedColumns: string[] = ['name', 'investment', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc'];
  private campaigns = [
    { name: 'Campaign 1', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50 },
    { name: 'Campaign 2', investment: 7000, impressions: 150000, clicks: 8000, ctr: 25.55, ctr_benchmark: 22.12, cpm: 450, cpc: 30 },
    { name: 'Campaign 3', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80 }
  ];
  dataSource = new MatTableDataSource<any>(this.campaigns);
  getReqStatus: number = 0;

  stats: any[] = [
    {
      metricTitle: 'Inversión',
      metricValue: 'USD 35,000',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'Clicks',
      metricValue: '280,0000',
      subMetricTitle: 'CTR',
      subMetricValue: '000',
      icon: 'fas fa-hand-pointer',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'Bounce Rate',
      metricValue: '12%',
      subMetricTitle: 'Usuarios',
      subMetricValue: '27000',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'Transacciones',
      metricValue: '3,500',
      subMetricTitle: 'CR',
      subMetricValue: '000',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'Revenue',
      metricValue: '3,500',
      subMetricTitle: 'ROAS',
      subMetricValue: '000',
      icon: 'fas fa-hand-holding-usd',

      iconBg: '#fbc001'

    }
  ];

  extPanelIsOpen = {
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
      this.retailerName = params['retailer']
    });
  }

  ngAfterViewInit() {
    this.loadPaginator();
  }


  panelChange(panel, value) {
    this.extPanelIsOpen[panel] = value
  }

  loadPaginator() {
    // paginator setup
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

      return `${startIndex + 1} - ${endIndex} de ${length}`;
    }
  }

}
