import styles from './style.css';
import { SORTING_OPTIONS_TEXT } from '../../data/dataSettings';

export default function Option(storage, option, sortType) {
  return `<option 
              value="${option}_${sortType}" 
              class="${styles.option}"
              ${
                storage.sortingSet && storage.sortingOption === `${option}_${sortType}`
                  ? `selected="selected"`
                  : ''
              }"
              >
                ${SORTING_OPTIONS_TEXT[option]}  
                ${sortType === 'ascending' ? '&#8593;' : '&#8595;'}
            </option>`;
}
