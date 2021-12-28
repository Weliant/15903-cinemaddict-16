import AbstractView from './abstract-view.js';

const createFilmDetailsPopupContainerTemplate = () => '<section class="film-details"></section>';

export default class FilmDetailsPopupContainerView extends AbstractView {

  constructor(){
    super();
  }

  get template() {
    return createFilmDetailsPopupContainerTemplate();
  }
}
