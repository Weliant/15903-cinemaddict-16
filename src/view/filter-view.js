import {toCapitalizeLetter} from '../utils/film.js';
import AbstractView from './abstract-view.js';

const getCountItemTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return  `<a href="#${name}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}" data-filter="${type}">
            ${toCapitalizeLetter(name)} ${type === 'all' ? 'movies' : ''} ${type !== 'all' ? getCountItemTemplate(count) : ''}
          </a>
          `;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
            ${filterItemsTemplate}
          </div>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('main-navigation__item')) {
      this._callback.filterTypeChange(evt.target.dataset.filter);
    }
  }

  clear = () => {
    const navigationItemElement = this.element.querySelector('.main-navigation__item--active');

    if (navigationItemElement) {
      navigationItemElement.classList.remove('main-navigation__item--active');
    }
  }
}
