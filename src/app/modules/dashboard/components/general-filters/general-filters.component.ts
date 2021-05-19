import { Component, OnInit } from '@angular/core';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OverviewService } from '../../services/overview.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FiltersStateService } from '../../services/filters-state.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    { id: 1, name: 'Google' },
    { id: 2, name: 'Facebook' },
    { id: 3, name: 'Programmatic' },
    { id: 4, name: 'Institucional' },
    { id: 5, name: 'Otro' }
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

  prevCountries: any[];
  prevRetailers: any[];
  prevSectors: any[];
  prevCategories: any[];
  prevDate: any = {};
  prevCamps: any[];

  campaignsReqStatus: number = 0;

  countriesErrorMsg: string;
  retailersErrorMsg: string;
  sectorsErrorMsg: string;
  categoriesErrorMsg: string;
  campaignsErrorMsg: string;

  constructor(
    private fb: FormBuilder,
    private appStateService: AppStateService,
    private usersMngmtService: UsersMngmtService,
    private overviewService: OverviewService,
    private filtersStateService: FiltersStateService,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.loadForm();

    await this.getSectors();
    await this.getCategories();
    this.applyFilters();

    const selectedCountry = this.appStateService.selectedCountry;
    const selectedRetailer = this.appStateService.selectedRetailer;

    if (selectedCountry?.id || selectedRetailer?.id) {
      this.countryID = selectedCountry?.id ? selectedCountry.id : undefined;
      this.retailerID = selectedRetailer?.id ? selectedRetailer.id : undefined;
    }

    this.loadLatamContent();

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event instanceof NavigationEnd)
          this.loadLatamContent();
      });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;

      if (this.campaigns.value) {
        this.campaigns.setValue([]);
        this.campaignFilter = '';
      }

      if (this.retailerID) {
        this.getCampaigns();
      }
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
      if (this.campaigns.value) {
        this.campaigns.setValue([]);
        this.campaignFilter = '';
      }
    });
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
      sources: new FormControl([...this.sourceList.map(item => item)])
    });

    this.countries = this.form.controls['countries'];
    this.retailers = this.form.controls['retailers'];
    this.startDate = this.form.controls['startDate'];
    this.endDate = this.form.controls['endDate'];
    this.sectors = this.form.controls['sectors'];
    this.categories = this.form.controls['categories'];
    this.campaigns = this.form.controls['campaigns'];
    this.sources = this.form.controls['sources']

    this.prevDate = { startDate: startDate, endDate: endDate }

    this.formSub = this.form.valueChanges
      .pipe(debounceTime(5))
      .subscribe(form => {
        if (!this.retailerID) return;

        if (this.sectors.value && this.categories.value && !this.campaigns.value && this.countryID) {
          // initial campaigns load
          this.getCampaigns();
        } else if (this.sectors.value?.length > 0 && this.categories.value?.length > 0 && this.form.valid) {
          if (this.prevSectors !== this.sectors.value) {
            // change in sectors selection
            // console.log('diffrentent sectors')
            this.getCampaigns();
            this.prevSectors = this.sectors.value;
          } else if (this.prevCategories !== this.categories.value) {
            // change in categories selection
            // console.log('different categories')
            this.getCampaigns();
            this.prevCategories = this.categories.value;
          } else if (this.prevDate.startDate.getTime() !== this.startDate.value._d.getTime() || this.prevDate.endDate.getTime() !== this.endDate.value._d.getTime()) {
            // change in date selection
            // console.log('different date')
            this.getCampaigns();
            this.prevDate = { startDate: this.startDate.value._d, endDate: this.endDate.value._d }
          } else if (this.prevCamps !== this.campaigns.value) {
            // change in campaign selection
            // console.log('different campaigns')
            this.prevCamps = this.campaigns.value;
          }
        }
      });
  }

  loadLatamContent() {
    this.isLatamSelected = this.router.url.includes('latam') ? true : false;
    if (this.isLatamSelected) {
      this.getCountries();
      this.getRetailers();
    }
  }

  getCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((res: any[]) => {
        this.countryList = res;
        this.filteredCountryList = res;
        this.countries.patchValue([...this.countryList.map(item => item)]);
        this.prevCountries = this.countries.value;
        this.countriesErrorMsg && delete this.countriesErrorMsg;
      })
      .catch((error) => {
        this.countriesErrorMsg = 'Error al consultar ciudades';
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getRetailers() {
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((res: any[]) => {
        const retailers = res.map(retailer => {
          return { id: retailer.id, name: `${retailer.country_code} - ${retailer.name}` }
        });

        this.retailerList = retailers;
        this.filteredRetailerList = retailers;

        this.retailers.patchValue([...this.retailerList.map(item => item)]);
        this.prevRetailers = this.retailers.value;
        this.retailersErrorMsg && delete this.retailersErrorMsg;
      })
      .catch((error) => {
        this.retailersErrorMsg = 'Error al consultar retailers';
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getSectors() {
    return this.usersMngmtService.getSectors()
      .toPromise()
      .then((res: any[]) => {
        this.sectorList = res;
        this.sectors.patchValue([...this.sectorList.map(item => item)]);
        this.prevSectors = this.sectors.value;
        this.sectorsErrorMsg && delete this.sectorsErrorMsg;
      })
      .catch((error) => {
        this.sectorsErrorMsg = 'Error al consultar sectores';
        console.error(`[general-filers.component]: ${error}`);
      });
  }

  getCategories() {
    return this.usersMngmtService.getCategories()
      .toPromise()
      .then((res: any[]) => {
        this.categoryList = res;
        this.categories.patchValue([...this.categoryList.map(item => item)]);
        this.prevCategories = this.categories.value;
        this.categoriesErrorMsg && delete this.categoriesErrorMsg;
      })
      .catch((error) => {
        this.categoriesErrorMsg = 'Error al consultar categorías';
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

    this.overviewService.getCampaigns(sectorsStrList, categoriesStrList)
      .subscribe(
        (res: any[]) => {
          this.campaignList = res;
          this.filteredCampaignList = res;
          this.campaignsErrorMsg && delete this.campaignsErrorMsg;
          this.campaignsReqStatus = 2;
        },
        error => {
          this.campaignList = [];
          this.campaignsErrorMsg = 'Error al consultar campañas';
          console.error(`[general-filers.component]: ${error}`);
          this.campaignsReqStatus = 3;
        }
      );
  }

  convertArrayToString(array, param: string): string {
    let stringArray = '';
    for (let i = 0; i < array.length; i++) {
      stringArray = stringArray.concat(',', array[i][param]);
    }

    return stringArray.substring(1);
  }

  areAllCampaignsSelected(): boolean {
    if (this.filteredCampaign) {
      return false;
    }
    return JSON.stringify(this.campaignList) == JSON.stringify(this.campaigns.value) ? true : false;
  }

  filterFromList(listName: string, value: string) {
    const arrayReference = `${listName}List`;
    const listNamePascalCase = `${listName.charAt(0).toUpperCase()}${listName.slice(1)}`;
    const filteredArrayReference = `filtered${listNamePascalCase}List`;
    const filteredFlagReference = `filtered${listNamePascalCase}`;

    this[arrayReference] = this[filteredArrayReference].filter(camp => camp.name.toLowerCase().includes(value.toLowerCase()));

    this[filteredFlagReference] = value.length > 0 ? true : false;
  }

  applyFilters() {
    this.filtersStateService.selectPeriod({ startDate: this.startDate.value._d, endDate: this.endDate.value._d });
    this.filtersStateService.selectSectors(this.sectors.value);
    this.filtersStateService.selectCategories(this.categories.value);

    const areAllCampsSelected = this.areAllCampaignsSelected();
    this.filtersStateService.selectCampaigns(areAllCampsSelected ? [] : this.campaigns.value);

    this.filtersStateService.filtersChange();
  }

  ngOnDestroy() {
    this.formSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
  }
}
