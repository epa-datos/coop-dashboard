import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { GoogleBusinessService } from '../../services/google-business.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-google-business-wrapper',
  templateUrl: './google-business-wrapper.component.html',
  styleUrls: ['./google-business-wrapper.component.scss']
})
export class GoogleBusinessWrapperComponent implements OnInit, OnDestroy {
  @Input() requestInfoChange: Observable<boolean>;

  visits: any[] = [];

  locationColumns: TableItem[] = [
    {
      name: 'province',
      title: 'Provincia'
    },
    {
      name: 'city',
      title: 'Ciudad'
    },
    {
      name: 'store',
      title: 'Tienda'
    },
    {
      name: 'visits',
      title: 'Visitas',
      formatValue: 'integer'
    }
  ];

  locations = {
    data: [],
    reqStatus: 0
  }

  visitsReqStatus: number = 0;
  isVisitRate: boolean = false;

  selectedFilters: any;

  requestInfoSub: Subscription;
  translateSub: Subscription;

  constructor(
    private googleBusinessServ: GoogleBusinessService,
    private translate: TranslateService,
  ) {

    this.translateSub = translate.stream('googleBusiness').subscribe(() => {
      this.loadI18nContent();
    });
  }

  ngOnInit(): void {
    this.requestInfoSub = this.requestInfoChange.subscribe((manualChange: boolean) => {

      this.getVisits();
      this.getLocations();
    })
  }

  filtersChange(value) {
    this.selectedFilters = value;

    this.getVisits();
    this.getLocations();
  }

  getVisits() {
    this.visitsReqStatus = 1;
    this.googleBusinessServ.getVisits(this.selectedFilters.provinces, this.selectedFilters.cities)
      .subscribe(
        ((res: any[]) => {
          this.visitsReqStatus = 2;
          this.visits = res;

          this.isVisitRate = this.visits[0]?.visits_rate ? true : false;
        }),
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[google-business.component]: ${errorMsg}`);
          this.visitsReqStatus = 3;
        }
      )
  }

  getLocations() {
    this.locations.reqStatus = 1;
    this.googleBusinessServ.getLocations(this.selectedFilters.provinces, this.selectedFilters.cities)
      .subscribe(
        ((res: any[]) => {
          this.locations.reqStatus = 2;

          this.isVisitRate = this.visits[0]?.visits_rate ? true : false;

          this.updateLocationsColumns();
          this.locations.data = res;

        }),
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[google-business.component]: ${errorMsg}`);
          this.locations.reqStatus = 3;
        }
      )
  }

  updateLocationsColumns() {
    if (this.locationColumns.some(item => item.name === 'visit_rate' || item.name === 'store_visits_rate')) {
      return;
    }

    let newLocationColumn: TableItem;

    if (this.isVisitRate) {
      newLocationColumn = {
        name: 'visit_rate',
        title: '% Visits Rate',
        formatValue: 'percentage',
        textAlign: 'center'
      }
    } else {
      newLocationColumn = {
        name: 'store_visits_rate',
        title: '% Store Visits Rate',
        formatValue: 'percentage',
        textAlign: 'center'
      }
    }

    this.locationColumns = [...this.locationColumns, newLocationColumn];
  }

  loadI18nContent() {
    this.locationColumns[0].title = this.translate.instant('googleBusiness.province');
    this.locationColumns[1].title = this.translate.instant('googleBusiness.city');
    this.locationColumns[2].title = this.translate.instant('googleBusiness.store');
    this.locationColumns[3].title = this.translate.instant('googleBusiness.visits');
  }

  ngOnDestroy() {
    this.requestInfoSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
