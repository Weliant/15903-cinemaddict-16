import AbstractView from './abstract-view';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.showClick = callback;
    this.element.addEventListener('click', this.#buttonShowClickHandler);
  }

  #buttonShowClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showClick();
  }
}
