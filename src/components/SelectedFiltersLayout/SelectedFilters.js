import styles from './style.css';
import SelectedFilter from './SelectedFilter';

export default function SelectedFilters(storage) {
  return `${storage.selectedFiltersList.map(filter => SelectedFilter(filter)).join('')}`;
}
