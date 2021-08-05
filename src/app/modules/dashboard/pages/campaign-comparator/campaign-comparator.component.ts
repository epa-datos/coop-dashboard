import { Component, OnInit } from '@angular/core';
import { KpiCard } from 'src/app/models/kpi';
import { strTimeFormat } from 'src/app/tools/functions/time-format';
import { TableItem } from '../../components/generic-table/generic-table.component';
import { CampaignComparatorService } from '../../services/campaign-comparator.service';

@Component({
  selector: 'app-campaign-comparator',
  templateUrl: './campaign-comparator.component.html',
  styleUrls: ['./campaign-comparator.component.scss']
})
export class CampaignComparatorComponent implements OnInit {

  firstSelection: { retailer: any, campaign: any };
  secondSelection: { retailer: any, campaign: any };

  validFilters = { firstSelection: false, secondSelection: false };

  kpisLegends1 = ['investment', 'users', 'clicks', 'bounce_rate', 'transactions', 'revenue'] // main kpis
  kpisBase: KpiCard[] = [
    {
      title: 'inversión',
      name: 'investment',
      value: 0,
      format: 'decimal',
      symbol: 'USD',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      title: 'usuarios',
      name: 'users',
      value: 0,
      format: 'integer',
      icon: 'fas fa-users',
      iconBg: '#2f9998'
    },
    {
      title: 'clicks',
      name: 'clicks',
      value: 0,
      format: 'integer',
      icon: 'fas fa-hand-pointer',
      iconBg: '#a77dcc',
      subKpis: [
        {
          title: 'ctr',
          name: 'ctr',
          value: 0,
          format: 'percentage',
        }
      ]
    },
    {
      title: 'bounce rate',
      name: 'bounce_rate',
      value: 0,
      format: 'percentage',
      icon: 'fas fa-stopwatch',
      iconBg: '#f89934',
    },
    {
      title: 'conversiones',
      name: 'transactions',
      value: 0,
      format: 'integer',
      icon: 'fas fa-shopping-basket',
      iconBg: '#fbc001',
      subKpis: [
        {
          title: 'CR',
          name: 'cr',
          value: 0,
          format: 'percentage',
        }
      ]
    },
    {
      title: 'revenue',
      name: 'revenue',
      value: 0,
      format: 'decimal',
      symbol: 'USD',
      icon: 'fas fa-hand-holding-usd',
      iconBg: '#2B96D5',
      subKpis: [
        {
          title: 'roas',
          name: 'roas',
          value: 0,
          format: 'decimal',
        },
        {
          title: 'aup',
          name: 'aup',
          value: 0,
          format: 'decimal',
          symbol: 'USD',
        }
      ]
    }
  ];

  kpisCamps = {
    camp1: {
      kpis: [],
      reqStatus: 0
    },
    camp2: {
      kpis: [],
      reqStatus: 0
    }
  };

  acqCampTableColumns: TableItem[] = [
    {
      name: 'source',
      title: 'Fuente'
    },
    {
      name: 'medium',
      title: 'Medio'
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
    }
  ];

  acqCamps = {
    camp1: {
      data: [],
      reqStatus: 0
    },
    camp2: {
      data: [],
      reqStatus: 0
    }
  };

