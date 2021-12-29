import AbstractView from './abstract-view.js';

const createFilmDetailsPopupTemplate = (film) => {
  const {id, userDetails} = film;

  const wacthListClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  return  `<form class="film-details__inner" action="" method="get" data-id="${id}">
              <div class="film-details__top-container">
                <div class="film-details__close">
                </div>
                <div class="film-details__info-wrap"></div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${wacthListClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>
                  <div class="film-details__new-comment">
                  </div>
                </section>
              </div>
            </form>
          `;
};


export default class FilmDetailsPopupView extends AbstractView {
  #film = null;

  constructor(film){
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsPopupTemplate(this.#film);
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-details__controls .film-details__control-button--watchlist').addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__controls .film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoiteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__controls .film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
