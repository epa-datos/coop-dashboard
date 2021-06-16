import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CampaignTowardsRetailService } from '../../services/campaign-towards-retail.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-campaign-towards-retail-wrapper',
  templateUrl: './campaign-towards-retail-wrapper.component.html',
  styleUrls: ['./campaign-towards-retail-wrapper.component.scss']
})
export class CampaignTowardsRetailWrapperComponent implements OnInit, OnDestroy {
  @Input() requestInfoChange: Observable<boolean>;

  campPerformance: any[] = [];
  campPerformanceReqStatus: number = 0;

  campList: any[] = [
    {
      source: 'google',
      name: 'Google Search y MDF',
      data: [],
      reqStatus: 0
    },
    {
      source: 'display',
      name: 'Programmatic',
      data: [],
      reqStatus: 0
    },
    {
      source: 'social',
      name: 'Social Media',
      data: [],
      reqStatus: 0
    }
  ];

  campListDisplayedColumns: TableItem[] = [
    {
      name: 'name',
      title: 'Nombre',
      maxWidthTdPercentage: 40,
      maxWidthSpan: '700px',
      tooltip: true,
    },
    {
      name: 'investment',
      title: 'Inversión',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'impressions',
      title: 'Impresiones',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'clicks',
      title: 'Clicks',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'ctr',
      title: 'CTR',
      textAlign: 'center',
      formatValue: 'percentage',
      comparativeName: 'ctr_benchmark'
    },
    {
      name: 'cpm',
      title: 'CPM',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'cpc',
      title: 'CPC',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'roas',
      title: 'ROAS',
      textAlign: 'center',
      formatValue: 'percentage',
      emptyLine: true
    }
  ]

  requestInfoSub: Subscription;

  constructor(
    private campTowardsRetailServ: CampaignTowardsRetailService
  ) { }

  ngOnInit(): void {
    this.getAllData();

    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {
      this.getAllData();
    })
  }

  getAllData() {
    this.getCampaignsPerformance();
    this.getCampaignList();
  }

  getCampaignsPerformance() {
    this.campPerformanceReqStatus = 1;
    this.campTowardsRetailServ.getCampaignsPerformance().subscribe(
      (metrics: any) => {
        for (let metric of metrics) {
          if (metric.name === 'Impresiones' || metric.name === 'Clicks') {
            metric.customLineStye = 'dashed';
          }
          if (metric.name === 'Inversión') {
            metric.valueFormat = 'USD';
          }
        }

        this.campPerformance = metrics;
        this.campPerformanceReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[campaign-towards-retail.component]: ${errorMsg}`);
        this.campPerformanceReqStatus = 3;
      });
  }

  getCampaignList() {
    this.campList.forEach(item => {
      item.reqStatus = 1;
      this.campTowardsRetailServ.getCampaignsList(item.source).subscribe(
        (campaigns: any) => {
          item.data = campaigns;
          item.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[campaign-towards-retail.component]: ${errorMsg}`);
          item.reqStatus = 3;
        });
    });
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
