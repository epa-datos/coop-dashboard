import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { CampaignInRetailService } from '../../services/campaign-in-retail.service';
import { FiltersStateService } from '../../services/filters-state.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-acquisition-wrapper',
  templateUrl: './acquisition-wrapper.component.html',
  styleUrls: ['./acquisition-wrapper.component.scss']
})
export class AcquisitionWrapperComponent implements OnInit, OnDestroy {

  // users (by sectors and by sources)
  selectedTab1: number = 1;
  users: any[] = [];
  usersReqStatus: number = 0;

  // campaigns
  campaignsTableColumns: TableItem[] = [
    {
      name: 'source',
      title: 'Fuente'
    },
    {
      name: 'medium',
      title: 'Medio'
    },
    {
      name: 'campaign',
      title: 'Campaña',
      tooltip: true,
      maxWidthColumn: 15
    },
    {
      name: 'users',
      title: 'Usuarios',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'new_users',
      title: 'Nuevos usuarios',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'sessions',
      title: 'Sesiones',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'pages_by_session',
      title: 'Páginas por sesión',
      textAlign: 'center',
      formatValue: 'decimal'
    },
    {
      name: 'bounce_rate',
      title: 'Porcentaje de rebote',
      textAlign: 'center',
      formatValue: 'percentage',
      comparativeName: 'bounce_rate_comparison',
      comparativeLowIsBetter: true
    },
    {
      name: 'session_duration',
      title: 'Duración media de la sesión',
      textAlign: 'center',
    },
    {
      name: 'amount',
      title: 'Cantidad',
      textAlign: 'center',
      formatValue: 'integer'
    },
    {
      name: 'income',
      title: 'Ingresos del producto',
      textAlign: 'center',
      formatValue: 'currency'
    },
    {
      name: 'yoy',
      title: '%YoY',
      textAlign: 'center',
      // formatValue: 'percentage' // provisional until data exists 
    }
  ];

  campaigns = {
    data: [],
    reqStatus: 0
  }

  generalFiltersSub: Subscription;
  retailFiltersSub: Subscription;
  translateSub: Subscription;

  constructor(
    private filtersStateService: FiltersStateService,
    private campInRetailService: CampaignInRetailService,
    private translate: TranslateService
  ) {

    this.translateSub = translate.stream('acquisition').subscribe(() => {
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
    this.getUsers(this.selectedTab1 === 1 ? 'sectors' : 'sources');
    this.getCampaigns();
  }

  getUsers(subMetricType: any) {
    this.usersReqStatus = 1;

    this.campInRetailService.getDataByMetric('users', subMetricType).subscribe(
      (users: any[]) => {
        this.users = users;
        this.loadi18ntoUsers();
        this.usersReqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[acquisition-wrapper.component]: ${errorMsg}`);
        this.usersReqStatus = 3;
      });

    this.selectedTab1 = subMetricType === 'sectors' ? 1 : 2;
  }

  getCampaigns() {
    this.campaigns.reqStatus = 1;

    this.campInRetailService.getDataByMetric('campaigns').subscribe(
      (campaigns: any[]) => {
        // provisional until data exists
        this.campaigns.data = campaigns.map(item => {
          item.session_duration = strTimeFormat(item.session_duration);
          return { ...item, yoy: '-' };
        });
        this.campaigns.reqStatus = 2;
      },
      error => {
        const errorMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[acquisition-wrapper.component]: ${errorMsg}`);
        this.campaigns.reqStatus = 3;
      });
  }

  loadI18nContent() {
    this.campaignsTableColumns[0].title = this.translate.instant('general.source');
    this.campaignsTableColumns[1].title = this.translate.instant('general.medium');
    this.campaignsTableColumns[2].title = this.translate.instant('general.campaign');
    this.campaignsTableColumns[3].title = this.translate.instant('general.users');
    this.campaignsTableColumns[4].title = this.translate.instant('general.new_users');
    this.campaignsTableColumns[5].title = this.translate.instant('general.sessions');
    this.campaignsTableColumns[6].title = this.translate.instant('general.pagesBySessions');
    this.campaignsTableColumns[7].title = this.translate.instant('general.bounceRate');
    this.campaignsTableColumns[8].title = this.translate.instant('general.sessionDuration');
    this.campaignsTableColumns[9].title = this.translate.instant('general.amount');
    this.campaignsTableColumns[10].title = this.translate.instant('general.productIncomes');

    this.loadi18ntoUsers();
  }

  loadi18ntoUsers() {
    if (this.users.length > 0 && this.selectedTab1 === 1) {
      const salesItem = this.users.find(item => item.name === 'Ventas');
      salesItem.name = this.translate.instant('general.sales');
    }
  }

  ngOnDestroy() {
    this.generalFiltersSub?.unsubscribe();
    this.retailFiltersSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
