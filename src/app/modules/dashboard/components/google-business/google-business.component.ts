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

  visitsVsRate = [
    { date: moment(new Date(2021, 3, 15)).format('MMM DD'), value1: 1200, value2: 200 },
    { date: moment(new Date(2021, 3, 16)).format('MMM DD'), value1: 1600, value2: 230 },
    { date: moment(new Date(2021, 3, 17)).format('MMM DD'), value1: 1400, value2: 180 },
    { date: moment(new Date(2021, 3, 18)).format('MMM DD'), value1: 1250, value2: 80 },
    { date: moment(new Date(2021, 3, 19)).format('MMM DD'), value1: 800, value2: 60 },
    { date: moment(new Date(2021, 3, 20)).format('MMM DD'), value1: 1000, value2: 110 },
    { date: moment(new Date(2021, 3, 21)).format('MMM DD'), value1: 1100, value2: 120 }
  ]

  displayedColumns: string[] = ['province', 'city', 'store', 'visits', 'visitRate'];
  private categories = [
    { province: 'Buenos Aires', city: 'Moreno', store: 'Francisco Narciso de Laprida 386', visits: 250, visitRate: 14.45 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Flores', store: 'Laprida 394', visits: 114, visitRate: 14.85 },
    { province: 'Córdoba', city: 'Córdoba', store: 'Avenida Cabildo 2075', visits: 150, visitRate: 13.14 },
    { province: 'Buenos Aires', city: 'Castelar', store: 'Hipolito Yrigoyen 769 (Ex ruta 197)', visits: 130, visitRate: 14.12 },
    { province: 'Mendoza', city: 'Ciudad Autonoma de Buenos Aires', store: 'Belgrano', visits: 118, visitRate: 14.10 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Buenos Aires', store: 'Av Gral. Fernández de la Cruz 4602', visits: 195, visitRate: 8.85 },
    { province: 'Ciudad autonoma de buenos Aires', city: 'Belgrano', store: 'Avenida Rivadavia 5249', visits: 180, visitRate: 12.26 },
  ]
  dataSource = new MatTableDataSource<any>(this.categories);

  @ViewChild(MatPaginator) paginator: MatPaginator;


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
