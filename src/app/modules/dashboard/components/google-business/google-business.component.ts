import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment'

@Component({
  selector: 'app-google-business',
  templateUrl: './google-business.component.html',
  styleUrls: ['./google-business.component.scss']
})
export class GoogleBusinessComponent implements OnInit, AfterViewInit {

  provinces = new FormControl();
  provinceList: any[] = [{ id: 1, name: 'Provincia 1' }, { id: 2, name: 'Provincia 2' }, { id: 3, name: 'Provincia 3' }, { id: 4, name: 'Provincia 4' }];

  cities = new FormControl();
  cityList: any[] = [{ id: 1, name: 'Ciudad 1' }, { id: 2, name: 'Ciudad 2' }, { id: 3, name: 'Ciudad 3' }, { id: 4, name: 'Ciudad 4' }, { id: 5, name: 'Ciudad 5' }, { id: 3, name: 'Ciudad 6' }];
  constructor() { }

  visitsVsRate = [{
    'date': '2021-03-15',
    'visits': 1298,
    'visits_rate': 0.68,
  }, {
    'date': '2021-03-16',
    'visits': 816,
    'visits_rate': 0.71,
  }, {
    'date': '2021-03-17',
    'visits': 1963,
    'visits_rate': 0.7,
  }, {
    'date': '2021-03-18',
    'visits': 1809,
    'visits_rate': 0.83,
  }, {
    'date': '2021-03-19',
    'visits': 1434,
    'visits_rate': 0.8,
  }, {
    'date': '2021-03-20',
    'visits': 2359,
    'visits_rate': 0.91,
  }, {
    'date': '2021-03-21',
    'visits': 2114,
    'visits_rate': 1,
  },];

  displayedColumns: string[] = ['province', 'city', 'store', 'visits', 'visitRate'];
  displayedColumns2: string[] = ['province', 'city', 'store', 'visits', 'storeVisitsRate'];
  private categories = [
    { province: 'Buenos Aires', city: 'Moreno', store: 'Francisco Narciso de Laprida 386', visits: 250, visitRate: 14.45, storeVisitsRate: 12.12 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Flores', store: 'Laprida 394', visits: 114, visitRate: 14.85, storeVisitsRate: 14.05 },
    { province: 'Córdoba', city: 'Córdoba', store: 'Avenida Cabildo 2075', visits: 150, visitRate: 13.14, storeVisitsRate: 13.01 },
    { province: 'Buenos Aires', city: 'Castelar', store: 'Hipolito Yrigoyen 769 (Ex ruta 197)', visits: 130, visitRate: 11.25, storeVisitsRate: 14.11 },
    { province: 'Mendoza', city: 'Ciudad Autonoma de Buenos Aires', store: 'Belgrano', visits: 118, visitRate: 14.10, storeVisitsRate: 13.12 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Buenos Aires', store: 'Av Gral. Fernández de la Cruz 4602', visits: 195, visitRate: 8.85, storeVisitsRate: 8.32 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Belgrano', store: 'Avenida Rivadavia 5249', visits: 180, visitRate: 12.26, storeVisitsRate: 9.45 },
  ]
  dataSource = new MatTableDataSource<any>(this.categories);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedTab1 = 1;

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
