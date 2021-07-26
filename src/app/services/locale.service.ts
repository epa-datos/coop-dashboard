import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  //Chosse Locale From This Link
  //https://github.com/angular/angular/tree/master/packages/common/locales

  private _locale: string;

  set locale(value: string) {
    this._locale = value;
  }
  get locale(): string {
    const selectedLang = JSON.parse(localStorage.getItem('lang'));
    if (selectedLang === 'en') {
      return 'en';
    }
    return 'es-Ar';
  }

  public registerCulture(culture: string) {
    if (!culture) {
      return;
    }
    switch (culture) {
      case 'en': {
        this._locale = 'en';
        console.log('Application Culture Set to English');
        break;
      }
      default: {
        this._locale = 'es-Ar';
        console.log('Application Culture Set to Spanish');
        break;
      }
    }
  }
}
