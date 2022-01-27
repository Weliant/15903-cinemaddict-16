import AbstractView from './abstract-view';

const createFilmDetailsPopupContainerTemplate = () => '<section class="film-details"></section>';

export default class FilmDetailsPopupContainerView extends AbstractView {
  get template() {
    return createFilmDetailsPopupContainerTemplate();
  }
}
