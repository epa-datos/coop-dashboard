import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-acquisition-wrapper',
  templateUrl: './acquisition-wrapper.component.html',
  styleUrls: ['./acquisition-wrapper.component.scss']
})
export class AcquisitionWrapperComponent implements OnInit, AfterViewInit {

  usersBySectors = [
    {
      name: 'Search',
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
      name: 'Marketing',
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
      name: 'Ventas',
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

  usersBySources = [
    {
      name: 'Fuente 1',
      serie: [
        { date: new Date(2021, 3, 15), value: 2800 },
        { date: new Date(2021, 3, 16), value: 1500 },
        { date: new Date(2021, 3, 17), value: 3400 },
        { date: new Date(2021, 3, 18), value: 3200 },
        { date: new Date(2021, 3, 19), value: 3150 },
        { date: new Date(2021, 3, 20), value: 2900 },
        { date: new Date(2021, 3, 21), value: 3400 }
      ]
    },
    {
      name: 'Fuente 2',
      serie: [
        { date: new Date(2021, 3, 15), value: 1400 },
        { date: new Date(2021, 3, 16), value: 1300 },
        { date: new Date(2021, 3, 17), value: 1250 },
        { date: new Date(2021, 3, 18), value: 1100 },
        { date: new Date(2021, 3, 19), value: 1300 },
        { date: new Date(2021, 3, 20), value: 1450 },
        { date: new Date(2021, 3, 21), value: 1580 }
      ]
    },
    {
      name: 'Fuente 3',
      serie: [
        { date: new Date(2021, 3, 15), value: 4800 },
        { date: new Date(2021, 3, 16), value: 2500 },
        { date: new Date(2021, 3, 17), value: 3600 },
        { date: new Date(2021, 3, 18), value: 3700 },
        { date: new Date(2021, 3, 19), value: 3600 },
        { date: new Date(2021, 3, 20), value: 3650 },
        { date: new Date(2021, 3, 21), value: 3800 }
      ]
    },
    {
      name: 'Fuente 4',
      serie: [
        { date: new Date(2021, 3, 15), value: 1300 },
        { date: new Date(2021, 3, 16), value: 1850 },
        { date: new Date(2021, 3, 17), value: 2100 },
        { date: new Date(2021, 3, 18), value: 2150 },
        { date: new Date(2021, 3, 19), value: 2200 },
        { date: new Date(2021, 3, 20), value: 2300 },
        { date: new Date(2021, 3, 21), value: 2400 }
      ]
    },
    {
      name: 'Fuente 5',
      serie: [
        { date: new Date(2021, 3, 15), value: 230 },
        { date: new Date(2021, 3, 16), value: 150 },
        { date: new Date(2021, 3, 17), value: 160 },
        { date: new Date(2021, 3, 18), value: 150 },
        { date: new Date(2021, 3, 19), value: 200 },
        { date: new Date(2021, 3, 20), value: 250 },
        { date: new Date(2021, 3, 21), value: 480 }
      ]
    }
  ]

  displayedColumns: string[] = ['source', 'way', 'campaign', 'users', 'newUsers', 'sessions', 'pagesBySession', 'bounceRate', 'sessionDuration', 'amount', 'income', 'yoy'];
  private acqBySources = [
    { source: 'Fuente 1', way: 'Medio 1', campaign: 'Campaña 1', users: 7000, newUsers: 450, sessions: 1500, pagesBySession: 7, bounceRate: 50, sessionDuration: '3 min', amount: 50, income: 35000, yoy: 20 },
    { source: 'Fuente 2', way: 'Medio 2', campaign: 'Campaña 2', users: 2000, newUsers: 120, sessions: 1200, pagesBySession: 6, bounceRate: 70, sessionDuration: '4 min', amount: 20, income: 28000, yoy: 18 },
    { source: 'Fuente 3', way: 'Medio 3', campaign: 'Campaña 3', users: 1800, newUsers: 380, sessions: 1600, pagesBySession: 4, bounceRate: 60, sessionDuration: '6 min', amount: 15, income: 15000, yoy: 21 },
    { source: 'Fuente 4', way: 'Medio 4', campaign: 'Campaña 4', users: 9750, newUsers: 270, sessions: 880, pagesBySession: 7, bounceRate: 55, sessionDuration: '2 min', amount: 50, income: 17000, yoy: 14 },

  ];
  dataSource = new MatTableDataSource<any>(this.acqBySources);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadPaginator();
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
