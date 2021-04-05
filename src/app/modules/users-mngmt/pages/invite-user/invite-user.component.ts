import { array } from '@amcharts/amcharts4/core';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from 'src/app/tools/validators/email.validator';
import { MultipleCheckboxValidator } from 'src/app/tools/validators/multiple-checkbox.validator';


@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {

  form: FormGroup;
  email: AbstractControl;
  roles: any = [
    {
      id: 1,
      name: 'admin'
    },
    {
      id: 2,
      name: 'country'
    },
    {
      id: 3,
      name: 'retailer'
    },
    {
      id: 4,
      name: 'hp'
    }
  ];
  countries = [
    {
      id: 1,
      name: 'México'
    },
    {
      id: 2,
      name: 'Argentina'
    },
    {
      id: 3,
      name: 'Chile'
    },
    {
      id: 4,
      name: 'Colombia'
    }
  ];
  retailers = [
    {
      id: 1,
      name: 'Liverpool'
    },
    {
      id: 2,
      name: 'Carrefourl'
    },
    {
      id: 3,
      name: 'Frávega'
    },
    {
      id: 4,
      name: 'Garbarino'
    },
    {
      id: 5,
      name: 'Office Depot'
    },
    {
      id: 6,
      name: 'Office Max'
    },
  ];
  sectors = [
    {
      id: 1,
      name: 'Marketing'
    },
    {
      id: 2,
      name: 'Retail'
    },
    {
      id: 3,
      name: 'WWS PS'
    },
    {
      id: 4,
      name: 'WWS Print'
    }
  ];
  categories = [
    {
      id: 1,
      name: 'Cómputo'
    },
    {
      id: 2,
      name: 'Impresoras'
    },
    {
      id: 3,
      name: 'Suministros'
    }
  ]
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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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
      countries: this.fb.array(
        this.countries.map(() => this.fb.control(''))
      ),
      retailers: this.fb.array(
        this.retailers.map(() => this.fb.control(''))
      ),
      sectors: this.fb.array(
        this.sectors.map(() => this.fb.control(''))
      ),
      categories: this.fb.array(
        this.categories.map(() => this.fb.control(''))
      ),
    });

    this.email = this.form.controls['email'];
  }

  roleChange() {
    this.resetFormControls();
    this.addFormValidators();
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
    console.log('this.form.value', this.form.value)
    const valueToStore = Object.assign({}, this.form.value, {
      countries: this.convertToValue('countries')
    });
    console.log(valueToStore);
  }

  allOptionsSelected(formSuboption) {
    return this.formSuboptions.find(opt => opt.name === formSuboption).allOptSelected;
  }
}
