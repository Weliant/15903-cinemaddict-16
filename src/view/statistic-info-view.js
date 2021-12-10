import {getHours, getRemainingMinutes, getTopGenre} from '../utils.js';
import {createElement} from '../render.js';

const createUserRankTemplate = (user) => {
  const {rank, avatar} = user;

  return `<p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${rank}</span>
        </p>`;
};

export const createStatisticInfoTemplate = (films, user) => {
  const {rank} = user;
  const watchedFilms = films.filter((film) => film.isWatched);
  const totalMinutes = watchedFilms.reduce((sum, item) => sum + item.duration, 0);

  return `<section class="statistic">
            ${rank ? createUserRankTemplate(user) : ''}

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
              <label for="statistic-year" class="statistic__filters-label">Year</label>
            </form>

            <ul class="statistic__text-list">
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">You watched</h4>
                <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Total duration</h4>
                <p class="statistic__item-text">${getHours(totalMinutes)} <span class="statistic__item-description">h</span> ${getRemainingMinutes(totalMinutes)} <span class="statistic__item-description">m</span></p>
              </li>
              <li class="statistic__text-item">
                <h4 class="statistic__item-title">Top genre</h4>
                <p class="statistic__item-text">${getTopGenre(films)}</p>
              </li>
            </ul>

            <!-- Пример диаграммы -->
            <img src="images/cinemaddict-stats-markup.png" alt="Пример диаграммы">

            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>

          </section>
          `;
};

export default class StatisticInfoView {
  #element = null;
  #films = null;
  #user = null;

  constructor(films, user){
    this.#films = films;
    this.#user = user;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatisticInfoTemplate(this.#films, this.#user);
  }

  removeElement() {
    this.#element = null;
  }
}
