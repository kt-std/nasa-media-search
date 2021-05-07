import { responseDataFiles } from './data.js';
import {
  getParametersFromNodeList,
  getSeconds,
  flat,
  addClass,
  removeClass,
  getIndexByString,
  keysForMetadataByMediaType,
  removeSpacesFromLink,
  calculateTotalHits,
  getConciseContentFromRespond,
  keywordIsASingleWord,
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
    Image sort by: creation date, resolution.
*/

/*collection{
    items [
      0: {
        data [{
          keywords[] / ""
          date_created
          center
        }]
        links [{
          rel: "preview" 
          href
        }]
        href: "link to collection"
      }
    ]
  }
  _collection: [
    "metadata.json"
  ]
  _metadata: {
  ::video
    AVAIL:Location
    AVAIL:Photographer
    QuickTime:VideoFrameRate
    QuickTime:Duration
    File:FileSize
  ::image
    XMP:Creator [""]
    EXIF:ColorSpace
    File:FileSize
    Composite:ImageSize
    AVAIL:Album
  ::audio
    Composite:AvgBitrate
    MPEG:AudioBitrate 
    QuickTime:Duration
    File:FileSize
  }
*/
window.data = {
  requestMade: false,
  searchValue: null,
  mediaTypes: null,
  totalHits: null,
  responseData: responseDataFiles,
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
  <h3 class="filter__heading">Key terms</h3>
  ${getFiltersByKeyTerms()}
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

function ResponseContent() {
  return `
  <!--<h3 class="total_hits">Total hits ${window.data.totalHits} for ${
    window.data.searchValue
  }</h3>-->  
  <div class="cards__wrapper">
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
  requestMedia(e);
  prepareReponseDataForRendering();
};

function getFiltersByKeyTerms() {
  let filters = '';
  for (let filter of Object.keys(window.data.filters)) {
    filters += Filter(filter, window.data.filters[filter]);
  }
  return filters;
}

function prepareReponseDataForRendering() {
  const flattenedData = getResponseData();
  window.data.flattenedData = flattenedData;
  window.data.splittedData = splitContentByMediaTypes(flattenedData);
  window.data.filters = separateFilteringTerms();
  getMetadataForDataItem();
  getFiltersDataFromMetadata();
}

function getFiltersDataFromMetadata() {
  window.data.flattenedData.forEach(dataItem => {
    window.data.mediaTypes.forEach(mediaType => {
      const mediaMetadata = window.data.responseData[mediaType].metadata,
        mediaKeysNeeded = keysForMetadataByMediaType[mediaType];
      for (let key of Object.keys(mediaKeysNeeded)) {
        key === 'duration'
          ? (dataItem[key] = getDurationValueFromString(mediaMetadata[mediaKeysNeeded[key]]))
          : (dataItem[key] = mediaMetadata[mediaKeysNeeded[key]]);
      }
    });
  });
}

function getMetadataForDataItem() {
  window.data.flattenedData.forEach(dataItem => {
    const collectionData = window.data.responseData[dataItem.mediaType].collection,
      [metadataIndex] = getIndexByString('metadata.json', collectionData);
    dataItem.metadata = metadataIndex;
  });
}

function separateFilteringTerms() {
  const filters = {};
  window.data.flattenedData.forEach(dataItem => {
    dataItem.keywords.forEach(keyword => {
      if (keywordIsASingleWord(keyword)) {
        if (!filters[keyword.toUpperCase()]) {
          filters[keyword.toUpperCase()] = 1;
        } else {
          filters[keyword.toUpperCase()]++;
        }
      }
    });
  });
  return filters;
}

function splitContentByMediaTypes(responseData) {
  const splittedData = {};
  window.data.mediaTypes.forEach(mediaType => {
    splittedData[mediaType] = responseData.filter(
      responseItem => responseItem.media_type === mediaType,
    );
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
