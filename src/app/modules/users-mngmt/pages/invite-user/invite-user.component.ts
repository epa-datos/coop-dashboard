import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Invite, Permission } from 'src/app/models/permission';
import { EmailValidator } from 'src/app/tools/validators/email.validator';
import { MultipleCheckboxValidator } from 'src/app/tools/validators/multiple-checkbox.validator';
import { UsersMngmtService } from '../../services/users-mngmt.service';


@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  roles: any[] = [];
  countries: any[] = [];
  retailers: any[] = [];
  sectors: any[] = [];
  categories: any[] = [];
  formSuboptions = [
    {
      name: 'countries',
      allOptSelected: false
    },
    {
      name: 'retailers',
      allOptSelected: false
    },
    {
      name: 'sectors',
      allOptSelected: false
    },
    {
      name: 'categories',
      allOptSelected: false
    }
  ];

  selectedRole: any;
  getRoleStatus: number = 0;
  getReqStatus: number = 0;
  inviteReqStatus: number = 0;
  inviteErrorMsg: string;

  countriesFilter: string;
  retailersFilter: string;

  constructor(
    private fb: FormBuilder,
    private usersMngmtService: UsersMngmtService
  ) { }

  ngOnInit() {
    this.getRoles();
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.validate])
      ],
      role: [
        '',
        [Validators.required]
      ],
      countries: this.fb.array([]),
      retailers: this.fb.array([]),
      sectors: this.fb.array([]),
      categories: this.fb.array([])
    });

    this.email = this.form.controls['email'];
  }

  getRoles() {
    this.getRoleStatus = 1;
    this.usersMngmtService.getRoles()
      .subscribe((resp: any[]) => {
        this.roles = resp;
        this.getRoleStatus = 2;
      }, error => {
        console.error(`[invite-user.component]: ${error}`);
        this.getRoleStatus = 3;
      })
  }

  getCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((countries: any[]) => {
        const countriesWithoutRegion = countries.filter(c => !c.region);
        const countriesWithRegion = countries.filter(c => c.region);

        const regionsList = [];
        const { regionsNames, regions } = this.groupCountriesByRegion(countriesWithRegion);

        for (let region of regionsNames) {
          regionsList.push({
            name: region,
            countries: regions[region]
          });
        }

        if (regionsNames.length > 0) {
          this.countries = [...countriesWithoutRegion, ...regionsList].sort((a, b) => (a.name < b.name ? -1 : 1));
        }
      })
      .catch((error) => {
        console.error(`[invite-user.component]: ${error}`);
        throw (new Error());
      });
  }

  getRetailers() {
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((resp: any[]) => {
        const retailers = resp.map(retailer => {
          return { id: retailer.id, name: `${retailer.country_code} - ${retailer.name}` }
        })

        retailers.sort((a, b) => a.name.localeCompare(b.name));

        this.retailers = retailers;
      })
      .catch((error) => {
        console.error(`[invite-user.component]: ${error}`);
        throw (new Error());
      });
  }

  getSectors() {
    return this.usersMngmtService.getSectors()
      .toPromise()
      .then((resp: any[]) => {
        this.sectors = resp;
      })
      .catch((error) => {
        console.error(`[invite-user.component]: ${error}`);
        throw (new Error());
      });
  }

  getCategories() {
    return this.usersMngmtService.getCategories()
      .toPromise()
      .then((resp: any[]) => {
        this.categories = resp;
      })
      .catch((error) => {
        console.error(`[invite-user.component]: ${error}`);
        throw (new Error());
      });
  }

  groupCountriesByRegion(countries) {
    const regionsNames = [];
    const regions = countries.reduce((regions, item) => {

      if (!regionsNames.includes(item.region)) {
        regionsNames.push(item.region);
      }

      const region = (regions[item.region] || []);
      region.push(item);
      regions[item.region] = region;
      regions.selected = false;
      return regions;
    }, {});

    return {
      regionsNames,
      regions
    }
  }

  roleChange() {
    // Add all options for countries, retailer, sectors and categories in form 
    // only if these variables have not been assigned a value previously
    this.fillFormOptions();

    // clean all selected options and reset validators
    this.resetFormControls();

    // add validators based on selected role
    this.addFormValidators();

    // clean subitems (applies four countries grouped in regions)
    this.resetFormControlsSubItems();

    if (this.countriesFilter) {
      this.filterFromList('countries', '');
      delete this.countriesFilter;
    }

    if (this.retailersFilter) {
      this.filterFromList('retailers', '');
      delete this.retailersFilter;
    }
  }

  fillFormOptions() {
    this.getReqStatus = 1;
    switch (this.selectedRole.name) {
      case 'country':
        if (this.countries.length < 1) {
          this.fillFormArrayControl('countries');
        }
        break;

      case 'retailer':
        if (this.retailers.length < 1) {
          this.fillFormArrayControl('retailers');
        }
        break;

      default:
        this.getReqStatus = 2;
        break;
    }

    if (
      (this.selectedRole.name === 'country' || this.selectedRole.name === 'retailer') &&
      (this.sectors.length < 1 || this.categories.length < 1)
    ) {
      this.fillFormArrayControl('sectors');
      this.fillFormArrayControl('categories');
    } else {
      this.updateReqStatus();
    }
  }

  // Generic function to load FormAarray with request response array
  async fillFormArrayControl(formControlName) {
    const genericGetFun = `get${formControlName.charAt(0).toUpperCase() + formControlName.slice(1)}`;

    try {
      await this[genericGetFun]();
      const formControlRef = this.form.get(formControlName);
      this[formControlName].forEach(item => {
        const control = new FormControl('');
        (formControlRef as FormArray).push(control);
      });
      this.updateReqStatus();

    } catch (error) {
      this.getReqStatus = 3;
    }
  }

  updateReqStatus() {
    // in order to stop showing loader in checkboxes area
    if (this.selectedRole.name === 'country' &&
      this.form.controls['countries'].value.length > 0 &&
      this.form.controls['sectors'].value.length > 0 &&
      this.form.controls['categories'].value.length > 0) {
      this.getReqStatus = 2;

    } else if (this.selectedRole.name === 'retailer' &&
      this.form.controls['retailers'].value.length > 0 &&
      this.form.controls['sectors'].value.length > 0 &&
      this.form.controls['categories'].value.length > 0) {
      this.getReqStatus = 2;
    }
  }

  addFormValidators() {
    switch (this.selectedRole.name) {
      case 'country':
        this.form.controls.countries.setValidators([
          MultipleCheckboxValidator.validate
        ]);
        this.form.controls.countries.updateValueAndValidity();
        break;
      case 'retailer':
        this.form.controls.retailers.setValidators([
          MultipleCheckboxValidator.validate
        ]);
        this.form.controls.retailers.updateValueAndValidity();
        break;
    }

    if (this.selectedRole.name === 'country' || this.selectedRole.name === 'retailer') {
      this.form.controls.sectors.setValidators([
        MultipleCheckboxValidator.validate
      ]);
      this.form.controls.categories.setValidators([
        MultipleCheckboxValidator.validate
      ]);

      this.form.controls.sectors.updateValueAndValidity();
      this.form.controls.categories.updateValueAndValidity();
    }
  }

  resetFormControls() {
    this.formSuboptions.forEach(opt => {
      // reset form controls values
      this.form.controls[opt.name].reset();

      // reset form controls validators
      this.form.controls[opt.name].setValidators([]);
      this.form.controls[opt.name].updateValueAndValidity();
    });
  }

  resetFormControlsSubItems() {
    for (let item of this.countries) {
      if (!item.countries) {
        continue;
      }

      for (let subItem of item.countries) {
        if (subItem.selected) {
          subItem.selected = false;
        }
      }
    }
  }

  convertAllOptionsTo(formSuboption: string) {
    const formOption = this.formSuboptions.find(option => option.name === formSuboption);

    const selectAllOptions = !formOption.allOptSelected;
    if (selectAllOptions) {
      this.form.controls[formSuboption].setValue(this[formSuboption].map(() => this.fb.control(true)));
      formOption.allOptSelected = true;
    } else {
      this.form.controls[formSuboption].reset();
      formOption.allOptSelected = false;
    }

    if (formSuboption === 'countries') {
      for (let item of this.countries) {

        if (!item.countries) {
          continue;
        }

        item.countries = item.countries.map(subitem => {
          return { ...subitem, selected: selectAllOptions }
        });
      }
    }
  }

  allOptionsSelected(formSuboption) {
    return this.formSuboptions.find(opt => opt.name === formSuboption).allOptSelected;
  }

  generatePermissions(key: string, entityType: string): Permission[] {
    const permissions: Permission[] = [];
    this.form.value[key].forEach((x, i) => {

      if (x && this[key][i]) {
        // for countries (excluding regions), retailers, sectors and categories
        if (this[key][i].id) {
          const permission = {
            role_id: this.selectedRole.id,
            entity_type: entityType,
            entity_id: this[key][i].id
          }
          permissions.push(permission);
        }
      }
    });

    // for countries grouped in regions
    if (key === 'countries') {
      for (let item of this.countries) {
        if (!item.countries) {
          continue;
        }

        for (let subItem of item.countries) {
          if (subItem.selected) {
            const permission = {
              role_id: this.selectedRole.id,
              entity_type: entityType,
              entity_id: subItem.id
            }
            permissions.push(permission);
          }
        }
      }
    }

    return permissions;
  }

  filterFromList(listName: string, value: string) {
    this[listName].forEach(element => {
      element.hidden && delete element.hidden;

      if (!element.name.toLowerCase().includes(value.toLowerCase())) {
        // consider countries (excluding regions), retailers, sectors and categories
        // and countries grouped by region
        if (!element.countries ||
          (element.countries && !element.countries.some(item => item.name.toLowerCase().includes(value.toLowerCase())))) {
          element.hidden = true;
        }
      }
    });
  }

  countriesInRegionChange(selectedItem, selected) {
    if (!selectedItem.countries) {
      return;
    }

    selectedItem.countries = selectedItem.countries.map(subitem => {
      return { ...subitem, selected };
    });
  }

  regionChange(regionIndex, selectedItem, selected) {
    selectedItem.selected = selected;

    const countriesInRegion = this.countries.find(item => item.name === selectedItem.region)?.countries;
    const selectedCountries = countriesInRegion.filter(item => item.selected);

    const countriesFormList = this.form.controls['countries'].value;

    if (countriesInRegion.length === selectedCountries.length) {
      countriesFormList[regionIndex] = true;
    } else {
      countriesFormList[regionIndex] = "";
    }

    this.form.controls['countries'].patchValue(countriesFormList);
  }

  onSubmit() {
    let permissions: Permission[] = [];
    const role = this.form.value.role;
    switch (role.name) {
      case 'country':
        permissions = [...this.generatePermissions('countries', 'country')];
        break;
      case 'retailer':
        permissions = [...this.generatePermissions('retailers', 'retailer')];
        break;
      default:
        permissions = [{
          role_id: role.id,
          entity_type: null,
          entity_id: null
        }]
        break;
    }

    permissions = [...permissions, ...this.generatePermissions('sectors', 'sector')];
    permissions = [...permissions, ...this.generatePermissions('categories', 'category')];

    const invite: Invite = {
      email: this.form.value.email,
      permissions
    }

    this.sendInviteToUser(invite);
  }

  sendInviteToUser(invite) {
    this.inviteReqStatus = 1;
    this.usersMngmtService.sendInvitation(invite)
      .subscribe(
        () => {
          this.inviteReqStatus = 2;
          delete this.inviteErrorMsg && this.inviteErrorMsg;
        },
        error => {
          this.inviteErrorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[invite-user.component]: ${this.inviteErrorMsg}`);
          this.inviteReqStatus = 3;
        }
      )
  }
}
