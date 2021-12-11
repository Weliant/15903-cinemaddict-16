import {createElement} from '../render.js';

const createMostCommentedTemplate = () => (
  ` <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>
  `
);

export default class MostCommentedView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMostCommentedTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
