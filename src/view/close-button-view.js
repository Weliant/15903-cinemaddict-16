import AbstractView from './abstract-view.js';

const createCloseButtonTemplate = () => '<button class="film-details__close-btn" type="button">close</button>';

export default class CloseButtonView extends AbstractView {
  get template() {
    return createCloseButtonTemplate();
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.addEventListener('click', this.#buttonCloseClickHandler);
  }

  #buttonCloseClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
    evt.target.removeEventListener('click', this.#buttonCloseClickHandler);
  }
}
