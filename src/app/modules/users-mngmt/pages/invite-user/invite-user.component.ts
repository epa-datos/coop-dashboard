import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      .then((resp: any[]) => {
        this.countries = resp;
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
        this.retailers = resp;
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

  roleChange() {
    // Add all options for countries, retailer, sectors and categories in form 
    // only if these variables have not been assigned a value previously
    this.fillFormOptions();

    // clean all selected options and reset validators
    this.resetFormControls();

    // add validators based on selected role
    this.addFormValidators();
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

  resetFormControls() {
    this.formSuboptions.forEach(opt => {
      // reset form controls values
      this.form.controls[opt.name].reset();

      // reset form controls validators
      this.form.controls[opt.name].setValidators([]);
      this.form.controls[opt.name].updateValueAndValidity();
    });
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
  }

  convertToValue(key: string) {
    return this.form.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
  }

  onSubmit() {
    const valueToStore = Object.assign({}, this.form.value, {
      countries: this.convertToValue('countries'),
      retailers: this.convertToValue('retailers'),
      sectors: this.convertToValue('sectors'),
      categories: this.convertToValue('categories'),
    });
    console.log(valueToStore);
  }

  allOptionsSelected(formSuboption) {
    return this.formSuboptions.find(opt => opt.name === formSuboption).allOptSelected;
  }
}
