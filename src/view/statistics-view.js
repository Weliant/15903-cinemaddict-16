import SmartView  from './smart-view';
import {renderFilmsChart, getfilmsOfPeriod} from '../utils/statistics';
import {getHours, getRemainingMinutes, getTopGenre, getRatingGenres} from '../utils/film';

const createUserRankTemplate = (user) => {
  const {rank, avatar} = user;

  return `<p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${rank}</span>
        </p>`;
};

export const createStatisticInfoTemplate = (data, user) => {
  const {rank} = user;
  const {period} = data;
  const watchedFilms = data.films.filter((film) => film.userDetails.alreadyWatched);
  const totalMinutes = watchedFilms.reduce((sum, item) => sum + item.filmInfo.runtime, 0);

  return `<section class="statistic">
            ${rank ? createUserRankTemplate(user) : ''}

            <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
              <p class="statistic__filters-description">Show stats:</p>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${period === 'all-time' ? 'checked' : ''}>
              <label for="statistic-all-time" class="statistic__filters-label">All time</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${period === 'today' ? 'checked' : ''}>
              <label for="statistic-today" class="statistic__filters-label">Today</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${period === 'week' ? 'checked' : ''}>
              <label for="statistic-week" class="statistic__filters-label">Week</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${period === 'month' ? 'checked' : ''}>
              <label for="statistic-month" class="statistic__filters-label">Month</label>

              <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${period === 'year' ? 'checked' : ''}>
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
                <p class="statistic__item-text">${watchedFilms.length ? getTopGenre(watchedFilms) : ''}</p>
              </li>
            </ul>

            <div class="statistic__chart-wrap">
              <canvas class="statistic__chart" width="1000"></canvas>
            </div>

          </section>
          `;
};

export default class StatisticsView extends SmartView {
  #filmsChart = null;

  constructor(films, user){
    super();
    this._data.period = 'all-time';
    this._data.films = [...films];
    this._films = films;
    this._user = user;

    this.#setInnerHandlers();
    this.#setCharts();
  }

  get template() {
    return createStatisticInfoTemplate(this._data, this._user);
  }

  #setCharts = () => {
    const statisticCtx = this.element.querySelector('.statistic__chart');
    const filmsOfPeriod = this._data.period !== 'all-time' ? getfilmsOfPeriod(this._films, this._data.period) : this._films;
    const ratingGenre = getRatingGenres(filmsOfPeriod);
    const genres = Object.keys(ratingGenre);
    const genresValue = Object.values(ratingGenre);

    this.#filmsChart = renderFilmsChart(statisticCtx, genres, genresValue);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setCharts();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.statistic__filters')
      .addEventListener('change', this.#timePeriodChangeHandler);
  }

  #timePeriodChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('statistic__filters-input')){
      this.updateData({
        films: evt.target.value !== 'all-time' ? getfilmsOfPeriod(this._films, evt.target.value) : this._films,
        period: evt.target.value
      });
    }
  }

  removeElement = () => {
    super.removeElement();

    if (this.#filmsChart) {
      this.#filmsChart.destroy();
      this.#filmsChart = null;
    }
  }
}
