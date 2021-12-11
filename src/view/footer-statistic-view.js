import {createElement} from '../render.js';

const createFooterStatisticTemplate = (count) => (
  `<p>
    ${count} movies inside
  </p>`
);

export default class FooterStatisticView {
  #element = null;
  #count = null;

  constructor(count){
    this.#count = count;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticTemplate(this.#count);
  }

  removeElement() {
    this.#element = null;
  }
}
