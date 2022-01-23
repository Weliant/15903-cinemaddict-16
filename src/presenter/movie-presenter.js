import {render, RenderPosition, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card-view.js';
import {UserAction, UpdateType} from '../consts.js';

export default class MoviePresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;
  #openPopupClickHandler = null;

  #bodyElement = document.querySelector('body');

  constructor(filmListContainer, changeData, openPopup) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#openPopupClickHandler = openPopup;
  }

  init = (film, isUpdate = false, container = '') => {
    this.#film = film;

    if (isUpdate) {
      const selectorCard = `.film-card[data-id="${this.#film.id}"]`;
      const filmCard = container.element.querySelector(selectorCard);

      if (filmCard?.dataset?.id === this.#film.id) {

        this.#createNewFilmComponent();

        const el = filmCard;
        replace(this.#filmComponent, el);
      }
    } else {
      this.#createNewFilmComponent();
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
    }
  }

  #createNewFilmComponent = () => {
    this.#filmComponent = new FilmCardView(this.#film);

    this.#filmComponent.setOpenClickHandler(() => this.#openPopupClickHandler(this.#film));
    this.#filmComponent.setWatchListClickHandler(this.#watchListeClickHandler);
    this.#filmComponent.setWatchedClickHandler(this.#watchedClickHandler);
    this.#filmComponent.setFavoiteClickHandler(this.#favoriteClickHandler);
  }

  #watchListeClickHandler = () => {
    this.#changeData(
      UserAction.ADD_WATCHLIST,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
    );
  }

  #watchedClickHandler = () => {
    this.#changeData(
      UserAction.ADD_HISTORY,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
    );
  }

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.ADD_FAVORITES,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
    );
  }

  destroy = () => {
    remove(this.#filmComponent);
  }
}
