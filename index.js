import {
  MEDIA_TYPE_SORTING_OPTIONS,
  SORTING_OPTIONS_TEXT,
  FILTERS_TEXT,
  FILTERS_BY_MEDIA_TYPE,
  RESPONSE_DATA_FILES,
} from './data.js';
import {
  requestMedia,
  removeClass,
  isFilterSelected,
  isOptionNeeded,
  isElementInArray,
  sortByDirection,
  resetState,
  prepareReponseDataForRendering,
} from './utils';
import styles from './style.css';

window.data = {
  requestMade: false,
  searchValue: null,
  mediaTypes: null,
  filters: {},
  selectedFiltersList: [],
  sortingSet: false,
  filteredData: [],
  filtersSelected: false,
  performFiltering: false,
  sortingOption: false,
  totalHits: null,
  responseData: RESPONSE_DATA_FILES,
};

window.renderApp = function () {
  document.getElementById('app-root').innerHTML = `
        ${App()}
    `;
};

window.openHomePage = e => {
  e.preventDefault();
  window.data.requestMade = false;
  window.data.searchValue = null;
  window.data.mediaTypes = null;
  resetState(window.data);
  removeClass(`${styles.no_image__background}`, document.body);
};

window.searchByTerm = e => {
  e.preventDefault();
  resetState(window.data);
  requestMedia(window.data);
  prepareReponseDataForRendering(window.data);
};

window.renderApp();

function App() {
  return `${window.data.requestMade ? ResponseLayout('top') : SearchLayout('middle')}`;
}

function SearchLayout(searchPosition) {
  return `
  <div class="${styles.form__wrapper} ${
    searchPosition === 'top' ? `${styles.search__form_top}` : `${styles.search__form_middle}`
  }">
  ${searchPosition === 'top' ? Logo() : ``}
  <form onsubmit="window.searchByTerm(event); window.renderApp()" id="searchForm" class="${
    styles.form
  }">    
    <div class="${styles.search__box}">    
      ${MediaTypeSwitcher(window.data)}
      ${SearchInput(window.data)}
    </div>
      ${SearchButton()}
  </form>
  </div>`;
}

function Logo() {
  return `
    <a href="/" onclick="window.openHomePage(event); window.renderApp()">
      <img src="${require('/assets/logo.svg')}"  class="${styles.logo}">
    </a>`;
}

function MediaTypeSwitcher(storage) {
  return `
  <label for="mediaSwitcherButton" class="${styles.media__switcher_label}">All media types</label>
  <input type="checkbox" class="${styles.media__switcher_button}" id="mediaSwitcherButton">
  <div class="${styles.media__switcher_wrapper}">
    ${['image', 'audio', 'video']
      .map(mediaType => {
        return `
          <div class="${styles.input__wrapper}">
            <input type="checkbox" 
                         class="${styles.mediaType}"
                         name="mediaType" 
                         id="${mediaType}" 
                         value="${mediaType}"
                         ${
                           storage.mediaTypes !== null &&
                           storage.mediaTypes.indexOf(mediaType) !== -1
                             ? `checked`
                             : ``
                         }>
            <label for="${mediaType}">${mediaType}</label>
          </div>
          `;
      })
      .join('')}
  </div>`;
}

function SearchInput(storage) {
  return `<input type="text" 
                 id="searchInput" 
                 placeholder='Search for ... (e.g. "Sun")'
                 class="${styles.search__input}"
                 value="${storage.searchValue !== null ? storage.searchValue : ``}">`;
}

function SearchButton() {
  return `<button class="${styles.search__button}">search</button>`;
}

function ResponseLayout(searchPosition) {
  return `
  ${SearchLayout(searchPosition)}
  <div class="${styles.response__layout}">
   <br>
   ${Filters()}
   <br>
   ${ResponseContent()}
  </div>`;
}

function Filters() {
  return `
  <form id="filters" class="${styles.filters__wrapper}">
    ${FiltersByCategories(window.data.filters)}
  </form>`;
}

function FiltersByCategories(filtersContainer) {
  return Object.keys(filtersContainer)
    .map(filterName => {
      return `
      <h3 class="${styles.filter__heading}">${FILTERS_TEXT[filterName]}</h3>
      <div class="${styles.filter__item_wrapper}">
        ${Object.keys(filtersContainer[filterName])
          .map(filterContent => {
            return Filter(filterContent, filtersContainer[filterName][filterContent], filterName);
          })
          .join('')}
      </div>`;
    })
    .join('');
}

function Filter(filterName, filterCounter, categorie) {
  return `
    <label class="${styles.filter__label}"> 
      <input value="${filterName}" 
        name="${filterName}"
        data-categorie="${categorie}" 
        type="checkbox"
        ${
          isFilterSelected(window.data.selectedFiltersList, filterName, categorie)
            ? `checked="checked"`
            : ``
        }
        onchange="window.selectFilter(window.data, this); renderApp();">
      <span class="${styles.text}">${filterName} </span>
      <span class="${styles.filter__counter}">(${filterCounter})</span>      
    </label>
  `;
}

