import {
  MEDIA_TYPE_SORTING_OPTIONS,
  SORTING_OPTIONS_TEXT,
  FILTERS_TEXT,
  FILTERS_BY_MEDIA_TYPE,
  RESPONSE_DATA_FILES,
} from './data.js';
import {
  getParametersFromNodeList,
  getSeconds,
  flat,
  addClass,
  removeClass,
  getIndexByString,
  MEDATADA_KEYS_BY_MEDIA_TYPE,
  removeSpacesFromLink,
  calculateTotalHits,
  getConciseContentFromRespond,
  getDurationValueFromString,
} from './utils';
import './style.css';

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
  resetState();
  removeClass('no_image__background', document.body);
};

window.renderApp();

function App() {
  return `${window.data.requestMade ? ResponseLayout('top') : SearchLayout('middle')}`;
}

function SearchLayout(searchPosition) {
  return `
  <div class="form__wrapper ${
    searchPosition === 'top' ? `search__form_top` : `search__form_middle`
  }">
  ${searchPosition === 'top' ? Logo() : ``}
  <form onsubmit="window.searchByTerm(event); window.renderApp()" id="searchForm" class="form">    
    <div class="search__box">    
      ${MediaTypeSwitcher()}
      ${SearchInput()}
    </div>
      ${SearchButton()}
  </form>
  </div>`;
}

function Logo() {
  return `
    <a href="/" onclick="window.openHomePage(event); window.renderApp()">
      <img src="${require('/assets/logo.svg')}"  class="logo">
    </a>`;
}

function ResponseLayout(searchPosition) {
  return `
  ${SearchLayout(searchPosition)}
  <div class="response__layout">
   <br>
   ${Filters()}
   <br>
   ${ResponseContent()}
  </div>`;
}

function Filters() {
  return `
  <form id="filters" class="filters__wrapper">
    ${getFiltersByCategories(window.data.filters)}
  </form>`;
}

function Filter(filterName, filterCounter, categorie) {
  return `
    <label class="filter__label"> 
      <input value="${filterName}" 
        name="${filterName}"
        data-categorie="${categorie}" 
        type="checkbox"
        ${isFilterSelected(window.data.selectedFiltersList, filterName) ? `checked="checked"` : ``}
        onchange="window.selectFilter(this.value); renderApp();">
      <span class="text">${filterName} </span>
      <span class="filter__counter">(${filterCounter})</span>      
    </label>
  `;
}

window.selectFilter = function (value) {
  window.data.filtersSelected = true;
  if (!isFilterSelected(window.data.selectedFiltersList, value)) {
    window.data.selectedFiltersList.push(value);
  } else {
    window.removeFilter(value);
  }
};

function isFilterSelected(filtersSelected, filterName) {
  return filtersSelected.indexOf(filterName) !== -1;
}

function Sort() {
  return `
  <label>Sort by:
    <select name="mediaSort"  
      id="mediaSort" 
      onchange="window.data.sortMedia(
      ${window.data.filtersSelected ? 'window.data.filteredData' : 'window.data.flattenedData'}
      , event); window.renderApp()">
      ${getSortOptions()}
    </select>
  </label>`;
}

