import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-other-tools',
  templateUrl: './other-tools.component.html',
  styleUrls: ['./other-tools.component.scss']
})
export class OtherToolsComponent implements OnInit, OnDestroy {

  countryID: number;
  retailerID: number;

  selectedLevelPage = {
    latam: false,
    country: false,
    retailer: false,
  }

  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;
  filtersSub: Subscription;

  activeTabView: number = 1;

  private requestInfoSource = new Subject<boolean>();
  requestInfoChange$ = this.requestInfoSource.asObservable();

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.selectedLevelPage.latam = this.router.url.includes('latam') ? true : false;

    // restore init filters
    if (this.filtersStateService.period && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    if (this.countryID || this.retailerID || this.selectedLevelPage.latam) {
      this.getActiveView();
    }

    // catch if its LATAM view
    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.filtersStateService.restoreFilters();

        this.selectedLevelPage.latam = this.router.url.includes('latam') ? true : false;
        this.getActiveView();
      }
    });

    // catch if its country  view
    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      if (country?.id !== this.countryID) {
        this.countryID = country?.id;
        this.getActiveView();
        this.activeTabView = 1;
      }
    });

    // catch if its retailer view
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id;
        this.getActiveView();
        this.activeTabView = 1;
      }
    });

    // catch a change in general filters
    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      this.requestInfoSource.next(manualChange);
    });
  }

  getActiveView() {
    if (this.retailerID) {
      this.selectedLevelPage = { latam: false, country: false, retailer: true };
    } else if (this.countryID) {
      this.selectedLevelPage = { latam: false, country: true, retailer: false };
    } else if (this.selectedLevelPage.latam) {
      this.selectedLevelPage = { latam: true, country: false, retailer: false };
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
