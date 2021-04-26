import { audioContent } from './audio';
import { videoContent } from './video';
import { imageContent } from './images';
import { getRandomInexInRange, getParametersFromNodeList } from './utils';

/*
let { collection: { metadata: { total_hits: totalHits }, items: imageItems} } = imageContent;
console.log(imageItems);
let innerHTML = '';

imageItems.forEach((item, i) =>{
  const randomItem = imageItems[getRandomInexInRange(imageItems.length)];
  innerHTML += `<a href="#" class="image__preview" style="background-image: url(${randomItem.links[0].href})" data-title="${randomItem.data[0].nasa_id}: ${randomItem.data[0].title}" data-description=
  "${randomItem.data[0].description}"></a>`;
}
);*/

window.renderApp = function () {
  document.getElementById('app-root').innerHTML = `
        ${App()}
    `;
};

window.data = {
  requestMade: false,
  searchValue: null,
  mediaTypes: null,
};

window.renderApp();

function App() {
  return `${window.data.requestMade ? ResponseLayout('top') : SearchLayout('middle')}`;
}

function SearchLayout(searchPosition) {
  return `${
    searchPosition === 'top'
      ? `<a href="/" onclick="window.openHomePage(event); window.renderApp()">home</a>`
      : ``
  }
    <form onsubmit="window.search(event); window.renderApp()" id="searchForm"
    ${searchPosition === 'top' ? `class="search__form_top"` : `class="search__form_middle"`}>    
    ${SearchInput()}
    ${MediaTypeSwitcher()}
    ${SearchButton()}
  </form>`;
}

window.openHomePage = e => {
  e.preventDefault();
  window.data.requestMade = false;
};

function ResponseLayout(searchPosition) {
  return `<div>
 ${SearchLayout(searchPosition)}
 <br>
 ${Filters()}
 <br>
 ${ResponseContent()}
</div>`;
}

function Filters() {
  return `filters`;
}

function ResponseContent() {
  return `ResponseContent`;
}

function MediaTypeSwitcher() {
  return `
    ${['image', 'audio', 'video']
      .map(mediaType => {
        return `<input type="checkbox" 
                       name="mediaType" 
                       id="${mediaType}" 
                       value="${mediaType}"
                       ${
                         window.data.mediaTypes !== null &&
                         window.data.mediaTypes.indexOf(mediaType) !== -1
                           ? `checked`
                           : ``
                       }>
           <label for="${mediaType}">${mediaType}</label>`;
      })
      .join('')}
  `;
}

function SearchInput() {
  return `<input type="text" 
                 id="searchInput" 
                 value="${window.data.searchValue !== null ? window.data.searchValue : ``}">`;
}

window.search = function (e) {
  e.preventDefault();
  requestMedia(e);
};

function requestMedia(e) {
  window.data.requestMade = true;
  const API_URL = 'https://images-api.nasa.gov/search',
    searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes(),
    requestURL = `${API_URL}?q=${searchInputValue}${
      mediaTypes.length ? `&media_type=${mediaTypes.join(',')}` : ''
    }`;
  window.data.mediaTypes = mediaTypes.length ? mediaTypes : null;
  window.data.searchValue = searchInputValue;
  console.log(requestURL);
  return 'Data requested';
}

function getMediaTypes() {
  const mediaTypes = document.querySelectorAll('#searchForm>input:checked');
  return getParametersFromNodeList('value', mediaTypes);
}

function SearchButton() {
  return `<button>search</button>`;
}

function getDataByContentType(contentTypes) {}

//todo add event enter ress on search
/* check if checkboxes was checked to perform search via enter or onclick
 * handle errors if request is unsuccessful
 * media types neede to know which files to request
 * checkbox mediaTypes window add to renderApp
 */