function getSortOptions() {
  return Object.keys(SORTING_OPTIONS_TEXT)
    .map(option => {
      if (isOptionNeeded(option)) {
        return ['ascending', 'descending']
          .map(sortType => {
            return `<option 
                      value="${option}_${sortType}" 
                      class="sorting__option"
                      ${
                        window.data.sortingSet &&
                        window.data.sortingOption === `${option}_${sortType}`
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

function isOptionNeeded(option) {
  return window.data.mediaTypes.some(mediaType => {
    return MEDIA_TYPE_SORTING_OPTIONS[mediaType].indexOf(option) !== -1;
  });
}

function ResponseContent() {
  return `
  <div class="cards__wrapper">
    <div class="sort_hits_wrapper">
      <h3 class="total_hits">Total hits ${window.data.totalHits} for ${
    window.data.searchValue
  }</h3>  
      ${Sort()}
    </div>
    ${SelectedFilters()}
    ${
      !window.data.performFiltering
        ? MediaContentCards(window.data.flattenedData)
        : MediaContentCards(window.data.filteredData)
    }
  </div>
  `;
}

function SelectedFilters() {
  return `<div class="selected__filters">
      ${window.data.filtersSelected ? showSelectedFilters() : ''}
      ${window.data.selectedFiltersList.length ? FilterButton() : ''}
    </div>`;
}

function FilterButton() {
  return `<button onclick='window.filterItems();renderApp()' 
            class="filter__button">Apply filters</button>`;
}

window.filterItems = () => {
  window.data.performFiltering = true;
  window.data.filteredData = [];
  const selectedFiltersWithCategories = getSelectedFiltersWithCategories();
  selectedFiltersWithCategories.forEach(filter => {
    const categorie = filter.categorie;
    window.data.flattenedData.forEach(dataItem => {
      if (window.data.filteredData.indexOf(dataItem) === -1 && dataItem[categorie]) {
        if (isArray(dataItem[categorie])) {
          //find element in array case sensitive performFiltering when no filters
          if (isElementInArray(dataItem[categorie], filter.value)) {
            window.data.filteredData.push(dataItem);
          }
        } else {
          if (dataItem[categorie].toUpperCase() === filter.value) {
            window.data.filteredData.push(dataItem);
          }
        }
      }
    });
  });
};

function isElementInArray(data, element) {
  return data.some(dataItem => dataItem.toUpperCase() === element);
}

function getSelectedFiltersWithCategories() {
  return Array.from(document.querySelectorAll('#filters input:checked')).map(selectedFilter => {
    return {
      value: selectedFilter.value,
      categorie: selectedFilter.getAttribute('data-categorie'),
    };
  });
}

function showSelectedFilters() {
  return `${window.data.selectedFiltersList
    .map(filterSelected => SelectedFilter(filterSelected))
    .join('')}`;
}

function SelectedFilter(filterSelected) {
  return `<div class="filter__selected_container">
            <span class="filter__selected">${filterSelected}</span>
            <button class="remove__filter" 
              onclick="window.removeFilter(this.value); renderApp();" 
              value="${filterSelected}">x</button>
          </div>`;
}

window.removeFilter = filterName => {
  const deleteIndex = window.data.selectedFiltersList.indexOf(filterName);
  window.data.selectedFiltersList.splice(deleteIndex, 1);
  if (!window.data.selectedFiltersList.length) {
    //console.log(window.data.selectedFiltersList.length);
    window.data.performFiltering = false;
  }
};

function MediaContentCards(data) {
  return `${data.map(dataItem => Card(dataItem)).join('')}`;
}
///check if sorting without value is done right
window.data.sortMedia = (data, e) => {
  const [option, direction] = e.target.value.split('_');
  window.data.sortingOption = e.target.value;
  window.data.sortingSet = true;
  // console.log(data.map(item=>item[option]).join(", "));
  data = sortByDirection(data, option, direction);
  //  console.log(data.map(item=>item[option]).join(", "));
  // console.log(data.map(item=>item[option]).join(', '));
};

function sortByDirection(data, option, direction) {
  const undefinedItems = data.filter(dataItem => dataItem[option] === undefined);
  const definedItems = data.filter(dataItem => dataItem[option] !== undefined);
  return definedItems
    .sort((current, next) =>
      direction === 'ascending' ? current[option] - next[option] : next[option] - current[option],
    )
    .concat(undefinedItems);
}

function Card(dataItem) {
  return `
  <div class="card__item ${
    dataItem.mediaType === 'audio' ? 'audio' : dataItem.mediaType === 'video' ? 'video' : 'image'
  }" style="background-image: url(
    ${
      dataItem.previewImage !== null ? dataItem.previewImage : require('./assets/audio.svg')
    })" data-title="${dataItem.title}"></div>
  `;
}

function MediaTypeSwitcher() {
  return `
  <label for="mediaSwitcherButton" class="media__switcher_label">All media types</label>
  <input type="checkbox" class="media__switcher_button" id="mediaSwitcherButton">
  <div class="media__switcher_wrapper">
    ${['image', 'audio', 'video']
      .map(mediaType => {
        return `
          <div class="input__wrapper">
            <input type="checkbox" 
                         class="mediaType"
                         name="mediaType" 
                         id="${mediaType}" 
                         value="${mediaType}"
                         ${
                           window.data.mediaTypes !== null &&
                           window.data.mediaTypes.indexOf(mediaType) !== -1
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

function SearchInput() {
  return `<input type="text" 
                 id="searchInput" 
                 placeholder='Search for ... (e.g. "Sun")'
                 class="search__input"
                 value="${window.data.searchValue !== null ? window.data.searchValue : ``}">`;
}

function SearchButton() {
  return `<button class="search__button">search</button>`;
}

window.searchByTerm = e => {
  e.preventDefault();
  resetState();
  requestMedia(e);
  prepareReponseDataForRendering();
};

function resetState() {
  window.data.totalHits = null;
  window.data.sortingSet = false;
  window.data.selectedFiltersList = [];
  window.data.performFiltering = false;
  window.data.filtersSelected = false;
  window.data.filters = {};
}

function getFiltersByCategories(filtersContainer) {
  return Object.keys(filtersContainer)
    .map(filterName => {
      return `<h3 class="filter__heading">${FILTERS_TEXT[filterName]}</h3>
      <div class="filter__item_wrapper">
        ${Object.keys(filtersContainer[filterName])
          .map(filterContent => {
            return Filter(filterContent, filtersContainer[filterName][filterContent], filterName);
          })
          .join('')}
      </div>`;
    })
    .join('');
}

function prepareReponseDataForRendering() {
  window.data.flattenedData = getResponseData();
  getMetadataForDataItem(window.data.flattenedData, window.data.responseData);
  getFiltersDataFromMetadata(
    window.data.flattenedData,
    window.data.mediaTypes,
    window.data.responseData,
  );
  getFiltersFromLists(window.data.flattenedData, window.data.mediaTypes, window.data.filters);
  window.data.splittedData = splitContentByMediaTypes(
    window.data.mediaTypes,
    window.data.flattenedData,
  );
}

function getFiltersFromLists(data, mediaTypes, filtersContainer) {
  data.forEach(dataItem => {
    mediaTypes.forEach(mediaType => {
      FILTERS_BY_MEDIA_TYPE[mediaType].forEach(key => {
        if (!filtersContainer[key]) {
          filtersContainer[key] = {};
        }
        if (dataItem[key]) {
          if (isArray(dataItem[key])) {
            dataItem[key].forEach(keyword => {
              if (mediaType === dataItem.mediaType) {
                updateFilterValue(filtersContainer[key], keyword);
              }
            });
          } else {
            updateFilterValue(filtersContainer[key], dataItem[key]);
          }
        }
      });
    });
  });
}

function isArray(data) {
  return Array.isArray(data);
}

function getFiltersDataFromMetadata(data, mediaTypes, responseData) {
  data.forEach(dataItem => {
    mediaTypes.forEach(mediaType => {
      const mediaMetadata = responseData[mediaType].metadata,
        mediaKeysNeeded = MEDATADA_KEYS_BY_MEDIA_TYPE[mediaType];
      for (let key of Object.keys(mediaKeysNeeded)) {
        if (dataItem.mediaType === mediaType) {
          transformKeyValueToNumber(key, dataItem, mediaMetadata[mediaKeysNeeded[key]]);
        }
      }
    });
  });
}

function transformKeyValueToNumber(key, dataItem, metadataValue) {
  switch (key) {
    case 'album':
      dataItem[key] = getImageAlbum(metadataValue);
      break;
    case 'duration':
      dataItem[key] = getDurationValueFromString(metadataValue) + Math.floor(Math.random() * 100);
      break;
    case 'size':
      dataItem[key] = getSizeInKBFromString(metadataValue);
      dataItem[`${key}Value`] = dataItem[key].value;
      break;
    case 'bitrate':
      dataItem[`${key}Value`] =
        getNumberFromString(metadataValue) + Math.floor(Math.random() * 100);
      dataItem[key] = metadataValue;
      break;
    case 'resolution':
      dataItem[key] = getResolutionFromString(metadataValue);
      dataItem[`${key}Origin`] = metadataValue;
      dataItem[`${key}Value`] = dataItem[key].height * dataItem[key].width;
      break;
    default:
      dataItem[key] = metadataValue;
  }
}

function getImageAlbum(value) {
  return !value ? 'unknown' : value;
}

function getSizeInKBFromString(value) {
  const [number, unit] = value.split(' ');
  switch (unit.toUpperCase()) {
    case 'KB':
      return { number, unit, value: getNumberFromString(number) };
    case 'MB':
      return { number, unit, value: getNumberFromString(number) * 1024 };
    case 'GB':
      return { number, unit, value: getNumberFromString(number) * 1024 * 1024 };
  }
}

function getResolutionFromString(value) {
  const [height, width] = value.toLowerCase().split('x');
  return { height: getNumberFromString(height), width: getNumberFromString(width), value };
}

function getNumberFromString(value) {
  return value ? parseInt(value) : undefined;
}

function getMetadataForDataItem(data, responseData) {
  data.forEach(dataItem => {
    const collectionData = responseData[dataItem.mediaType].collection,
      [metadataIndex] = getIndexByString('metadata.json', collectionData);
    dataItem.metadata = metadataIndex;
  });
}

function getFiltersByKeyName(data, key, filtersContainer) {
  data.forEach(dataItem => {
    updateFilterValue(filtersContainer[key], dataItem[key]);
  });
}

function updateFilterValue(filtersContainer, keyword) {
  if (keyword !== undefined) {
    if (!filtersContainer[keyword.toUpperCase()]) {
      filtersContainer[keyword.toUpperCase()] = 1;
    } else {
      filtersContainer[keyword.toUpperCase()]++;
    }
  }
}

function splitContentByMediaTypes(mediaTypes, data) {
  const splittedData = {};
  mediaTypes.forEach(mediaType => {
    splittedData[mediaType] = data.filter(dataItem => dataItem.mediaType === mediaType);
  });
  return splittedData;
}

function getResponseData() {
  return flat(
    window.data.mediaTypes.map(mediaType => {
      const respondData = window.data.responseData[mediaType];
      return getConciseContentFromRespond(window, respondData.content);
    }),
  );
}

function requestMedia() {
  changeStateToRequestMade();
  const searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes(),
    requestURL = createRequestURL(searchInputValue, mediaTypes);
  window.data.mediaTypes = setSelectedMediaTypes(mediaTypes);
  window.data.searchValue = searchInputValue;
  return 'Data requested';
}

function changeStateToRequestMade() {
  window.data.requestMade = true;
  addClass('no_image__background', document.body);
}

function createRequestURL(searchInputValue, mediaTypes) {
  const API_URL = 'https://images-api.nasa.gov/search';
  return `${API_URL}?q=${searchInputValue}${
    mediaTypes.length ? `&media_type=${mediaTypes.join(',')}` : ''
  }`;
}

function setSelectedMediaTypes(mediaTypes) {
  return mediaTypes.length ? mediaTypes : null;
}

function getMediaTypes() {
  const mediaTypes = document.querySelectorAll('input[name="mediaType"]:checked');
  return getParametersFromNodeList('value', mediaTypes);
}

//todo add event enter ress on search
/* check if checkboxes was checked to perform search via enter or onclick
 * handle errors if request is unsuccessful
 * media types neede to know which files to request
 * checkbox mediaTypes window add to renderApp
 */
