import AbstractView from './abstract-view.js';
import {SortType} from '../consts.js';

const createSortMenuTemplate = (type) => {
  const defaultClassName = type === SortType.DEFAULT
    ? 'sort__button--active'
    : '';

  const dateClassName = type === SortType.DATE
    ? 'sort__button--active'
    : '';

  const ratingClassName = type === SortType.RATING
    ? 'sort__button--active'
    : '';

  return ` <ul class="sort">
      <li><a href="#" class="sort__button ${defaultClassName}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${dateClassName}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${ratingClassName}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>
  `;
};

export default class SortMenuView extends AbstractView {
  #type = SortType.DEFAULT;

  constructor(type){
    super();
    this.#type = type;
  }

  get template() {
    return createSortMenuTemplate(this.#type);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.classList.contains('sort__button')) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
