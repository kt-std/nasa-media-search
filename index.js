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

/*
For each media type filtering have to be performed by different categories:

    Video filter by: keywords, location, photographer; 
    Audio filter by: keywords, center, bitrate;
    Image filter by: keywords, center, creator, color space, image size, album.

For each media type sorting have to be performed differently:

    Video sort by: creation date, duration, file size, frame rate; 
    Audio sort by: creation date, duration, file size, bitrate;
    Image sort by: creation date, file size, resolution.
*/

window.data = {
  requestMade: false,
  searchValue: null,
  mediaTypes: null,
  filters: {},
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
  <div class="filters__wrapper">
    ${getFiltersByCategories(window.data.filters)}
  </div>`;
}

function Filter(filterName, filterCounter) {
  return `
    <label class="filter__label"> 
      <span class="text">${filterName} </span>
      <span class="filter__counter">(${filterCounter})</span>
      <input value="${filterName}" name="${filterName}" type="checkbox">
    </label>
  `;
}
function Sort() {
  return `
  <label>Sort by:
    <select name="mediaSort" id="mediaSort">
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
            return `<option value="${option}_${sortType}" class="sorting__option">
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
    ${MediaContentCards()}
  </div>
  `;
}

function MediaContentCards() {
  return `${window.data.flattenedData.map(dataItem => Card(dataItem)).join('')}`;
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
  window.data.totalHits = null;
  window.data.filters = {};
  requestMedia(e);
  prepareReponseDataForRendering();
};

function getFiltersByCategories(filtersContainer) {
  return Object.keys(filtersContainer)
    .map(filterName => {
      return `<h3 class="filter__heading">${FILTERS_TEXT[filterName]}</h3>
      <div class="filter__item_wrapper">
        ${Object.keys(filtersContainer[filterName])
          .map(filterContent => {
            return Filter(filterContent, filtersContainer[filterName][filterContent]);
          })
          .join('')}
      </div>`;
    })
    .join('');
}

function prepareReponseDataForRendering() {
  const flattenedData = getResponseData();
  window.data.flattenedData = flattenedData;
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
      dataItem[key] = getDurationValueFromString(metadataValue);
      break;
    case 'size':
      dataItem[key] = getSizeInKBFromString(metadataValue);
      dataItem[`${key}Value`] = dataItem[key].value;
      break;
    case 'bitrate':
      dataItem[`${key}Value`] = getNumberFromString(metadataValue);
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
  return value ? parseInt(value) : null;
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
  if (keyword !== null) {
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
