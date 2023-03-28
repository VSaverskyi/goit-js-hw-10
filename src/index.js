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
        e.target.value = '';
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
      if (err.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      } else {
        console.log('Error: ' + err.message);
      }
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
  const { flags, name, capital, population, languages } = data[0];
  countryInfoEl.innerHTML = `<div class="flags-wrapper">
  <img src=${flags.svg} alt=${flags.alt} width="40" class="country-flag-img">
<h2 class="country-name">${name.official}</h2>
</div>
<ul class="country-info list">
    <li class="country-info-item">
        <p class="capital"><span class="country-description-text">Capital</span>: ${capital}</p>
    </li>
    <li class="country-info-item">
        <p class="population"><span class="country-description-text">Population</span>: ${population}</p>
    </li>
    <li class="country-info-item">
        <p class="languages"><span class="country-description-text">Languages</span>: ${Object.values(
          languages
        )}</p>
    </li>
</ul>`;
}

function markUpCountriesList(data) {
  countryListEl.innerHTML = createCountriesList(data);
}
