import SmartView from './smart-view';
import {getTimesFormatted, getReleaseDate} from '../utils/film';

const genreItem = (item) => `<span class="film-details__genre">${item}</span>`;

const createGenreItemTemplate = (genres) => {
  const genreItemsTemplate = genres.length > 1 ? genres
    .map((filter, index) => genreItem(filter, index === 0))
    .join('') : genres[0];

  return `<td class="film-details__cell">
            ${genreItemsTemplate}
          </td>`;
};

const createFilmDetailsInfoTemplate = (film) => {
  const {filmInfo, listWriters, listActors, isMultiGenre} = film;

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
              <td class="film-details__cell">${listWriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${listActors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${getReleaseDate(filmInfo.release.date)}</td>
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
              <td class="film-details__term">${isMultiGenre ? 'Genres' : 'Genre'} </td>
              ${createGenreItemTemplate(filmInfo.genre)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${filmInfo.description}
          </p>
        </div>
        `;
};

export default class FilmDetailsInfoView extends SmartView {
  constructor(film){
    super();
    this._data = FilmDetailsInfoView.parseTaskToData(film);
  }

  get template() {
    return createFilmDetailsInfoTemplate(this._data);
  }

  static parseTaskToData = (film) => ({...film,
    isMultiGenre: film.filmInfo.genre.length > 1,
    listWriters: film.filmInfo.writers.join(', '),
    listActors: film.filmInfo.actors.join(', '),
  });
}
