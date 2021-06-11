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

  ngOnDestroy() {
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
