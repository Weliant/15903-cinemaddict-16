import {createElement} from '../render.js';

export const createTopTemplate = () => (
  ` <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>
  `
);

export default class TopRateView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTopTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
