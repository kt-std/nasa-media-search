import styles from './style.css';
import { FILTERS_TEXT } from '../../data/dataSettings';
import FilterItem from './FilterItem';

export default function FilterBlock(filtersContainer, filterName) {
  return `<h3 class="${styles.filter__heading}">${FILTERS_TEXT[filterName]}</h3>
            <div class="${styles.filter__item_wrapper}">
              ${Object.keys(filtersContainer[filterName])
                .map(filterContent => {
                  return FilterItem(
                    filterContent,
                    filtersContainer[filterName][filterContent],
                    filterName,
                  );
                })
                .join('')}
            </div>`;
}
