import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  selectedTab1: number = 1;

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
      maxWidthColumn: 35,
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
  ];

  conversionsVsInvestment: any[] = [];
  impresionsVsClicks: any[] = [];

  translateSub: Subscription;
  requestInfoSub: Subscription;

  constructor(
    private campTowardsRetailServ: CampaignTowardsRetailService,
    private translate: TranslateService,
  ) {

    this.translateSub = translate.stream('campTowardsRetail').subscribe(() => {
      this.loadI18nContent();
    });
  }

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
        // for (let metric of metrics) {
        //   if (metric.name === 'Impresiones' || metric.name === 'Clicks') {
        //     metric.customLineStye = 'dashed';
        //   }
        //   if (metric.name === 'Inversión') {
        //     metric.valueFormat = 'USD';
        //   }
        // }

        // this.campPerformance = metrics;


        for (let i = 0; i < metrics.length; i++) {
          let metricName = this.getParsedMetric(metrics[i].name);
          for (let j = 0; j < metrics[i].serie.length; j++) {
            const date = metrics[i].serie[j].date;

            let obj;
            obj = this.campPerformance.find(item => item.date === date);

            if (obj) {
              obj[metricName] = metrics[i].serie[j].value;
            } else {
              obj = { date, [metricName]: metrics[i].serie[j].value }
              this.campPerformance.push(obj);
            }
          }
        }

        this.conversionsVsInvestment = this.campPerformance.map((item: any) => {
          return { date: item.date, conversions: item.conversions, investment: item.investment, }
        });

        this.impresionsVsClicks = this.campPerformance.map((item: any) => {
          return { date: item.date, impressions: item.impressions, clicks: item.clicks, }
        });

        this.campPerformanceReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[campaign-towards-retail.component]: ${errorMsg}`);
        this.campPerformanceReqStatus = 3;
      });
  }

  getParsedMetric(metricName: string): string {
    let parsedMetric: string;

    switch (metricName.toLowerCase()) {
      case 'inversión':
        parsedMetric = 'investment';
        break;

      case 'conversiones':
        parsedMetric = 'conversions';
        break;

      case 'impresiones':
        parsedMetric = 'impressions';
        break;

      default:
        parsedMetric = metricName.toLowerCase();
    }

    return parsedMetric;
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

  loadI18nContent() {
    this.campList[0].name = this.translate.instant('campTowardsRetail.campList1');

    this.campListDisplayedColumns[0].title = this.translate.instant('general.name');
    this.campListDisplayedColumns[1].title = this.translate.instant('general.investment');
    this.campListDisplayedColumns[2].title = this.translate.instant('general.impressions');
    this.campListDisplayedColumns[3].title = this.translate.instant('general.clicks');
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
  }
}
