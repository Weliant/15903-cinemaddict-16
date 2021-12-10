import dayjs from 'dayjs';
import {getTimesFormatted} from '../utils.js';
import {createElement} from '../render.js';
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

export default class FilmCardView {
  #element = null;
  #film = null;

  constructor(film){
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
