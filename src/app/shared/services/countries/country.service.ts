import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CountryFactory } from '../../../models/country/country.factory';
import { CountryData } from '../../../models/country/country.interface';
import { Country } from '../../../models/country/country.model';

@Injectable()
export class CountryService {
  countries$: Observable<CountryData>;

  /*
    ToDo: get Countries via REST, result should be locale dependent
  */
  constructor() {
    this.countries$ = Observable.of(
      ({ countryCode: 'BG', name: 'Bulgaria' } as CountryData),
      ({ countryCode: 'DE', name: 'Germany' } as CountryData),
      ({ countryCode: 'FR', name: 'France' } as CountryData),
      ({ countryCode: 'IN', name: 'India' } as CountryData),
      ({ countryCode: 'GB', name: 'United Kingdom' } as CountryData),
      ({ countryCode: 'US', name: 'United States' } as CountryData)
    );
  }

  /*
    gets the available countries
    @returns (Observable<Country>)
  */
  getCountries(): Observable<Country> {
    return this.countries$.map(data => CountryFactory.fromData(data));
  }
}
