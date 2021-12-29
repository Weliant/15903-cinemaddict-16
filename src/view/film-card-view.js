import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {getTimesFormatted} from '../utils/film.js';
import {MAX_LENGTH} from '../consts.js';

const createFilmCardTemplate = (film) => {
  const {id, filmInfo, comments, userDetails} = film;

  const year = dayjs(filmInfo.release.date).format('YYYY');
  let cutDescription = '';

  if (filmInfo.description.length > 140) {
    cutDescription = `${filmInfo.description.slice(0, MAX_LENGTH)}...`;
  } else {
    cutDescription = filmInfo.description;
  }

  const wacthListClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card" data-id="${id}">
            <a class="film-card__link">
              <h3 class="film-card__title">${filmInfo.title}</h3>
              <p class="film-card__rating">${filmInfo.totalRating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${year}</span>
                <span class="film-card__duration">${getTimesFormatted(filmInfo.runtime)}</span>
                <span class="film-card__genre">${filmInfo.genre.join(', ')}</span>
              </p>
              <img src="${filmInfo.poster}" alt="" class="film-card__poster">
              <p class="film-card__description">${cutDescription}</p>
              <span class="film-card__comments">${comments.length} comments</span>
            </a>
            <div class="film-card__controls">
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${wacthListClassName}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
            </div>
          </article>
        `;
};

export default class FilmCardView extends AbstractView {
  #film = null;

  constructor(film){
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  setOpenClickHandler = (callback) => {
    this._callback.openClick = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#openClickHandler);
  }

  setWatchListClickHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.element.querySelector('.film-card__controls .film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls .film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoiteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls .film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openClick();
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
