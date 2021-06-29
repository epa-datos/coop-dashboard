import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MatOption, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OverviewService } from '../../services/overview.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FiltersStateService } from '../../services/filters-state.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { equalsArrays } from 'src/app/tools/validators/arrays-comparator';

export const MY_FORMATS = {
  parse: {
    dateInput: ['YYYY-MM-DD']
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-general-filters',
  templateUrl: './general-filters.component.html',
  styleUrls: ['./general-filters.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GeneralFiltersComponent implements OnInit {

  countryList: any[];
  retailerList: any[];
  sectorList: any[];
  categoryList: any[];
  campaignList: any[];
  sourceList: any[] = [
    { id: 'google', name: 'Google' },
    { id: 'social', name: 'Social' },
    { id: 'email', name: 'Email' },
    { id: 'display', name: 'Display' },
    { id: 'others', name: 'Otros' }
  ];

  filteredCountryList: any[];
  filteredCountry: boolean; // flag to know is filteredCountryList is the result of a search filter
  countryFilter: string; // filtered value in filteredCountryList

  filteredRetailerList: any[];
  filteredRetailer: boolean; // flag to know is filteredRetailerList is the result of a search filter
  retailerFilter: string; // filtered value in filteredRetailerList

  filteredCampaignList: any[];
  filteredCampaign: boolean; // flag to know is campaignsList is the result of a search filter
  campaignFilter: string; // filtered value in campaignsList

  hideCategories: boolean;

  countryID: number;
  retailerID: number;
  isLatamSelected: boolean;

  form: FormGroup;
  countries: AbstractControl;
  retailers: AbstractControl;
  startDate: AbstractControl;
  endDate: AbstractControl;
  sectors: AbstractControl;
  categories: AbstractControl;
  campaigns: AbstractControl;
  sources: AbstractControl;

  formSub: Subscription;
  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;
  hideCategorySub: Subscription;

  prevCountries: any[];
  prevRetailers: any[];
  prevSectors: any[];
  prevCategories: any[];
  prevPeriod: any = {};
  prevCamps: any[];

  defaultPeriod: any = {};

  campaignsReqStatus: number = 0;

  countriesError: boolean;
  retailersError: boolean;
  sectorsError: boolean;
  categoriesError: boolean;
  campaignsError: boolean;

  countriesCounter: number;
  retailersCounter: number;
  sectorsCounter: number;
  categoriesCounter: number;
  campaignsCounter: number = 0;
  sourcesCounter: number = this.sourceList.length;

  campsGetByRetailerChange: boolean;

  currentPage: string; // overview | tools;

  @ViewChild('allSelectedCountries') private allSelectedCountries: MatOption;
  @ViewChild('allSelectedRetailers') private allSelectedRetailers: MatOption;
  @ViewChild('allSelectedSectors') private allSelectedSectors: MatOption;
  @ViewChild('allSelectedCategories') private allSelectedCategories: MatOption;
  @ViewChild('allSelectedCampaigns') private allSelectedCampaigns: MatOption;
  @ViewChild('allSelectedSources') private allSelectedSources: MatOption;

  constructor(
    private fb: FormBuilder,
    private appStateService: AppStateService,
    private usersMngmtService: UsersMngmtService,
    private overviewService: OverviewService,
    private filtersStateService: FiltersStateService,
    private userService: UserService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.loadForm();

    await this.getSectors();
    await this.getCategories();
    this.userService.user.role_name === 'retailer' && this.getCampaigns();

    const selectedCountry = this.appStateService.selectedCountry;
    const selectedRetailer = this.appStateService.selectedRetailer;

    if (selectedCountry?.id || selectedRetailer?.id) {
      this.countryID = selectedCountry?.id ? selectedCountry.id : undefined;
      this.retailerID = selectedRetailer?.id ? selectedRetailer.id : undefined;
    }

    this.loadLatamContent().then(() => {
      this.applyFilters();
    });

    this.getCurrentPage();

    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getCurrentPage();
        this.restoreFilters();

        this.loadLatamContent().then(() => {
          // this.isLatamSelected && this.applyFilters();
          if (this.isLatamSelected || this.currentPage === 'tools') {
            this.applyFilters();
          }
        });
      }
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;

      if (this.retailerID && this.currentPage === 'overview') {
        this.getCampaigns();
        this.campsGetByRetailerChange = true;
      }
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
    });

    // catch if categories filter have to be hide
    this.hideCategorySub = this.filtersStateService.hideCategories$.subscribe(value => {
      this.hideCategories = value;
    });
  }

  getCurrentPage() {
    if (this.router.url.includes('main-region?') || this.router.url.includes('country?') || this.router.url.includes('retailer?')) {
      this.currentPage = 'overview';
    } else if (this.router.url.includes('tools?')) {
      this.currentPage = 'tools';
    } else {
      delete this.currentPage;
    }
  }

  restoreFilters() {
    if (this.defaultPeriod) {
      this.startDate.setValue(this.defaultPeriod.startDate);
      this.endDate.setValue(this.defaultPeriod.endDate);
    }

    this.countryList && this.countries.patchValue([...this.countryList.map(item => item), 0]);
    this.retailerList && this.retailers.patchValue([...this.retailerList.map(item => item), 0]);
    this.sectorList && this.sectors.patchValue([...this.sectorList.map(item => item), 0]);
    this.categoryList && this.categories.patchValue([...this.categoryList.map(item => item), 0]);
    this.sourceList && this.sources.patchValue([...this.sourceList.map(item => item), 0]);

    this.campaigns.setValue([]);

    this.prevPeriod = { startDate: this.startDate.value._d, endDate: this.endDate.value._d };
    this.prevSectors = this.sectors.value;
    this.prevCategories = this.categories.value;
    this.prevCamps = this.campaigns.value;

    this.countryFilter && delete this.countryFilter;
    this.retailerFilter && delete this.retailerFilter;
    this.campaignFilter && delete this.campaignFilter;

    this.countriesCounter = this.filtersStateService.countriesInitial?.length;
    this.retailersCounter = this.filtersStateService.retailersInitial?.length;
    this.sectorsCounter = this.filtersStateService.sectorsInitial?.length;
    this.categoriesCounter = this.filtersStateService.categoriesInitial?.length;
    this.campaignsCounter = 0;
    this.sourcesCounter = this.sourceList.length;
  }

  loadForm() {
    let today = new Date();
    let startDate = new Date();
    let endDate = new Date();
    let daysAgo = 15;

    startDate.setDate(today.getDate() - daysAgo);
    endDate.setDate(today.getDate() - 1);

    this.form = this.fb.group({
      countries: new FormControl(),
      retailers: new FormControl(),
      startDate: new FormControl(startDate, [Validators.required]),
      endDate: new FormControl(endDate, [Validators.required]),
      sectors: new FormControl(),
      categories: new FormControl(),
      campaigns: new FormControl(),
      sources: new FormControl([...this.sourceList.map(item => item), 0])
    });

    this.countries = this.form.controls['countries'];
    this.retailers = this.form.controls['retailers'];
    this.startDate = this.form.controls['startDate'];
    this.endDate = this.form.controls['endDate'];
    this.sectors = this.form.controls['sectors'];
    this.categories = this.form.controls['categories'];
    this.campaigns = this.form.controls['campaigns'];
    this.sources = this.form.controls['sources']

    this.defaultPeriod = { startDate: startDate, endDate: endDate };
    this.prevPeriod = this.defaultPeriod;

    this.filtersStateService.periodInitial = this.defaultPeriod;
    this.filtersStateService.sourcesInitial = this.sources.value;

    this.formSub = this.form.valueChanges
      .pipe(debounceTime(5))
      .subscribe(form => {
        if (!this.retailerID) return;

        if (this.campsGetByRetailerChange) {
          this.campsGetByRetailerChange = false;
          return;
        };

        if (this.sectors.value && this.categories.value && !this.campaigns.value && this.countryID) {
          // initial campaigns load
          // console.log('initial campaigns load')
          this.currentPage === 'overview' && this.getCampaigns();
        } else if (this.sectors.value?.length > 0 && this.categories.value?.length > 0 && this.form.valid) {
          if (!equalsArrays(this.prevSectors, this.sectors.value)) {
            // change in sectors selection
            // console.log('diffrentent sectors')
            this.currentPage === 'overview' && this.getCampaigns();
            this.prevSectors = this.sectors.value;
          } else if (!equalsArrays(this.prevCategories, this.categories.value)) {
            // change in categories selection
            // console.log('different categories')
            this.currentPage === 'overview' && this.getCampaigns();
            this.prevCategories = this.categories.value;
          } else {
            // change in date selection
            const prevPeriodObj = { startDate: this.prevPeriod.startDate.getTime(), endDate: this.prevPeriod.endDate.getTime() }
            const periodObj = { startDate: this.startDate.value._d.getTime(), endDate: this.endDate.value._d.getTime() }
            const equalsPeriodObjs = JSON.stringify(prevPeriodObj) == JSON.stringify(periodObj);

            if (!equalsPeriodObjs) {
              // console.log('different date')
              this.currentPage === 'overview' && this.getCampaigns();
              this.prevPeriod = { startDate: this.startDate.value._d, endDate: this.endDate.value._d }
            } else {
              // console.log('change in campaigns')
              // if (equalsArrays(this.prevCategories, this.categories.value))
              // this.prevCamps = this.campaigns.value;
            }
          }
        }
      });
  }

  loadLatamContent() {
    return new Promise<void>(async (resolve) => {
      this.isLatamSelected = this.router.url.includes('latam') ? true : false;

      if (this.isLatamSelected) {
        // There are countriesInitial or retailerInitial after login
        // There aren't countriesInitial and retailerInitial after a page refresh
        this.filtersStateService.countriesInitial ? this.loadCountriesData() : await this.getCountries();
        this.filtersStateService.retailersInitial ? this.loadRetailersData() : await this.getRetailers();
      }
      resolve();
    });
  }

  getCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((res: any[]) => {
        this.loadCountriesData(res);
        this.countriesError = this.countriesError && false;
      })
      .catch((error) => {
        this.countriesError = true;
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getRetailers() {
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((res: any[]) => {
        const retailers = res.map(retailer => {
          return {
            id: retailer.id,
            name: `${retailer.country_code} - ${retailer.name}`,
            country_id: retailer.country_id,
            country_code: retailer.country_code
          }
        });

        retailers.sort((a, b) => a.name.localeCompare(b.name));

        this.loadRetailersData(retailers);
        this.retailersError = this.retailersError && false;
      })
      .catch((error) => {
        this.retailersError = true;
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  loadCountriesData(newCountries?: any[]) {
    const countries = newCountries ? newCountries : this.filtersStateService.countriesInitial;
    this.countryList = countries;
    this.filteredCountryList = countries;
    this.countriesCounter = countries.length;
    this.filtersStateService.countriesInitial = countries;

    this.countries.patchValue([...this.countryList.map(item => item), 0]);
    this.prevCountries = this.countries.value;
  }

  loadRetailersData(newRetailers?: any[]) {
    const retailers = newRetailers ? newRetailers : this.filtersStateService.retailersInitial;
    retailers.sort((a, b) => a.name.localeCompare(b.name));

    this.retailerList = retailers;
    this.filteredRetailerList = retailers;
    this.retailersCounter = retailers.length;
    this.filtersStateService.retailersInitial = retailers;

    this.retailers.patchValue([...this.retailerList.map(item => item), 0]);
    this.prevRetailers = this.retailers.value;
  }

  getSectors() {
    return this.usersMngmtService.getSectors()
      .toPromise()
      .then((res: any[]) => {
        this.sectorList = res;
        this.sectorsCounter = res.length;
        this.filtersStateService.sectorsInitial = res;

        this.sectors.patchValue([...this.sectorList.map(item => item), 0]);
        this.prevSectors = this.sectors.value;

        this.sectorsError = this.sectorsError && false;
      })
      .catch((error) => {
        this.sectorsError = true;
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getCategories() {
    return this.usersMngmtService.getCategories()
      .toPromise()
      .then((res: any[]) => {
        this.categoryList = res;
        this.categoriesCounter = res.length;
        this.filtersStateService.categoriesInitial = res;

        this.categories.patchValue([...this.categoryList.map(item => item), 0]);
        this.prevCategories = this.categories.value;

        this.categoriesError = this.categoriesError && false;
      })
      .catch((error) => {
        this.categoriesError = true;
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getCampaigns() {
    this.campaigns.setValue([]);
    this.campaignFilter = '';
    this.filteredCampaign = false;

    this.campaignsReqStatus = 1;
    const sectorsStrList = this.convertArrayToString(this.sectors.value, 'id');
    const categoriesStrList = this.convertArrayToString(this.categories.value, 'id');
    const period = { startDate: this.startDate.value._d, endDate: this.endDate.value._d }

    this.overviewService.getCampaigns(period, sectorsStrList, categoriesStrList)
      .subscribe(
        (res: any[]) => {
          this.campaignList = res;
          this.filteredCampaignList = res;

          this.campaignsError = this.campaignsError && false;
          this.campaignsReqStatus = 2;
        },
        error => {
          this.campaignList = [];
          this.campaignsError = true;
          console.error(`[general-filers.component]: ${error}`);
          this.campaignsReqStatus = 3;
        }
      );
  }

  convertArrayToString(array, param: string): string {
    let stringArray = '';
    for (let i = 0; i < array.length; i++) {
      stringArray = array[i][param] ? stringArray.concat(',', array[i][param]) : stringArray;
    }

    return stringArray.substring(1);
  }

  areAllCampaignsSelected(): boolean {
    if (this.filteredCampaign) {
      return false;
    }

    return this.arraysAreEquals(this.campaignList, this.campaigns.value);
  }

  /**
  * filterFromList
  * Generic function to be used for sarch filter
  * @param controlRef // associated form control name
  * @param listRef // associated elementList name
  * @param value // filtered value
  */

  filterFromList(controlRef: string, listRef: string, value: string) {
    const controlRefPascalCase = `${controlRef.charAt(0).toUpperCase()}${controlRef.slice(1)}`;
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;
    const matOptionRef = `allSelected${controlRefPascalCase}`;
    const filteredFlagReference = `filtered${listRefPascalCase}`;

    if (value) {
      this[controlRef].patchValue(this[filteredArrayRef].filter(item => {
        const isSelected = this[controlRef].value.includes(item);

        if (isSelected) {
          return this[controlRef].value.includes(item)
        } else {
          return this[controlRef].value.includes(item), 0
        }
      }));
    }

    this[arrayReference].forEach(item => {
      delete item.hidden;
      if (!item.name.toLowerCase().includes(value.toLowerCase())) {
        item.hidden = true;
      }
    });

    this.allAreItemsSelected(controlRef, arrayReference, matOptionRef);
    this[filteredFlagReference] = value.length > 0 ? true : false;
  }

  allAreItemsSelected(controlRef: string, arrayReference: string, matOptionRef: string) {
    const shownElements = this[arrayReference].filter(item => !item.hidden);
    let allAreSelected = true;
    for (let item of shownElements) {
      if (this[controlRef].value.includes(item)) {
      } else {
        allAreSelected = false;
        break;
      }
    };

    if (allAreSelected && shownElements.length > 0) {
      this[matOptionRef].select();
    } else {
      this[matOptionRef].deselect();
    }
  }

  toggleAllSelection(controlRef: string, listRef: string) {
    const controlRefPascalCase = `${controlRef.charAt(0).toUpperCase()}${controlRef.slice(1)}`;
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;
    const matOptionRef = `allSelected${controlRefPascalCase}`;

    const allSelected = this[matOptionRef].selected;
    const shownElements = this[arrayReference].filter(item => !item.hidden);

    const initialArrayRef = this[filteredArrayRef] ? filteredArrayRef : arrayReference;
    this[controlRef].patchValue(this[initialArrayRef].filter(item => {
      const isSelectedElement = this[controlRef].value.includes(item);
      const isShownElement = shownElements.includes(item);

      if (isShownElement) {
        // change selection depending on allSelect new value
        if (allSelected) {
          return shownElements.includes(item)

        } else {
          return shownElements.includes(item), 0
        }

      } else {
        // preserve the original selection
        if (isSelectedElement) {
          return this[controlRef].value.includes(item)
        } else {
          return this[controlRef].value.includes(item), 0
        }
      }
    }));

    this.allAreItemsSelected(controlRef, arrayReference, matOptionRef);
    this.updateSelectionCounter(controlRef);
  }

  tosslePerOne(matOptionRef: string, controlRef: string, listRef: string) {
    this.updateSelectionCounter(controlRef);

    if (this[matOptionRef].selected) {
      this[matOptionRef].deselect();
      return false;
    }

    if (this[controlRef].value.length == this[listRef].length) {
      this[matOptionRef].select();
    }
  }

  uniqueSelection(controlRef: string, listRef: string, value) {
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;

    const initialArrayRef = this[filteredArrayRef] ? filteredArrayRef : arrayReference;
    this[controlRef].patchValue(this[initialArrayRef].filter(item => {
      item === value;
    }));
  }

  updateSelectionCounter(controlRef: string) {
    const counterRef = `${controlRef}Counter`;

    const selectionCounter = this[controlRef].value.filter(item => item.id);
    this[counterRef] = selectionCounter.length;
  }

  countryChange(country) {
    // check if country was selected or deselected 
    const selectedCountry = this.countries.value.some(item => item.id === country.id);

    if (selectedCountry) {
      this.retailers.patchValue(this.filteredRetailerList.filter(retailer => {
        const retailerInCountry = retailer.country_id === country.id;
        const previouslySelected = this.retailers.value.some(prevRetailer => prevRetailer.id === retailer.id);

        return retailerInCountry || previouslySelected;
      }));
    } else if (!selectedCountry) {
      this.retailers.patchValue(this.filteredRetailerList.filter(retailer => {
        const retailerInCountry = retailer.country_id === country.id;
        const previouslyDeselected = !this.retailers.value.some(prevRetailer => prevRetailer.id === retailer.id);

        if (previouslyDeselected) {
          return false;
        }

        return !retailerInCountry;
      }));
    }

    this.retailersCounter = this.retailers.value.length;
    this.allAreItemsSelected('retailers', 'retailerList', 'allSelectedRetailers');
  }

  retailerChange(retailer) {
    // check if retailer was selected or deselected 
    const selectedRetailer = this.retailers.value.some(item => item.id === retailer.id);

    if (selectedRetailer) {
      const allRetailersInCountry = this.filteredRetailerList.filter(item => item.country_id === retailer.country_id);
      const selectedRetailers = this.retailers.value.filter(item => item.country_id === retailer.country_id);

      this.countries.patchValue(this.filteredCountryList.filter(country => {
        const previouslySelected = this.countries.value.some(prevCountry => prevCountry.id === country.id);
        if (previouslySelected) {
          return true;
        }

        if (country.id === retailer.country_id) {
          return allRetailersInCountry.length === selectedRetailers.length;
        }

        return false;
      }));

    } else if (!selectedRetailer) {
      this.countries.patchValue(this.filteredCountryList.filter(country => {
        const previouslySelected = this.countries.value.some(prevCountry => prevCountry.id === country.id);

        if (country.id === retailer.country_id && previouslySelected) {
          return false;
        }

        return previouslySelected ? true : false;
      }));
    }

    this.countriesCounter = this.countries.value.length;
    this.allAreItemsSelected('countries', 'countryList', 'allSelectedCountries');
  }

  selectAllComplementaryFilter(filterRef: string) {
    let shownElements;

    switch (filterRef) {
      case 'retailers':
        shownElements = this.countryList.filter(item => !item.hidden);
        const allSelectedCountries = this.allSelectedCountries.selected;

        if (allSelectedCountries) {
          this.retailers.patchValue(this.retailerList.filter(retailer => {
            const relativeToSearch = shownElements.some(item => item.id === retailer.country_id);
            const previouslySelected = this.retailers.value.some(prevRetailer => prevRetailer.id === retailer.id);

            return relativeToSearch || previouslySelected
          }));
        } else {

          this.retailers.patchValue(this.retailerList.filter(retailer => {
            const relativeToSearch = shownElements.some(item => item.id === retailer.country_id);
            const previouslySelected = this.retailers.value.some(prevRetailer => prevRetailer.id === retailer.id);

            if (previouslySelected && !relativeToSearch) {
              return true;
            }

            if (relativeToSearch) {
              return false;
            }

            return previouslySelected;
          }));
        }
        this.retailersCounter = this.retailers.value.length;
        this.allAreItemsSelected('retailers', 'retailerList', 'allSelectedRetailers');

        break;

      case 'countries':
        shownElements = this.retailerList.filter(item => !item.hidden);
        const allSelectedRetailers = this.allSelectedRetailers.selected;

        if (allSelectedRetailers) {
          const linkedCountries = [];  // linked cities in selected retailers

          for (let item of shownElements) {
            if (!linkedCountries.some(item => item.country_id)) {
              linkedCountries.push({ id: item.country_id });
            }
          }

          const countriesWithAllSelectedRetalers = [];

          for (let country of linkedCountries) {
            const allRetailersInCountry = this.filteredRetailerList.filter(item => item.country_id === country.id);
            const selectedRetailersInCountry = this.retailers.value.filter(item => item.country_id === country.id);

            if (allRetailersInCountry.length === selectedRetailersInCountry.length) {
              countriesWithAllSelectedRetalers.push({ id: country.id });
            }
          }

          this.countries.patchValue(this.countryList.filter(country => {
            const previouslySelected = this.countries.value.some(prevCountry => prevCountry.id === country.id);
            const allSelectedRetailers = countriesWithAllSelectedRetalers.some(item => item.id === country.id);

            return previouslySelected || allSelectedRetailers ? true : false;
          }));

        } else {
          this.countries.patchValue(this.countryList.filter(country => {
            const relativeToSearch = shownElements.some(item => item.country_id === country.id);
            const previouslySelected = this.countries.value.some(prevCountry => prevCountry.id === country.id);

            if (previouslySelected && !relativeToSearch) {
              return true;
            }

            if (relativeToSearch) {
              return false;
            }

            return previouslySelected;
          }));

        }
        this.countriesCounter = this.countries.value.length;
        this.allAreItemsSelected('countries', 'countryList', 'allSelectedCountries');

        break;
    }
  }

  selectOnlyComplementaryFilter(filterRef: string, selectedElement: any) {
    switch (filterRef) {
      case 'retailers':
        this.retailers.patchValue(this.retailerList.filter(retailer => {
          return retailer.country_id === selectedElement.id;
        }));
        break;

      case 'countries':
        this.countries.patchValue([]);
        break;
    }
  }

  /**
   * Applys filters
   * @param [manualTriggered] change made by "filter" button click triggered manually by the user
   */
  applyFilters(manualTriggered?: boolean) {
    this.filtersStateService.selectPeriod({ startDate: this.startDate.value._d, endDate: this.endDate.value._d });
    this.filtersStateService.selectSectors(this.sectors.value.filter(item => item.id));
    this.filtersStateService.selectCategories(this.categories.value.filter(item => item.id));
    this.filtersStateService.selectSources(this.sources.value.filter(item => item.id));

    if (this.isLatamSelected) {
      this.filtersStateService.selectCountries(this.countries.value.filter(item => item.id));
      this.filtersStateService.selectRetailers(this.retailers.value.filter(item => item.id));
    }

    const areAllCampsSelected = this.areAllCampaignsSelected();
    this.filtersStateService.selectCampaigns(areAllCampsSelected ? [] : this.campaigns.value.filter(item => item.id));

    this.filtersStateService.filtersChange(manualTriggered);
  }

  arraysAreEquals(array1: any[], array2: any[]): boolean {
    const cleanArray1 = array1?.filter(item => item.id);
    const cleanArray2 = array2?.filter(item => item.id);

    return JSON.stringify(cleanArray1) == JSON.stringify(cleanArray2) ? true : false;
  }

  geti18nTexts() {
    // const salesSector = this.selectedSectors.find(sectors => sectors.id === 3);
    // if (salesSector) {
    //   salesSector.name = this.translate.instant('general.sales');
    // }

    // const institutionalSource = this.selectedSources.find(sources => sources.id === 'institucional');
    // if (institutionalSource) {
    //   institutionalSource.name = this.translate.instant('general.institutional');
    // }

    // const othersSource = this.selectedSources.find(sources => sources.id === 'otros');
    // if (othersSource) {
    //   othersSource.name = this.translate.instant('general.others');
    // }
  }

  ngOnDestroy() {
    this.formSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.hideCategorySub?.unsubscribe();
  }
}
