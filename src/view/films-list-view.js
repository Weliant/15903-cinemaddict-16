import {createElement} from '../render.js';
import {textMessage} from '../consts.js';

const createFilmsListTemplate = (filter) => {
  const text = textMessage[filter.name.toUpperCase()];

  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">${text}</h2>
          </section>`;
};

export default class FilmsListView {
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
    return createFilmsListTemplate(this.#filter);
  }

  removeElement() {
    this.#element = null;
  }
}
