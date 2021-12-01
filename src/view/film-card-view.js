import dayjs from 'dayjs';
import {getTimesFormatted} from '../utils.js';

const MAX_LENGTH = 140;

export const createFilmCardTemplate = (film) => {
  const {name, rating, date, duration, genres, poster, description, comments} = film;

  const year = dayjs(date).format('YYYY');
  let cutDescription = '';

  if (description.length > 140) {
    cutDescription = `${description.slice(0, MAX_LENGTH)}...`;
  } else {
    cutDescription = description;
  }

  return `<article class="film-card">
            <a class="film-card__link">
              <h3 class="film-card__title">${name}</h3>
              <p class="film-card__rating">${rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${year}</span>
                <span class="film-card__duration">${getTimesFormatted(duration)}</span>
                <span class="film-card__genre">${genres.join(', ')}</span>
              </p>
              <img src="${poster}" alt="" class="film-card__poster">
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
