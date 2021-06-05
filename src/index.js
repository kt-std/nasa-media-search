import { dataStore } from './data/dataStore.js';
import styles from './style.css';
import { render } from './framework';
import App from './components/App';

//todo add pagination
render(App, document.getElementById('app-root'));
