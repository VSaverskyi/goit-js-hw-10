import debounce from 'lodash.debounce';
import './css/styles.css';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countriesSearchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countriesSearchInput.addEventListener(
  'input',
  debounce(onCountriesSearchInput, DEBOUNCE_DELAY)
);

function onCountriesSearchInput(e) {
  const seekedCountry = e.target.value.trim();
  console.log(seekedCountry);
  fetchCountries(seekedCountry)
    .then(data => {
      console.log(data[0].flags.svg);
      refs.countryInfo.innerHTML = `<img src=${data[0].flags.svg} alt=${
        data[0].flags.alt
      } width="60">
      <h2 class="country-name">${data[0].name.official}</h2>
      <ul class="country-info list">
          <li class="country-info-item">
              <p class="capital">Capital: ${data[0].capital}</p>
          </li>
          <li class="country-info-item">
              <p class="population">Population: ${data[0].population}</p>
          </li>
          <li class="country-info-item">
              <p class="languages">Languages: ${Object.values(
                data[0].languages
              )}</p>
          </li>
      </ul>`;
    })
    .catch(err => {
      refs.countryInfo.innerHTML = 'Oops, there is no country with that name';
    });
}
