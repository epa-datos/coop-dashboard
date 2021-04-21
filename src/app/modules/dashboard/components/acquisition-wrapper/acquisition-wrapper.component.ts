import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-acquisition-wrapper',
  templateUrl: './acquisition-wrapper.component.html',
  styleUrls: ['./acquisition-wrapper.component.scss']
})
export class AcquisitionWrapperComponent implements OnInit, AfterViewInit {

  selectedTab1: number = 1;

  usersByCategory = [
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
      name: 'Google',
      serie: [
        { date: new Date(2021, 3, 15), value: 350 },
        { date: new Date(2021, 3, 16), value: 280 },
        { date: new Date(2021, 3, 17), value: 120 },
        { date: new Date(2021, 3, 18), value: 400 },
        { date: new Date(2021, 3, 19), value: 450 },
        { date: new Date(2021, 3, 20), value: 100 },
        { date: new Date(2021, 3, 21), value: 80 }
      ]
    },
    {
      name: 'Display',
      serie: [
        { date: new Date(2021, 3, 15), value: 80 },
        { date: new Date(2021, 3, 16), value: 150 },
        { date: new Date(2021, 3, 17), value: 120 },
        { date: new Date(2021, 3, 18), value: 100 },
        { date: new Date(2021, 3, 19), value: 70 },
        { date: new Date(2021, 3, 20), value: 85 },
        { date: new Date(2021, 3, 21), value: 160 }
      ]
    },
    {
      name: 'Social',
      serie: [
        { date: new Date(2021, 3, 15), value: 40 },
        { date: new Date(2021, 3, 16), value: 60 },
        { date: new Date(2021, 3, 17), value: 95 },
        { date: new Date(2021, 3, 18), value: 120 },
        { date: new Date(2021, 3, 19), value: 121 },
        { date: new Date(2021, 3, 20), value: 96 },
        { date: new Date(2021, 3, 21), value: 88 }
      ]
    },
    {
      name: 'Otros',
      serie: [
        { date: new Date(2021, 3, 15), value: 44 },
        { date: new Date(2021, 3, 16), value: 56 },
        { date: new Date(2021, 3, 17), value: 75 },
        { date: new Date(2021, 3, 18), value: 95 },
        { date: new Date(2021, 3, 19), value: 80 },
        { date: new Date(2021, 3, 20), value: 120 },
        { date: new Date(2021, 3, 21), value: 200 }
      ]
    }
  ]

  displayedColumns: string[] = ['source', 'way', 'campaign', 'users', 'newUsers', 'sessions', 'pagesBySession', 'bounceRate', 'sessionDuration', 'amount', 'income', 'yoy'];
  private acqBySources = [
    { source: 'Google', way: 'Medio 1', campaign: 'Campaña 1', users: 7000, newUsers: 450, sessions: 1500, pagesBySession: 7, bounceRate: 50, sessionDuration: '3 min', amount: 50, income: 35000, yoy: 20 },
    { source: 'Display', way: 'Medio 2', campaign: 'Campaña 2', users: 2000, newUsers: 120, sessions: 1200, pagesBySession: 6, bounceRate: 70, sessionDuration: '4 min', amount: 20, income: 28000, yoy: 18 },
    { source: 'Social', way: 'Medio 3', campaign: 'Campaña 3', users: 1800, newUsers: 380, sessions: 1600, pagesBySession: 4, bounceRate: 60, sessionDuration: '6 min', amount: 15, income: 15000, yoy: 21 },
    { source: 'Otros', way: 'Medio 4', campaign: 'Campaña 4', users: 9750, newUsers: 270, sessions: 880, pagesBySession: 7, bounceRate: 55, sessionDuration: '2 min', amount: 50, income: 17000, yoy: 14 },

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

  changeData(category, selectedTab) {
    if (category === 'source') {
      this.usersByCategory = this.usersBySources;
    } else if (category === 'sector') {
      this.usersByCategory = this.usersBySectors;
    }

    this.selectedTab1 = selectedTab;
  }
}