  convCampTableColumns: TableItem[] = [
    {
      name: 'category',
      title: 'Categoría'
    },
    {
      name: 'product',
      title: 'Producto',
      tooltip: true,
      maxWidthColumn: 8
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

  convCamps = {
    camp1: {
      data: [],
      reqStatus: 0
    },
    camp2: {
      data: [],
      reqStatus: 0
    }
  };

  selections: { retailer: any, campaign: any, selection: string }[];
  showComparison: boolean;

  constructor(
    private campaignCompService: CampaignComparatorService
  ) { }

  ngOnInit(): void {
  }

  filtersChange(selection: number, value: any) {
    selection === 1 && (this.firstSelection = value);
    selection === 2 && (this.secondSelection = value);
  }

  validFiltersChange(selection: number, value: any) {
    selection === 1 && (this.validFilters.firstSelection = value);
    selection === 2 && (this.validFilters.secondSelection = value);
  }

  compareCampaigns() {
    this.showComparison = true;
    this.selections = [
      { ...this.firstSelection, selection: 'camp1' },
      { ...this.secondSelection, selection: 'camp2' }
    ];

    this.getKpis();
    this.getAcquisition();
    this.getConversion();
  }

  getKpis() {
    for (let item of this.selections) {
      this.kpisCamps[item.selection].reqStatus = 1;

      this.campaignCompService.getCampKpis(item.retailer.id, item.campaign.id).subscribe(
        (kpisList: any[]) => {
          if (!kpisList || kpisList.length < 1) {
            this.clearKpis(item.selection);
            this.kpisCamps[item.selection].reqStatus = 2;
          };

          const mainKpis = kpisList.filter(kpi => this.kpisLegends1.includes(kpi.string));

          const campaignKpis: KpiCard[] = [];
          for (let i = 0; i < this.kpisBase.length; i++) {
            // create new objects with different references (including sub arrays)
            const baseObj = { ...this.kpisBase[i] };
            baseObj.subKpis = baseObj.subKpis?.map(item => ({ ...item }));

            // baseObj.value = mainKpis[i]['value'];

            baseObj.value = mainKpis.find(i => i.string === baseObj.name)?.value;

            if (baseObj.name === 'clicks') {
              baseObj.subKpis[0].value = kpisList.find(i => i.string === 'ctr')?.value;
            }

            if (baseObj.name === 'transactions') {
              baseObj.subKpis[0].value = kpisList.find(i => i.string === 'cr')?.value;
            }

            if (this.kpisBase[i].name === 'revenue' && this.kpisBase[i].subKpis[1]) {
              baseObj.subKpis[0].value = kpisList.find(i => i.string === 'roas')?.value;
              baseObj.subKpis[1].value = kpisList.find(i => i.string === 'aup')?.value;
            }

            campaignKpis.push(baseObj);
          }

          this.kpisCamps[item.selection].kpis = campaignKpis;
          this.kpisCamps[item.selection].reqStatus = 2;

        },
        error => {
          this.clearKpis(item.selection);
          this.kpisCamps[item.selection].reqStatus = 3;

          console.error(`[campaign-comparator.component]: ${error}`);
        }
      )
    }
  }

  getAcquisition() {
    for (let item of this.selections) {
      this.acqCamps[item.selection].reqStatus = 1;

      this.campaignCompService.getCampAcquisition(item.retailer.id, item.campaign.id).subscribe(
        (campaigns: any[]) => {

          this.acqCamps[item.selection].data = campaigns.map(item => {
            item.session_duration = strTimeFormat(item.session_duration);
            return { ...item };
          });

          this.acqCamps[item.selection].reqStatus = 2;

        },
        error => {
          this.acqCamps[item.selection].data = [];
          this.acqCamps[item.selection].reqStatus = 3;

          console.error(`[campaign-comparator.component]: ${error}`);
        }
      )
    }
  }

  getConversion() {
    for (let item of this.selections) {
      this.convCamps[item.selection].reqStatus = 1;

      this.campaignCompService.getCampConversion(item.retailer.id, item.campaign.id).subscribe(
        (conversions: any[]) => {

          this.convCamps[item.selection].data = conversions.map(item => {
            return { ...item, yoy_amount: '-', yoy_product_revenue: '-', yoy_aup: '-' };
          });

          this.convCamps[item.selection].reqStatus = 2;

        },
        error => {
          this.convCamps[item.selection].data = [];
          this.convCamps[item.selection].reqStatus = 3;

          console.error(`[campaign-comparator.component]: ${error}`);
        }
      )
    }
  }

  clearKpis(selection) {
    for (let kpi of this.kpisCamps[selection].kpis) {
      kpi.value = 0;

      kpi.subKpis?.forEach(item => {
        item.value = 0;
      });
    }
  }


}
