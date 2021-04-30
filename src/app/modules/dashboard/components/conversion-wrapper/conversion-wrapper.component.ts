import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-conversion-wrapper',
  templateUrl: './conversion-wrapper.component.html',
  styleUrls: ['./conversion-wrapper.component.scss']
})
export class ConversionWrapperComponent implements OnInit, AfterViewInit {

  stats: any[] = [
    {
      metricTitle: 'Cantidad',
      metricValue: '000',
      icon: 'fas fa-chart-line',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'Revenue',
      metricValue: '0000',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'AUP',
      metricValue: '0%',
      icon: 'fas fa-file-invoice-dollar',
      iconBg: '#a77dcc'
    }
  ];

  displayedColumns: string[] = ['category', 'product', 'amount', 'yoy_amount', 'product_revenue', 'yoy_product_revenue', 'aup', 'yoy_aup'];
  private categories = [
    { category: 'Category 1', product: 'Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1 Product 1', amount: 12, yoy_amount: 12, yoy_amount_before: 10, product_revenue: 50000, yoy_product_revenue: 15, yoy_product_revenue_before: 17, aup: 820, yoy_aup: 8, yoy_aup_before: 8 },
    { category: 'Category 2', product: 'Product 2', amount: 8, yoy_amount: 4, yoy_amount_before: 6, product_revenue: 20000, yoy_product_revenue: 7, yoy_product_revenue_before: 17, aup: 650, yoy_aup: 4, yoy_aup_before: 6 },
    { category: 'Category 3', product: 'Product 3', amount: 4, yoy_amount: -4, yoy_amount_before: -2, product_revenue: 10000, yoy_product_revenue: -2, yoy_product_revenue_before: -2, aup: 350, yoy_aup: -1, yoy_aup_before: -2 }
  ]
  dataSource = new MatTableDataSource<any>(this.categories);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  usersVsTransacctions = [
    { date: moment(new Date(2021, 3, 15)).format('MMM DD'), value1: 1200, value2: 200 },
    { date: moment(new Date(2021, 3, 16)).format('MMM DD'), value1: 1600, value2: 230 },
    { date: moment(new Date(2021, 3, 17)).format('MMM DD'), value1: 1400, value2: 180 },
    { date: moment(new Date(2021, 3, 18)).format('MMM DD'), value1: 1250, value2: 80 },
    { date: moment(new Date(2021, 3, 19)).format('MMM DD'), value1: 800, value2: 60 },
    { date: moment(new Date(2021, 3, 20)).format('MMM DD'), value1: 1000, value2: 110 },
    { date: moment(new Date(2021, 3, 21)).format('MMM DD'), value1: 1100, value2: 120 }
  ]

  amountVsAUP = [
    { date: moment(new Date(2021, 3, 15)).format('MMM DD'), value1: 1200, value2: 400 },
    { date: moment(new Date(2021, 3, 16)).format('MMM DD'), value1: 1600, value2: 810 },
    { date: moment(new Date(2021, 3, 17)).format('MMM DD'), value1: 1400, value2: 320 },
    { date: moment(new Date(2021, 3, 18)).format('MMM DD'), value1: 1250, value2: 120 },
    { date: moment(new Date(2021, 3, 19)).format('MMM DD'), value1: 800, value2: 345 },
    { date: moment(new Date(2021, 3, 20)).format('MMM DD'), value1: 1000, value2: 850 },
    { date: moment(new Date(2021, 3, 21)).format('MMM DD'), value1: 1100, value2: 900 }
  ]

  data: any[] = this.usersVsTransacctions;

  selectedTab: number = 1;

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
    if (category === 'users') {
      this.data = this.usersVsTransacctions
    } else if (category === 'amount_aup') {
      this.data = this.amountVsAUP;
    }

    this.selectedTab = selectedTab;
  }

}
