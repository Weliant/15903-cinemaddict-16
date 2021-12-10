import {toCapitalizeLetter} from '../utils.js';
import {createElement} from '../render.js';

const getCountItemTemplate = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createFilterItemTemplate = (filter, isFirst) => {
  const {name, count} = filter;

  return  `<a href="#${name}" class="main-navigation__item">
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

export default class FilterView {
  #element = null;
  #filter = null;

  constructor(filter){
    this.#filter = filter;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilterTemplate(this.#filter);
  }

  removeElement() {
    this.#element = null;
  }
}
