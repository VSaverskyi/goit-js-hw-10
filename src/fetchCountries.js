'use strict';

export class FetchCountriesAPI {
  #BASE_URL = 'https://restcountries.com/v3.1';

  fetchCountries(name) {
    return fetch(
      `${
        this.#BASE_URL
      }/name/${name}?fields=name,capital,population,flags,languages`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
}
