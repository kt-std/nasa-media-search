import { audioContent } from './audio.js';
import { audioCollection } from './audio_collection';
import { audioMetadata } from './audio_metadata';
import { videoContent } from './video';
import { videoCollection } from './video_collection';
import { videoMetadata } from './video_metadata';
import { imageContent } from './image';
import { imageCollection } from './image_collection';
import { imageMetadata } from './image_metadata';
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

const neccessaryKeysForEachMedia = {
  metadata: {
    video: [
      'AVAIL:Location',
      'AVAIL:Photographer',
      'QuickTime:VideoFrameRate',
      'QuickTime:Duration',
      'File:FileSize',
    ],
    image: [
      'XMP:Creator',
      'EXIF:ColorSpace',
      'File:FileSize',
      'Composite:ImageSize',
      'AVAIL:Album',
    ],
    audio: ['Composite:AvgBitrate', 'MPEG:AudioBitrate', 'QuickTime:Duration', 'File:FileSize'],
  },
  content: {
    data: {
      default: ['keywords', 'date_created', 'center'],
    },
  },
  collection: {
    pattern: 'metadata.json',
  },
};

window.renderApp = function () {
  document.getElementById('app-root').innerHTML = `
        ${App()}
    `;
};

const responseData = {
  audio: {
    content: audioContent,
    collection: audioCollection,
    metadata: audioMetadata,
  },
  image: {
    content: imageContent,
    collection: imageCollection,
    metadata: imageMetadata,
  },
  video: {
    content: videoContent,
    collection: videoCollection,
    metadata: videoMetadata,
  },
};

window.data = {
  requestMade: false,
  searchValue: null,
  mediaTypes: null,
  responseData: responseData,
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
    <form onsubmit="window.searchByTerm(event); window.renderApp()" id="searchForm"
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

window.searchByTerm = e => {
  e.preventDefault();
  requestMedia(e);
  const flattenedData = getResponseData();
};

function getResponseData() {
  return window.data.mediaTypes.map(mediaType => window.data.responseData[mediaType]);
}

function flattenResponseData(responseData) {}

function requestMedia() {
  window.data.requestMade = true;
  const searchInputValue = document.getElementById('searchInput').value,
    mediaTypes = getMediaTypes(),
    requestURL = createRequestURL(searchInputValue, mediaTypes);
  window.data.mediaTypes = setSelectedMediaTypes(mediaTypes);
  window.data.searchValue = searchInputValue;
  // console.log(requestURL);
  return 'Data requested';
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
