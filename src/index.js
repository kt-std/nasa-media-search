import { dataStore } from './data/dataStore.js';
import styles from './style.css';
import renderApp from './framework/renderer';
import App from './components/App';

//todo add pagination
window.data = dataStore;

renderApp(App, document.getElementById('app-root'));
