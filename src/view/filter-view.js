import {toCapitalizeLetter} from '../utils/film.js';
import AbstractView from './abstract-view.js';

const getCountItemTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, isFirst) => {
  const {name, count} = filter;

  return  `<a href="#${name}" class="main-navigation__item ${isFirst ? 'main-navigation__item--active' : ''}">
            ${toCapitalizeLetter(name)} ${isFirst ? 'movies' : ''} ${!isFirst ? getCountItemTemplate(count) : ''}
          </a>
          `;
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              ${filterItemsTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class FilterView extends AbstractView {
  #filter = null;

  constructor(filter){
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilterTemplate(this.#filter);
  }
}
