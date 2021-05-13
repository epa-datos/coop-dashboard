import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: RetailerComponent }
  ]
})
export class RetailerComponent implements OnInit, AfterViewInit, OnDestroy {
  countryName;
  retailerName;
  retailerID: number;

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
      ]
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
      ],
      customLineStye: 'dashed',
      // customLineColor: '#228b22'
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
      ],
      customLineStye: 'dashed'
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
      iconBg: '#0096d6'

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

  retailerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private appStateServ: AppStateService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
      this.retailerName = params['retailer']
    });

    this.retailerSub = this.appStateServ.selectedRetailer$
      .subscribe(
        retailer => {
          this.retailerID = retailer?.id;
        },
        error => {
          console.error(`[retailer.component]: ${error}`);
        }
      )
  }

  ngAfterViewInit() {
    // this.loadPaginator();
  }


  panelChange(panel, value) {
    this.extPanelIsOpen[panel] = value
  }

  ngOnDestroy() {
    this.retailerSub?.unsubscribe();
  }
}
