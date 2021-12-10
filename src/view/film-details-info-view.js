import dayjs from 'dayjs';
import {getTimesFormatted} from '../utils.js';
import {createElement} from '../render.js';

const genreItem = (item) => `<span class="film-details__genre">${item}</span>`;

const createGenreItemTemplate = (genres) => {
  const genreItemsTemplate = genres
    .map((filter, index) => genreItem(filter, index === 0))
    .join('');

  return `<td class="film-details__cell">
            ${genreItemsTemplate}
          </td>`;
};

const createFilmDetailsInfoTemplate = (film) => {
  const {filmInfo} = film;
  const dateRelease = dayjs(filmInfo.release.date).format('D MMMM YYYY');

  return `
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmInfo.title}</h3>
              <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${filmInfo.totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimesFormatted(filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              ${createGenreItemTemplate(filmInfo.genre)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmInfo.description}
          </p>
        </div>
        `;
};

export default class FilmDetailsInfoView {
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
    return createFilmDetailsInfoTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
