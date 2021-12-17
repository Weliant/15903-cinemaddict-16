import dayjs from 'dayjs';
import AbstractView from './abstract-view.js';
import {getTimesFormatted} from '../utils/film.js';
import {MAX_LENGTH} from '../consts.js';

const createFilmCardTemplate = (film) => {
  const {filmInfo, comments} = film;

  const year = dayjs(filmInfo.release.date).format('YYYY');
  let cutDescription = '';

  if (filmInfo.description.length > 140) {
    cutDescription = `${filmInfo.description.slice(0, MAX_LENGTH)}...`;
  } else {
    cutDescription = filmInfo.description;
  }

  return `<article class="film-card">
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
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
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

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openClick();
  }
}
