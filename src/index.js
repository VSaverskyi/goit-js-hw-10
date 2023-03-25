import debounce from 'lodash.debounce';
import './css/styles.css';
import { FetchCountriesAPI } from './fetchCountries';

const countriesSearchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const fetchCountriesAPI = new FetchCountriesAPI();

const onCountriesSearchInput = e => {
  const seekedCountry = e.target.value.trim();

  if (seekedCountry === '') {
    clearCountriesInfo();
  }

  fetchCountriesAPI
    .fetchCountries(seekedCountry)
    .then(data => {
      countryInfoEl.innerHTML = `<div class="flags-wrapper"><img src=${
        data[0].flags.svg
      } alt=${data[0].flags.alt} width="60" height="40">
<h2 class="country-name">${data[0].name.official}</h2></div>
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
      console.log(data);
    })
    .catch(err => {
      console.log(err);
      countryInfoEl.innerHTML = 'Oops, there is no country with that name';
    });
};

countriesSearchInputEl.addEventListener(
  'input',
  debounce(onCountriesSearchInput, DEBOUNCE_DELAY)
);

function clearCountriesInfo() {
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
  return;
}
