import debounce from 'lodash.debounce';
import './css/styles.css';
import { FetchCountriesAPI } from './fetchCountries';
import createCountriesList from './templates/create-countries-list.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const countriesSearchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const fetchCountriesAPI = new FetchCountriesAPI();

const onCountriesSearchInput = e => {
  const seekedCountry = e.target.value.trim();

  if (seekedCountry === '') {
    clearCountryInfo();
    clearCountriesList();
    return;
  }

  fetchCountriesAPI
    .fetchCountries(seekedCountry)
    .then(data => {
      if (data.length === 1) {
        clearCountriesList();
        markUpCountryCard(data);
      } else if (data.length >= 2 && data.length <= 10) {
        clearCountryInfo();
        markUpCountriesList(data);
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(err => {
      clearCountriesList();
      clearCountryInfo();
      Notify.failure('Oops, there is no country with that name');
    });
};

countriesSearchInputEl.addEventListener(
  'input',
  debounce(onCountriesSearchInput, DEBOUNCE_DELAY)
);

function clearCountryInfo() {
  countryInfoEl.innerHTML = '';
}

function clearCountriesList() {
  countryListEl.innerHTML = '';
}

function markUpCountryCard(data) {
  countryInfoEl.innerHTML = `<div class="flags-wrapper">
  <img src=${data[0].flags.svg} alt=${data[0].flags.alt} width="40">
<h2 class="country-name">${data[0].name.official}</h2>
</div>
<ul class="country-info list">
    <li class="country-info-item">
        <p class="capital">Capital: ${data[0].capital}</p>
    </li>
    <li class="country-info-item">
        <p class="population">Population: ${data[0].population}</p>
    </li>
    <li class="country-info-item">
        <p class="languages">Languages: ${Object.values(data[0].languages)}</p>
    </li>
</ul>`;
}

function markUpCountriesList(data) {
  countryListEl.innerHTML = createCountriesList(data);
}
