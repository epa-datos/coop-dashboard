import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-conversion-wrapper',
  templateUrl: './conversion-wrapper.component.html',
  styleUrls: ['./conversion-wrapper.component.scss']
})
export class ConversionWrapperComponent implements OnInit {

  // kpis
  kpis: any[] = [
    {
      metricTitle: 'cantidad',
      metricName: 'quantity',
      metricValue: 0,
      metricFormat: 'integer',
      icon: 'fas fa-chart-line',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'revenue',
      metricName: 'revenue',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2f9998'
    },
    {
      metricTitle: 'aup',
      metricName: 'aup',
      metricValue: 0,
      metricFormat: 'decimals',
      metricSymbol: 'USD',
      icon: 'fas fa-file-invoice-dollar',
      iconBg: '#a77dcc'
    }
  ];
  kpisReqStatus: number = 0;

  // products
  productsTableColumns: TableItem[] = [
    {
      name: 'category',
      title: 'Categoría'
    },
    {
      name: 'product',
      title: 'Producto',
      tooltip: true,
      maxWidthColumn: 25
    },
    {
      name: 'amount',
      title: 'Cantidad',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'yoy_amount',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage'
    },
    {
      name: 'product_revenue',
      title: 'Revenue del producto',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'yoy_product_revenue',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage'
    },
    {
      name: 'aup',
      title: 'AUP',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'yoy_aup',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage'
    }
  ];
  products = {
    data: [],
    reqStatus: 0
  };

  // users vs transactions & amount vs aup
  usersAndAmount: any[] = [];
  usersAndAmountReqStatus: number = 0;
  selectedTab: number = 1;

  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService
  ) { }

  ngOnInit(): void {
    this.getAllData();

    this.generalFiltersSub = this.filtersStateService.filtersChange$.subscribe(() => {
      this.getAllData();
    })

    this.retailFiltersSub = this.filtersStateService.retailFiltersChange$.subscribe(() => {
      this.getAllData();
    });
  }

  getAllData() {
    this.getKpis();
    this.getProducts();
    this.getDataByMetric(this.selectedTab === 1 ? 'conversions-vs-users' : 'quantity-vs-aup');
  }

  getKpis() {
    this.kpisReqStatus = 1;
    this.campInRetailService.getDataByMetric('conversions', 'performance').subscribe(
      (resp: any[]) => {
        if (resp?.length < 1) {
          this.kpisReqStatus = 2;
          return;
        }

        for (let i = 0; i < this.kpis.length; i++) {
          const baseObj = resp.find(item => item.name === this.kpis[i].metricName);
          this.kpis[i].metricValue = baseObj.value;
        }

        this.kpisReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[conversion-wrapper.component]: ${errorMsg}`);
        this.kpisReqStatus = 3;
      });
  }

  getProducts() {
    this.products.reqStatus = 1;
    this.campInRetailService.getDataByMetric('conversions', 'products').subscribe(
      (products: any[]) => {
        // provisional until data exists
        this.products.data = products.map(item => {
          return { ...item, yoy_amount: '-', yoy_product_revenue: '-', yoy_aup: '-' };
        });

        this.products.reqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[conversion-wrapper.component]: ${errorMsg}`);
        this.products.reqStatus = 3;
      });
  }

  getDataByMetric(metricType: string) {
    this.usersAndAmountReqStatus = 1;
    this.campInRetailService.getDataByMetric(metricType).subscribe(
      (resp: any[]) => {
        this.usersAndAmount = resp;

        this.usersAndAmountReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[conversion-wrapper.component]: ${errorMsg}`);
        this.usersAndAmountReqStatus = 3;
      });

    this.selectedTab = metricType === 'conversions-vs-users' ? 1 : 2
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
  }
}
