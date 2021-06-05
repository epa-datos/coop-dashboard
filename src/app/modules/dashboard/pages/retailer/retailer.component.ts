import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subject, Subscription } from 'rxjs';
import { FiltersStateService } from '../../services/filters-state.service';


@Component({
  selector: 'app-retailer',
  templateUrl: './retailer.component.html',
  styleUrls: ['./retailer.component.scss'],
  providers: [
    { provide: MatFormFieldControl, useExisting: RetailerComponent }
  ]
})
export class RetailerComponent implements OnInit, OnDestroy {

  activeTabView: number = 1;


  stats: any[] = [
    {
      metricTitle: 'Inversión',
      metricValue: 'USD 35,000',
      icon: 'fas fa-wallet',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'Clicks',
      metricValue: '280,0000',
      subMetricTitle: 'CTR',
      subMetricValue: '000',
      icon: 'fas fa-hand-pointer',
      iconBg: '#0096d6'

    },
    {
      metricTitle: 'Bounce Rate',
      metricValue: '12%',
      subMetricTitle: 'Usuarios',
      subMetricValue: '27000',
      icon: 'fas fa-stopwatch',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'Transacciones',
      metricValue: '3,500',
      subMetricTitle: 'CR',
      subMetricValue: '000',
      icon: 'fas fa-shopping-basket',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'Revenue',
      metricValue: '3,500',
      subMetricTitle: 'ROAS',
      subMetricValue: '000',
      icon: 'fas fa-hand-holding-usd',

      iconBg: '#fbc001'

    }
  ];

  extPanelIsOpen = {
    panel1: false,
    panel2: false,
    panel3: false,
    panel4: false
  }

  retailerID: number;

  filtersSub: Subscription;
  retailerSub: Subscription;

  private requestInfoSource = new Subject<boolean>();
  requestInfoChange$ = this.requestInfoSource.asObservable();

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
  ) { }

  ngOnInit(): void {
    const selectedRetailer = this.appStateService.selectedRetailer;
    this.retailerID = selectedRetailer?.id;

    if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      this.requestInfoSource.next(manualChange);
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id;

        if (this.filtersStateService.period && this.filtersStateService.sectors && this.filtersStateService.categories) {
          if (this.retailerID) {

            this.filtersStateService.restoreFilters();
            if (this.activeTabView === 1) {
              this.requestInfoSource.next();
            }
            this.activeTabView = 1;
          }
        }
      }
    });
  }

  panelChange(panel, value) {
    this.extPanelIsOpen[panel] = value
  }

  ngOnDestroy() {
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
