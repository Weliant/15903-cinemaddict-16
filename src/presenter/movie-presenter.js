import {render, RenderPosition, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card-view.js';
import {isEscPressed} from '../utils/common.js';
import FilmDetailsPopupView from '../view/film-details-popup-view.js';
import CloseButtonView from '../view/close-button-view.js';
import FilmDetailsPosterView from '../view/film-details-poster-view.js';
import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsCommentView from '../view/film-details-comment-view.js';
import FilmDetailsCommentNewView from '../view/film-details-comments-new-view.js';

export default class MoviePresenter {
  #filmListContainer = null;
  #filmComponent = null;
  #film = null;
  #changeData = null;

  #bodyElement = document.querySelector('body');
  #filmDetailsPopupContainerComponent = null;
  #filmDetailsPopupComponent = null;
  #closeButtonComponent = null;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (film, isUpdate = false, container = '') => {
    this.#film = film;

    this.#filmDetailsPopupContainerComponent = this.#bodyElement.querySelector('.film-details');

    const selectorPopup = `.film-details__inner[data-id="${this.#film.id}"]`;
    const filmsPopup = this.#filmDetailsPopupContainerComponent.querySelector(selectorPopup);

    if (isUpdate) {
      const selectorCard = `.film-card[data-id="${this.#film.id}"]`;
      const filmCard = container.element.querySelector(selectorCard);

      if (filmCard.dataset.id === this.#film.id) {

        this.#createNewFilmComponent();

        const el = filmCard;
        replace(this.#filmComponent, el);
      }
    } else {
      this.#createNewFilmComponent();
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
    }

    if (filmsPopup?.dataset.id === this.#film.id) {
      this.#openPopupClickHandler();
    }
  }

  #createNewFilmComponent = () => {
    this.#filmComponent = new FilmCardView(this.#film);

    this.#filmComponent.setOpenClickHandler(this.#openPopupClickHandler);
    this.#filmComponent.setWatchListClickHandler(this.#watchListeClickHandler);
    this.#filmComponent.setWatchedClickHandler(this.#warchedClickHandler);
    this.#filmComponent.setFavoiteClickHandler(this.#favoriteClickHandler);
  }

  #removePopup = () => {
    const popupComponent = this.#filmDetailsPopupContainerComponent.querySelector('.film-details__inner');
    if (popupComponent){
      this.#filmDetailsPopupContainerComponent.removeChild(popupComponent);
    }

    if (this.#bodyElement.classList.contains('hide-overflow')) {
      this.#bodyElement.classList.remove('hide-overflow');
    }
  };

  #onEscKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.#removePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #watchListeClickHandler = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}});
  }

  #warchedClickHandler = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}});
  }

  #favoriteClickHandler = () => {
    this.#changeData({...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}});
  }

  #openPopupClickHandler = () => {
    this.#removePopup();

    this.#filmDetailsPopupComponent = new FilmDetailsPopupView(this.#film);
    this.#closeButtonComponent = new CloseButtonView();
    this.#filmDetailsPopupContainerComponent.appendChild(this.#filmDetailsPopupComponent.element);

    const siteFilmDetailsElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__info-wrap');
    const siteFilmDetailsCommentsWrapElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    const buttonCloseElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__close');

    siteFilmDetailsElement.appendChild(new FilmDetailsPosterView(this.#film).element);
    siteFilmDetailsElement.appendChild(new FilmDetailsInfoView(this.#film).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentView(this.#film.comments).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentNewView().element);
    buttonCloseElement.appendChild(this.#closeButtonComponent.element);

    if (this.#filmDetailsPopupComponent) {
      this.#bodyElement.classList.add('hide-overflow');
    }

    this.#filmDetailsPopupComponent.setWatchListClickHandler(this.#watchListeClickHandler);
    this.#filmDetailsPopupComponent.setWatchedClickHandler(this.#warchedClickHandler);
    this.#filmDetailsPopupComponent.setFavoiteClickHandler(this.#favoriteClickHandler);

    document.addEventListener('keydown', this.#onEscKeyDown);

    this.#closeButtonComponent.setCloseClickHandler(() => {
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#removePopup();
    });
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsPopupComponent);
  }
}
