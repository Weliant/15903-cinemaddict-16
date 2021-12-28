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

import {Films} from '../consts.js';
import MoviePresenter from './movie-presenter.js';

export default class MovieListPresenter {
  #filmsContainer = null;

  #filmsContentComponent = new FilmsContentView();
  #topRateComponent = new TopRateView();
  #mostCommentedComponent = new MostCommentedView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #filmsListComponent = null;
  #noFilmComponent = null;

  #films = [];
  #filters = [];

  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListContainerTopComponent = new FilmsListContainerView();
  #filmsListContainerMostComponent = new FilmsListContainerView();
  #filmPresenter = new Map();

  #bodyElement = document.querySelector('body');
  #filmDetailsPopupContainerComponent = new FilmDetailsPopupContainerView();

  #renderedFilmCount = Films.COUNT_PER_STEP;

  constructor(filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (films, filters) => {
    this.#films = [...films];
    this.#filters = [...filters];

    this.#filmsListComponent = new FilmsListView(this.#filters[0]);
    this.#noFilmComponent = this.#filmsListComponent.element.querySelector('.films-list__title');

    this.#renderFilmsPage();
  }

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm, 'update');
  }

  #renderFilter = () => {
    render(this.#filmsContainer, new FilterView(this.#filters), RenderPosition.BEFOREEND);
  }

  #renderSort = () => {
    render(this.#filmsContainer, new SortMenuView(), RenderPosition.BEFOREEND);
  }

  #renderFilm = (container, film) => {
    const filmPresenter = new MoviePresenter(container, this.#handleFilmChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
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
    remove(this.#showMoreButtonComponent);
  }

  #renderFilmsContainer = (from, to) => {
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(from, to);
  }

  #renderFilmsTop = (from, to) => {
    render(this.#topRateComponent, this.#filmsListContainerTopComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#topRateComponent, RenderPosition.BEFOREEND);

    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmsListContainerTopComponent, film));
  }

  #renderFilmsMostCommented = (from, to) => {
    render(this.#mostCommentedComponent, this.#filmsListContainerMostComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmsListContainerMostComponent, film));
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
    this.#renderFilmsTop(0, Films.COUNT_RATED);
  }

  #renderFilmsListMostCommented = () => {
    this.#renderFilmsMostCommented(0, Films.COUNT_RATED);
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
