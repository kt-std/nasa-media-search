import { audioContent } from './audio';
import { videoContent } from './video';
import { imageContent } from './images';
import { getRandomInexInRange } from './utils';

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
};

window.renderApp();

function App() {
  return `${window.data.requestMade ? ResponseLayout('top') : SearchLayout('middle')}`;
}

function SearchLayout(searchPosition) {
  return `<form 
    ${searchPosition === 'top' ? `class="search__form_top"` : `class="search__form_middle"`}>
    ${
      searchPosition === 'top'
        ? `<a href="/" onclick="window.openHomePage(event); window.renderApp()">home</a>`
        : ``
    }
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
        return `<input type="checkbox" name="mediaType" id="${mediaType}" value="${mediaType}">
           <label for="${mediaType}">${mediaType}</label>`;
      })
      .join('')}
  `;
}

function SearchInput() {
  return `<input type="text">`;
}

window.search = function (e) {
  e.preventDefault();
  requestData();
};

function requestData() {
  window.data.requestMade = true;
  return 'Data requested';
}

function SearchButton() {
  return `<button onclick="window.search(event); window.renderApp()">search</button>`;
}

//todo add event enter ress on search
/* check if checkboxes was checked to perform search via enter or onclick
 */
