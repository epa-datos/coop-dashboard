import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-behaviour-wrapper',
  templateUrl: './behaviour-wrapper.component.html',
  styleUrls: ['./behaviour-wrapper.component.scss']
})
export class BehaviourWrapperComponent implements OnInit, OnDestroy {

  brVsPagesViewed: any[] = [];
  brVsPagesViewedReqStatus: number = 0;

  behavior = {};
  behaviorReqStatus = [
    { name: 'newUsersVsCurrent', reqStatus: 0 },
    { name: 'salesNewUsersVsCurrent', reqStatus: 0 },
    { name: 'salesBySource', reqStatus: 0 },
    { name: 'salesBySector', reqStatus: 0 },
    { name: 'sessionsByAudience', reqStatus: 0 },
    { name: 'newUsersByAudience', reqStatus: 0 },
    { name: 'quantityByAudience', reqStatus: 0 },
    { name: 'revenueAupByAudience', reqStatus: 0 },
  ]

  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;
  translateSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService,
    private translate: TranslateService
  ) {

    this.translateSub = translate.stream('behaviour').subscribe(() => {
      this.loadI18nContent();
    });
  }

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
    this.getBounceRateAndPages();
    this.getBehaviorMetrics();
  }

  getBounceRateAndPages() {
    this.brVsPagesViewedReqStatus = 1;

    this.campInRetailService.getDataByMetric('bouncerate-vs-pageviews').subscribe(
      (resp: any[]) => {
        this.brVsPagesViewed = resp;
        this.brVsPagesViewedReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[behavior.component]: ${errorMsg}`);
        this.brVsPagesViewedReqStatus = 2;
      });
  }

  getBehaviorMetrics() {
    const requiredData = [
      { subMetricType: 'new-users-vs-current', name: 'newUsersVsCurrent' },
      { subMetricType: 'sales-new-users-vs-current', name: 'salesNewUsersVsCurrent' },
      { subMetricType: 'sales-by-source', name: 'salesBySource' },
      { subMetricType: 'sales-by-sector', name: 'salesBySector' },
      { subMetricType: 'sessions-by-audience', name: 'sessionsByAudience' },
      { subMetricType: 'new-users-by-audience', name: 'newUsersByAudience' },
      { subMetricType: 'quantity-by-audience', name: 'quantityByAudience' },
      { subMetricType: 'revenue-aup-by-audience', name: 'revenueAupByAudience' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.behaviorReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;

      this.campInRetailService.getDataByMetric('behavior', subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          this.behavior[subMetric.name] = resp;
          this.loadI18nContent(subMetric.name);
          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[behavior.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  loadI18nContent(metricName?: string) {
    if (!metricName || metricName === 'newUsersVsCurrent') {
      this.behavior['newUsersVsCurrent'] = this.behavior['newUsersVsCurrent']?.map(item => {
        item.category = item.category === 'Visitantes Nuevos' ? this.translate.instant('general.newVisitors') : this.translate.instant('general.recurringVisitors');
        return item;
      });
    }

    if (!metricName || metricName === 'salesNewUsersVsCurrent') {
      this.behavior['salesNewUsersVsCurrent'] = this.behavior['salesNewUsersVsCurrent']?.map(item => {
        item.category = item.category === 'Visitantes Nuevos' ? this.translate.instant('general.newVisitors') : this.translate.instant('general.recurringVisitors');
        return item;
      });
    }

    if (!metricName || metricName === 'salesBySource') {
      const othersSource = this.behavior['salesBySource']?.find(item => item.category === 'Others');
      if (othersSource) {
        const str = this.translate.instant('others.otherPluralM');
        othersSource.category = str.charAt(0).toUpperCase() + str.slice(1);
      }
    }

    if (!metricName || metricName === 'salesBySector') {
      const salesSector = this.behavior['salesBySector']?.find(item => item.category === 'Ventas');
      salesSector && (salesSector.category = this.translate.instant('general.sales'));
    }
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
