import {createElement} from '../render.js';
import {textMessage} from '../consts.js';

const createNoFilmTemplate = (filter) => {
  const text = textMessage[filter.name.toUpperCase()];

  return `<h2 class="films-list__title visually-hidden">${text}</h2>`;
};

export default class NoFilmView {
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
    return createNoFilmTemplate(this.#filter);
  }

  removeElement() {
    this.#element = null;
  }
}
