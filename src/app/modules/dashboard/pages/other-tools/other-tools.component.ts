import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Country, Retailer } from 'src/app/models/access-levels';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-other-tools',
  templateUrl: './other-tools.component.html',
  styleUrls: ['./other-tools.component.scss']
})
export class OtherToolsComponent implements OnInit, OnDestroy {

  country: Country;
  retailer: Retailer;

  levelPage = {
    latam: false,
    country: false,
    retailer: false,
  }

  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;
  filtersSub: Subscription;

  activeTabView: number;

  private requestInfoSource = new Subject<'indexed' | 'omnichat' | 'pc-selector'>();
  requestInfoChange$ = this.requestInfoSource.asObservable();

  private levelPageSource = new Subject<object>();
  levelPageChange$ = this.levelPageSource.asObservable();

  initViewWasLoaded: boolean;

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.country = this.appStateService.selectedCountry;
    this.retailer = this.appStateService.selectedRetailer;
    this.levelPage.latam = this.router.url.includes('latam') ? true : false;

    // restore init filters
    if (this.filtersStateService.period && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    if (this.country?.id || this.retailer?.id || this.levelPage.latam) {
      this.loadActiveView();
      this.initViewWasLoaded = true;
    }

    // catch if the route changes
    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        delete this.activeTabView;
        this.filtersStateService.restoreFilters();

        this.levelPage.latam = this.router.url.includes('latam') ? true : false;
        if (this.levelPage.latam || this.country?.id || this.retailer?.id) {
          this.loadActiveView();

          if (!this.initViewWasLoaded) {
            this.initViewWasLoaded = true;
          }
        }
      }
    });

    // catch if its country  view
    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      if (country?.id !== this.country?.id) {
        this.country = country;

        if (this.country && !this.retailer) {
          if (!this.initViewWasLoaded) {
            this.loadActiveView();
            this.initViewWasLoaded = true;
          }
        }
      }
    });

    // catch if its retailer view
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailer?.id) {
        this.retailer = retailer;

        if (this.retailer) {
          if (!this.initViewWasLoaded) {
            this.loadActiveView();
            this.initViewWasLoaded = true;
          }
        }
      }
    });

    // catch a change in general filters
    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      this.emitRequestInfo();
    });
  }

  /**
   * Gets active (selected) level latam | country | retailer
   */
  getActiveLevel() {
    if (this.retailer?.id) {
      this.levelPage = { latam: false, country: false, retailer: true };
    } else if (this.country?.id) {
      this.levelPage = { latam: false, country: true, retailer: false };
    } else if (this.levelPage.latam) {
      this.levelPage = { latam: true, country: false, retailer: false };
    }

    this.levelPageSource.next(this.levelPage);
  }

  /**
   * Gets active (selected) (1) indexed | (2) omnichat | (3) pc-selector
   */
  getActiveTabView() {
    if (this.levelPage.retailer) {
      this.activeTabView = this.retailer.indexed ? 1 : this.retailer.omnichat ? 2 : this.retailer.pc_selector ? 3 : null;

    } else if (this.levelPage.country) {
      this.activeTabView = this.country.indexed ? 1 : this.country.omnichat ? 2 : this.country.pc_selector ? 3 : null;

    } else if (this.levelPage.latam) {
      this.activeTabView = 1;
    }
  }

  loadActiveView() {
    this.getActiveLevel();
    this.getActiveTabView();

    let firstAvailableSection = this.activeTabView === 1 ? 'indexed' : this.activeTabView === 2 ? 'omnichat' : 'pc-selector';
    this.sectionChange(firstAvailableSection);
  }

  sectionChange(section: string) {
    switch (section) {
      case 'indexed':
        this.activeTabView = 1;
        this.filtersStateService.hideCategories(false);
        break;

      case 'omnichat':
        this.activeTabView = 2;
        this.filtersStateService.hideCategories(false);
        break;

      case 'pc-selector':
        this.activeTabView = 3;
        this.filtersStateService.hideCategories(true);
        break;
    }
  }

  emitRequestInfo() {
    if (this.country?.id || this.retailer?.id || this.levelPage?.latam) {
      let selectedSection: any = this.activeTabView === 1 ? 'indexed' : this.activeTabView === 2 ? 'omnichat' : 'pc-selector';
      this.requestInfoSource.next(selectedSection);

    } else {
      // Since this component is reused in the 3 levels (latam, country or retailer) 
      // when the application starts on this page (for example after refresh or a redirection) 
      // it is necessary to have the value of the variables countryID, the retailer ID or be on the latam page 
      // to emit the new value of the requestInfoSource observable otherwise the requests to the API 
      // would have an undefined when referring to the countryID or retailerID variables.

      // If the emission of the requestInfoSource value were done in the country or retailer subscriptions, 
      // repeated emissions could be generated, so it was chosen to use a setTimeOut function recursively,
      // the tests that were made were never repeated more than once, for what so far is the most feasible option.

      setTimeout(() => {
        this.emitRequestInfo();
      }, 500);
    }
  }

  ngOnDestroy() {
    this.filtersStateService.hideCategories(false);

    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
