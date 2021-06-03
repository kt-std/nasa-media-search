import { dataStore } from './data/dataStore.js';
import styles from './style.css';
import renderApp from './framework/renderer';
import App from './components/App';
import {
  updateMediaTypes,
  selectFilter,
  sortMedia,
  filterItems,
  removeFilter,
  searchByTerm,
  openHomePage,
} from './data/mediaData';
//todo add pagination
window.data = dataStore;

window.renderApp = renderApp;
window.openHomePage = openHomePage;
window.searchByTerm = searchByTerm;
window.updateMediaTypes = updateMediaTypes;
window.selectFilter = selectFilter;
window.sortMedia = sortMedia;
window.filterItems = filterItems;
window.removeFilter = removeFilter;

window.renderApp(App, document.getElementById('app-root'));
