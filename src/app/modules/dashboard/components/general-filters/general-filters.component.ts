import { Component, OnInit } from '@angular/core';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OverviewService } from '../../services/overview.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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

  sectorList: any[];
  categoryList: any[];
  campaignList: any[];

  countryID: number;
  retailerID: number;

  form: FormGroup;
  startDate: AbstractControl;
  endDate: AbstractControl;
  sectors: AbstractControl;
  categories: AbstractControl;
  campaigns: AbstractControl;

  formSub: Subscription;
  countrySub: Subscription;
  retailerSub: Subscription;

  prevSectors: any[];
  prevCategories: any[];
  prevDate: any = {};
  prevCamps: any[];

  campaignsReqStatus: number = 0;

  sectorsErrorMsg: string;
  categoriesErrorMsg: string;
  campaignsErrorMsg: string;

  constructor(
    private fb: FormBuilder,
    private appStateService: AppStateService,
    private usersMngmtService: UsersMngmtService,
    private overviewService: OverviewService,
  ) { }

  ngOnInit() {
    this.loadForm();
    this.fillFilters();

    const selectedCountry = this.appStateService.selectedCountry;
    const selectedRetailer = this.appStateService.selectedRetailer;

    if (selectedCountry?.id || selectedRetailer?.id) {
      this.countryID = selectedCountry?.id ? selectedCountry.id : undefined;
      this.retailerID = selectedRetailer?.id ? selectedRetailer.id : undefined;
    }

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
      this.getCampaigns();
    });
  }

  loadForm() {
    let today = new Date();
    let previousDay = new Date();
    let daysAgo = 15;

    previousDay.setDate(today.getDate() - daysAgo);

    this.form = this.fb.group({
      startDate: new FormControl(previousDay, [Validators.required]),
      endDate: new FormControl(today, [Validators.required]),
      sectors: new FormControl(),
      categories: new FormControl(),
      campaigns: new FormControl()
    });

    this.startDate = this.form.controls['startDate'];
    this.endDate = this.form.controls['endDate'];
    this.sectors = this.form.controls['sectors'];
    this.categories = this.form.controls['categories'];
    this.campaigns = this.form.controls['campaigns'];

    this.prevDate = { startDate: previousDay, endDate: today }

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
            console.log('diffrentent sectors')
            this.getCampaigns();
            this.prevSectors = this.sectors.value;
          } else if (this.prevCategories !== this.categories.value) {
            // change in categories selection
            console.log('different categories')
            this.getCampaigns();
            this.prevCategories = this.categories.value;
          } else if (this.prevDate.startDate.getTime() !== this.startDate.value._d.getTime() || this.prevDate.endDate.getTime() !== this.endDate.value._d.getTime()) {
            // change in date selection
            console.log('different date')
            this.getCampaigns();
            this.prevDate = { startDate: this.startDate.value._d, endDate: this.endDate.value._d }
          } else if (this.prevCamps !== this.campaigns.value) {
            // change in campaign selection
            console.log('different campaigns')
            const areAll = this.areAllCampaignsSelected();
            this.prevCamps = this.campaigns.value;
          }
        }
      });
  }

  async fillFilters() {
    await this.getSectors();
    await this.getCategories();
  }

  getSectors() {
    this.usersMngmtService.getSectors()
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
    this.usersMngmtService.getCategories()
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
    this.campaignsReqStatus = 1;
    const sectorsStrList = this.convertArrayToString(this.sectors.value, 'id');
    const categoriesStrList = this.convertArrayToString(this.categories.value, 'id');

    this.overviewService.getCampaigns(this.retailerID, sectorsStrList, categoriesStrList)
      .subscribe(
        (res: any[]) => {
          this.campaignList = res;
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
    return JSON.stringify(this.campaignList) == JSON.stringify(this.campaigns.value) ? true : false;
  }

  ngOnDestroy() {
    this.formSub && this.formSub.unsubscribe();
    this.countrySub && this.countrySub.unsubscribe();
    this.retailerSub && this.retailerSub.unsubscribe();
  }
}
