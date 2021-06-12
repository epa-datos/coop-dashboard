import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-behaviour-wrapper',
  templateUrl: './behaviour-wrapper.component.html',
  styleUrls: ['./behaviour-wrapper.component.scss']
})
export class BehaviourWrapperComponent implements OnInit, OnDestroy {

  salesVsRetVisitor = [
    { category: 'Visitantes nuevos', value: 130 },
    { category: 'Visitante recurrentes', value: 240 }
  ];

  sessionsByAudience = [
    { category: 'Prospecting', value: 49500 },
    { category: 'Remarketing', value: 15400 },
  ];

  quantityByAudience = [
    { category: 'Prospecting', value: 357 },
    { category: 'Remarketing', value: 18 },
  ];

  revenueVsAupAudience = [
    { category: 'Prospecting', revenue: 1200, aup: 400 },
    { category: 'Remarketing', revenue: 1600, aup: 810 }
  ];

  brVsPagesViewed: any[] = [];
  brVsPagesViewedReqStatus: number = 0;

  behavior = {};
  behaviorReqStatus = [
    { name: 'newUsersVsCurrent', reqStatus: 0 },
    { name: 'salesBySource', reqStatus: 0 },
    { name: 'salesBySector', reqStatus: 0 },
    { name: 'sessionsByAudience', reqStatus: 0 },
  ]

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
      { subMetricType: 'sales-by-source', name: 'salesBySource' },
      { subMetricType: 'sales-by-sector', name: 'salesBySector' },
      { subMetricType: 'sessions-by-audience', name: 'sessionsByAudience' },
    ];

    for (let subMetric of requiredData) {
      const reqStatusObj = this.behaviorReqStatus.find(item => item.name === subMetric.name);
      reqStatusObj.reqStatus = 1;

      this.campInRetailService.getDataByMetric('behavior', subMetric.subMetricType).subscribe(
        (resp: any[]) => {
          this.behavior[subMetric.name] = resp;

          reqStatusObj.reqStatus = 2;
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[behavior.component]: ${errorMsg}`);
          reqStatusObj.reqStatus = 3;
        });
    }
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
  }
}
