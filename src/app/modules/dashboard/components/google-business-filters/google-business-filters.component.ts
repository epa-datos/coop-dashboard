import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { GoogleBusinessService } from '../../services/google-business.service';

@Component({
  selector: 'app-google-business-filters',
  templateUrl: './google-business-filters.component.html',
  styleUrls: ['./google-business-filters.component.scss']
})
export class GoogleBusinessFiltersComponent implements OnInit {

  @Output() private filtersChange = new EventEmitter<any>();

  provinceList: any[] = [];
  cityList: any[] = [];

  filteredProvinceList: any[] = [];
  filteredCityList: any[] = [];

  provincesCounter: number = 0;
  citiesCounter: number = 0;

  provincesReqStatus = 0;
  citiesReqStatus = 0;

  provincesErrorMsg;
  citiesErrorMsg;

  provinceFilter: string
  cityFilter: string;

  selectedProvinces: any[] = [];
  selectedCities: any[] = [];

  form: FormGroup;
  provinces: AbstractControl;
  cities: AbstractControl;

  @ViewChild('allSelectedProvinces') private allSelectedProvinces: MatOption;
  @ViewChild('allSelectedCities') private allSelectedCities: MatOption;

  constructor(
    private fb: FormBuilder,
    private googleBusinessServ: GoogleBusinessService
  ) { }

  async ngOnInit() {
    this.form = this.fb.group({
      provinces: new FormControl(),
      cities: new FormControl(),
    });

    this.provinces = this.form.controls['provinces'];
    this.cities = this.form.controls['cities'];

    await this.getProvinces();
    await this.getCities();
    this.applyFilters();
  }

  getProvinces() {
    this.provincesReqStatus = 1;
    return this.googleBusinessServ.getProvinces()
      .toPromise()
      .then((res: any[]) => {
        this.provinceList = res;
        this.filteredProvinceList = res;
        this.provincesCounter = res?.length;
        this.provinces.patchValue([...this.provinceList.map(item => item), 0]);

        this.provincesErrorMsg && delete this.provincesErrorMsg;
        this.provincesReqStatus = 2;

      })
      .catch(error => {
        this.provinceList = [];
        this.provincesErrorMsg = 'Error al consultar Provincias';
        console.error(`[google-business.component]: ${error}`);
        this.provincesReqStatus = 3;
      })
  }

  getCities() {
    this.citiesReqStatus = 1;
    return this.googleBusinessServ.getCities()
      .toPromise()
      .then((res: any[]) => {
        this.cityList = res;
        this.filteredCityList = res;
        this.citiesCounter = res?.length;
        this.cities.patchValue([...this.cityList.map(item => item), 0]);

        this.citiesErrorMsg && delete this.citiesErrorMsg;
        this.citiesReqStatus = 2;

      })
      .catch(error => {
        this.cityList = [];
        this.citiesErrorMsg = 'Error al consultar Ciudades';
        console.error(`[google-business.component]: ${error}`);
        this.citiesReqStatus = 3;
      })
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

    if (allAreSelected) {
      this[matOptionRef].select();
    } else {
      this[matOptionRef].deselect();
    }
  }

  updateSelectionCounter(controlRef: string) {
    const counterRef = `${controlRef}Counter`;

    const selectionCounter = this[controlRef].value.filter(item => item.name);
    this[counterRef] = selectionCounter.length;
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

  applyFilters() {
    this.selectedProvinces = this.provinces.value.filter(item => item.name);
    this.selectedCities = this.cities.value.filter(item => item.name);

    this.selectedProvinces = this.selectedProvinces.map(item => item.name);
    this.selectedCities = this.selectedCities.map(item => item.name);

    this.filtersChange.emit({ provinces: this.selectedProvinces, cities: this.selectedCities });
  }
}
