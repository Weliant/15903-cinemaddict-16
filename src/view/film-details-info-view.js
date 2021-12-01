import {getTimesFormatted} from '../utils.js';

const genreItem = (item) => `<span class="film-details__genre">${item}</span>`;

const createGenreItemTemplate = (genres) => {
  const genreItemsTemplate = genres
    .map((filter, index) => genreItem(filter, index === 0))
    .join('');

  return `<td class="film-details__cell">
            ${genreItemsTemplate}
          </td>`;
};

export const createFilmDetailsInfoTemplate = (film) => {
  const {name, originName, rating, date, duration, genres, poster, description, ageRating, director, writers, actors, country} = film;

  return `<div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${name}</h3>
              <p class="film-details__title-original">Original: ${originName}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${date}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${getTimesFormatted(duration)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              ${createGenreItemTemplate(genres)}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
        `;
};
