import {createElement} from '../render.js';

const createFilmsContentTemplate = () => '<section class="films"></section>';

export default class FilmsContentView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsContentTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