window.selectFilter = function (storage, filter) {
  const { value } = filter,
    categorie = filter.getAttribute('data-categorie');
  storage.filtersSelected = true;
  if (!isFilterSelected(storage.selectedFiltersList, value, categorie)) {
    storage.selectedFiltersList.push({ value, categorie });
  } else {
    window.removeFilter(storage, filter);
  }
};

function ResponseContent() {
  return `
  <div class="${styles.cards__wrapper}">
    <div class="${styles.sort_hits_wrapper}">
      <h3 class="${styles.total_hits}">
        Total hits ${window.data.totalHits} for ${window.data.searchValue}
      </h3>  
      ${SortSelect()}
    </div>
    ${SelectedFilters(window.data)}
    ${MediaContentCards(window.data)}
  </div>
  `;
}

function SortSelect() {
  return `
  <label>Sort by:
    <select name="mediaSort"  
      id="mediaSort" 
      onchange="window.sortMedia(window.data, event); window.renderApp()">
      ${SortOptions(window.data)}
    </select>
  </label>`;
}

function SortOptions(storage) {
  return Object.keys(SORTING_OPTIONS_TEXT)
    .map(option => {
      if (isOptionNeeded(storage, option)) {
        return ['ascending', 'descending']
          .map(sortType => {
            return `<option 
                      value="${option}_${sortType}" 
                      class="${styles.sorting__option}"
                      ${
                        storage.sortingSet && storage.sortingOption === `${option}_${sortType}`
                          ? `selected="selected"`
                          : ''
                      }"
                      >
                   ${SORTING_OPTIONS_TEXT[option]} ${
              sortType === 'ascending' ? '&#8593;' : '&#8595;'
            }
                </option>`;
          })
          .join('');
      }
    })
    .join('');
}

window.sortMedia = (storage, e) => {
  const data = storage.filtersSelected ? storage.filteredData : storage.flattenedData;
  const [option, direction] = e.target.value.split('_');
  storage.sortingOption = e.target.value;
  storage.sortingSet = true;
  sortByDirection[direction](data, option);
};

function SelectedFilters(storage) {
  return `<div class="${styles.selected__filters}">
      ${storage.filtersSelected ? showSelectedFilters(storage) : ''}
      ${storage.selectedFiltersList.length ? FilterButton() : ''}
    </div>`;
}

function FilterButton() {
  return `<button onclick='window.filterItems(window.data);renderApp()' 
            class="${styles.filter__button}">Apply filters</button>`;
}

window.filterItems = storage => {
  storage.performFiltering = true;
  storage.filteredData = [];
  storage.selectedFiltersList.forEach(filter => {
    const categorie = filter.categorie;
    storage.flattenedData.forEach(dataItem => {
      if (storage.filteredData.indexOf(dataItem) === -1 && dataItem[categorie]) {
        if (Array.isArray(dataItem[categorie])) {
          if (isElementInArray(dataItem[categorie], filter.value)) {
            storage.filteredData.push(dataItem);
          }
        } else {
          if (dataItem[categorie].toUpperCase() === filter.value) {
            storage.filteredData.push(dataItem);
          }
        }
      }
    });
  });
  storage.totalHits = storage.filteredData.length;
};

function SelectedFilter(filterSelected) {
  return `<div class="${styles.filter__selected_container}">
            <span class="${styles.filter__selected}">${filterSelected.categorie}: ${filterSelected.value}</span>
            <button class="${styles.remove__filter}" 
              onclick="window.removeFilter(window.data, this); renderApp();" 
              value="${filterSelected.value}" data-categorie="${filterSelected.categorie}">x</button>
          </div>`;
}

function showSelectedFilters(storage) {
  return `${storage.selectedFiltersList.map(filter => SelectedFilter(filter)).join('')}`;
}

window.removeFilter = (storage, filter) => {
  const { value: filterName } = filter,
    categorie = filter.getAttribute('data-categorie');
  const deleteIndex = storage.selectedFiltersList.findIndex(
    element => element.value === filterName && categorie === element.categorie,
  );
  storage.selectedFiltersList.splice(deleteIndex, 1);
  if (!storage.selectedFiltersList.length) {
    storage.performFiltering = false;
    storage.filtersSelected = false;
    storage.totalHits = storage.flattenedData.length;
  }
};

function MediaContentCards(storage) {
  const data = !storage.performFiltering ? storage.flattenedData : storage.filteredData;
  return `${data.map(dataItem => Card(dataItem)).join('')}`;
}

function Card(dataItem) {
  return `
  <div class="${styles.card__item} 
    ${
      dataItem.mediaType === 'audio'
        ? `${styles.audio}`
        : dataItem.mediaType === 'video'
        ? `${styles.video}`
        : `${styles.image}`
    }" 
    style="background-image: url(
    ${dataItem.previewImage !== null ? dataItem.previewImage : require('./assets/audio.svg')})" 
    data-title="${dataItem.title}">
  </div>`;
}
