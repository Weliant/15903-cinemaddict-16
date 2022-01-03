import FilterView from '../view/filter-view.js';
import SortMenuView from '../view/sort-menu-view.js';
import FilmsContentView from '../view/films-content-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-container-view.js';
import TopRateView from '../view/top-rate-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsPopupContainerView from '../view/film-details-popup-container-view.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from '../utils/common.js';
import {sortFilmDate, sortFilmRating, generateDataArray, sortFilmMostCommented} from '../utils/film.js';
import {replace} from '../utils/render.js';

import {Films, SortType} from '../consts.js';
import MoviePresenter from './movie-presenter.js';

export default class MovieListPresenter {
  #filmsContainer = null;

  #filmsContentComponent = new FilmsContentView();
  #topRateComponent = new TopRateView();
  #mostCommentedComponent = new MostCommentedView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsListComponent = null;
  #noFilmComponent = null;
  #sortMenuComponent = null;

  #films = [];
  #filters = [];
  #currentSortType = SortType.DEFAULT;
  #sourcedFilms = [];

  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListContainerTopComponent = new FilmsListContainerView();
  #filmsListContainerMostComponent = new FilmsListContainerView();
  #filmPresenter = new Map();
  #filmPresenterTop = new Map();
  #filmPresenterMostCommented = new Map();

  #bodyElement = document.querySelector('body');
  #filmDetailsPopupContainerComponent = new FilmDetailsPopupContainerView();

  #renderedFilmCount = Films.COUNT_PER_STEP;

  constructor(filmsContainer, films, filters) {
    this.#filmsContainer = filmsContainer;

    this.#films = [...films];
    this.#filters = [...filters];
    this.#sourcedFilms = [...films];

    this.init();
  }

  init = () => {
    this.#filmsListComponent = new FilmsListView(this.#filters[0]);
    this.#noFilmComponent = this.#filmsListComponent.element.querySelector('.films-list__title');

    this.#renderFilmsPage();
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);

    this.#filmPresenter.get(updatedFilm.id)?.init(updatedFilm, true, this.#filmsListComponent);
    this.#filmPresenterTop.get(updatedFilm.id)?.init(updatedFilm, true, this.#topRateComponent);
    this.#filmPresenterMostCommented.get(updatedFilm.id)?.init(updatedFilm, true, this.#mostCommentedComponent);
  }

  #renderFilter = () => {
    render(this.#filmsContainer, new FilterView(this.#filters), RenderPosition.BEFOREEND);
  }

  #sortTasks = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _films
    switch (sortType) {
      case SortType.DATE:
        this.#films.sort(sortFilmDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortFilmRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _films исходный массив
        this.#films = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем фильмы
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortTasks(sortType);
    const sortComponent = this.#bodyElement.querySelector('.sort');
    this.#createSortComponent();
    replace(this.#sortMenuComponent, sortComponent);

    // - Очищаем список
    // - Рендерим список заново
    this.#clearFilmList();
    this.#renderFilmsList();
  }

  #createSortComponent = () => {
    this.#sortMenuComponent = new SortMenuView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderSort = () => {
    this.#createSortComponent();
    render(this.#filmsContainer, this.#sortMenuComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (container, film, type = '') => {
    const filmPresenter = new MoviePresenter(container, this.#handleFilmChange);
    filmPresenter.init(film);

    if (type === 'top') {
      this.#filmPresenterTop.set(film.id, filmPresenter);
    } else if (type === 'commented') {
      this.#filmPresenterMostCommented.set(film.id, filmPresenter);
    } else {
      this.#filmPresenter.set(film.id, filmPresenter);
    }
  }

  #renderFilms = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmsListContainerComponent, film));
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = Films.COUNT_PER_STEP;
    this.#bodyElement.classList.remove('hide-overflow');
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmsContainer = (from, to) => {
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(from, to);
  }

  #renderFilmsTop = (from, to) => {
    render(this.#topRateComponent, this.#filmsListContainerTopComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#topRateComponent, RenderPosition.BEFOREEND);

    let filmsOfHigherRating = this.#films.sort(sortFilmRating);

    if (filmsOfHigherRating.length && filmsOfHigherRating.length > 2) {
      let mark = 0;
      const isHigherRating = filmsOfHigherRating.some((item, indx) => {
        if (indx) {
          return +item.filmInfo.totalRating !== mark;
        }

        mark = +item.filmInfo.totalRating;
      });

      if (!isHigherRating) {
        filmsOfHigherRating =  generateDataArray(1, filmsOfHigherRating);
      }
    }

    filmsOfHigherRating
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmsListContainerTopComponent, film, 'top'));
  }

  #renderFilmsMostCommented = (from, to) => {
    render(this.#mostCommentedComponent, this.#filmsListContainerMostComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    let filmsOfMostCommented = this.#films.sort(sortFilmMostCommented);

    if (filmsOfMostCommented.length && filmsOfMostCommented.length > 2) {
      let mark = 0;
      const isMostCommented = filmsOfMostCommented.some((item, indx) => {
        if (indx) {
          return item.comments.length !== mark;
        }

        mark = item.comments.length;
      });

      if (!isMostCommented) {
        filmsOfMostCommented =  generateDataArray(1, filmsOfMostCommented);
      }
    }

    filmsOfMostCommented
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmsListContainerMostComponent, film, 'commented'));
  }

  #renderNoFilms = () => {
    this.#noFilmComponent.classList[!this.#films.length ? 'remove' : 'add']('visually-hidden');
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + Films.COUNT_PER_STEP);
    this.#renderedFilmCount += Films.COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmsListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderFilmsList = () => {
    render(this.#filmsContentComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);

    if (!this.#films.length) {
      return false;
    }

    this.#renderFilmsContainer(0, Math.min(this.#films.length, Films.COUNT_PER_STEP));

    if (this.#films.length > Films.COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsListTop = () => {
    const filterRatingList = this.#films.filter((item) => item.filmInfo.totalRating > 0);

    if (filterRatingList.length) {
      this.#renderFilmsTop(0, Films.COUNT_RATED);
    }
  }

  #renderFilmsListMostCommented = () => {
    const filterMostCommentedList = this.#films.filter((item) => item.comments.length > 0);

    if (filterMostCommentedList.length) {
      this.#renderFilmsMostCommented(0, Films.COUNT_RATED);
    }
  }

  #renderPopup = () => {
    this.#bodyElement.appendChild(this.#filmDetailsPopupContainerComponent.element);
  }

  #renderFilmsPage = () => {
    this.#renderFilter();

    if (!this.#films.length) {
      render(this.#filmsContainer, this.#filmsContentComponent, RenderPosition.BEFOREEND);

      this.#renderFilmsList();
      this.#renderNoFilms();
      return false;
    }

    this.#renderSort();
    this.#renderPopup();

    render(this.#filmsContainer, this.#filmsContentComponent, RenderPosition.BEFOREEND);

    this.#renderFilmsList();
    this.#renderFilmsListTop();
    this.#renderFilmsListMostCommented();
  }
}
