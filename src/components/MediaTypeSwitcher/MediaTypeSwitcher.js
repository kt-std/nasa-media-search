import styles from './style.css';

export default function MediaTypeSwitcher(storage) {
  return `
  <label for="mediaSwitcherButton" class="${styles.label} ${styles.overflow}">
  ${storage.mediaTypes.length ? storage.mediaTypes.join(', ') : 'Media type'}
  </label>
  <input type="checkbox" class="${styles.button}" id="mediaSwitcherButton">
  <div class="${styles.wrapper}">
    ${['image', 'audio', 'video']
      .map(mediaType => {
        return `
          <div>
            <input type="checkbox" 
                         class="${styles.mediaType}"
                         name="mediaType" 
                         onchange="updateMediaTypes(window.data, this);window.renderApp()"
                         id="${mediaType}" 
                         value="${mediaType}"
                         ${
                           storage.mediaTypes.length && storage.mediaTypes.indexOf(mediaType) !== -1
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
