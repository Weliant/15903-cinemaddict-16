import SortMenuView from '../view/sort-menu-view.js';
import FilmsContentView from '../view/films-content-view.js';
import FilmsListView from '../view/films-list-view.js';
import NoFilmView from '../view/no-film-view.js';
import FilmsListContainerView from '../view/films-container-view.js';
import TopRateView from '../view/top-rate-view.js';
import MostCommentedView from '../view/most-commented-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import FilmDetailsPopupContainerView from '../view/film-details-popup-container-view.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {isEscPressed} from '../utils/common.js';
import {sortFilmDate, sortFilmRating, generateDataArray, sortFilmMostCommented} from '../utils/film.js';
import {filter} from '../utils/filter.js';
import {Films, SortType, BlockType, UpdateType, UserAction, FilterType} from '../consts.js';
import MoviePresenter from './movie-presenter.js';

export default class MovieListPresenter {
  #filmsContainer = null;

  #bodyElement = document.querySelector('body');
  #filmsContentComponent = new FilmsContentView();
  #topRateComponent = new TopRateView();
  #mostCommentedComponent = new MostCommentedView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #filmsListContainerTopComponent = new FilmsListContainerView();
  #filmsListContainerMostComponent = new FilmsListContainerView();
  #filmDetailsPopupContainerComponent = new FilmDetailsPopupContainerView();
  #showMoreButtonComponent = null;
  #filmsListComponent = null;
  #noFilmComponent = null;
  #sortMenuComponent = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #renderedFilmCount = Films.COUNT_PER_STEP;

  #filmsModel = null;
  #filterModel = null;

  #filmPresenter = new Map();
  #filmPresenterTop = new Map();
  #filmPresenterMostCommented = new Map();

  #filmOpenId = null;
  #commentsStore = null;
  #scrollPopup = 0;
  #isInit = false;

  constructor(filmsContainer, filmsModel, filterModel) {
    this.#filmsContainer = filmsContainer;

    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.init();
  }

  get films() {
    this.#filterType = this.#filterModel.filter;

    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#filmsListComponent = new FilmsListView();

    this.#renderFilmsPage();
  }

  #handleViewAction = (actionType, updateType, update, textComment = '', emotion = '') => {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.OPEN_FILM_CARD:
        this.#commentsStore = null;
        this.#filmOpenId = update.id;
        break;
      case UserAction.ADD_WATCHLIST:
        this.#commentsStore = {
          comment: textComment,
          emotion
        };
        if (actionType.slice(4).toLocaleLowerCase() === this.#filterType) {
          this.#filmsModel.updateFilm('MAJOR', update);
        } else {
          this.#filmsModel.updateFilm(updateType, update);
        }
        break;
      case UserAction.ADD_HISTORY:
        this.#commentsStore = {
          comment: textComment,
          emotion
        };
        if (actionType.slice(4).toLocaleLowerCase() === this.#filterType) {
          this.#filmsModel.updateFilm('MAJOR', update);
        } else {
          this.#filmsModel.updateFilm(updateType, update);
        }
        break;
      case UserAction.ADD_FAVORITES:
        this.#commentsStore = {
          comment: textComment,
          emotion
        };

        if (actionType.slice(4).toLocaleLowerCase() === this.#filterType) {
          this.#filmsModel.updateFilm('MAJOR', update);
        } else {
          this.#filmsModel.updateFilm(updateType, update);
        }
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.CLOSE:
        this.#filmPresenter.get(data.id)?.clearPopup();
        break;
      case UpdateType.MICRO:
        // - обновить часть фильма в карточке и блок "Most commented"
        this.#filmPresenter.get(data.id)?.updateInfo(data, this.#filmsListComponent);
        remove(this.#filmsListContainerMostComponent);
        remove(this.#mostCommentedComponent);
        this.#renderFilmsListMostCommented();
        break;
      case UpdateType.PATCH:
        // - обновить часть фильма (например, когда поменялось описание)
        this.#filmPresenter.get(data.id)?.init(data, true, this.#filmsListComponent, this.#commentsStore);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда фильм ушел в любимые)
        this.#clearFilmsPage({}, data.id);
        this.#renderFilmsPage();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearFilmsPage({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilmsPage();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    const sortComponent = this.#bodyElement.querySelector('.sort');
    this.#createSortComponent();
    replace(this.#sortMenuComponent, sortComponent);

    this.#clearFilmsPage({resetRenderedFilmCount: true});
    this.#renderFilmsPage();
  }

  #createSortComponent = () => {
    this.#sortMenuComponent = new SortMenuView(this.#currentSortType);
    this.#sortMenuComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderSort = () => {
    this.#createSortComponent();
    render(this.#filmsContainer, this.#sortMenuComponent, RenderPosition.BEFOREEND);
  }

  #addEventDocument = () => {
    document.addEventListener('keydown', this.#onKeyDown);
  }

  #removePopup = () => {
    const filmDetailsPopupContainerComponent = this.#bodyElement.querySelector('.film-details');
    const popupComponent = filmDetailsPopupContainerComponent.querySelector('.film-details__inner');
    if (popupComponent){
      filmDetailsPopupContainerComponent.removeChild(popupComponent);
    }

    if (this.#bodyElement.classList.contains('hide-overflow')) {
      this.#bodyElement.classList.remove('hide-overflow');
    }

    if (this.#filmOpenId) {
      const film = this.films.filter((item) => item.id === this.#filmOpenId);

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.CLOSE,
        {...film[0]},
      );
    }

    document.removeEventListener('keydown', this.#onKeyDown);
  };

  #onKeyDown = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.#removePopup();
    }
  };

  #renderFilm = (container, film, type = '') => {
    const filmPresenter = new MoviePresenter(container, this.#handleViewAction, this.#addEventDocument,this.#removePopup);
    filmPresenter.init(film);

    if (type === BlockType.TOP) {
      this.#filmPresenterTop.set(film.id, filmPresenter);
    } else if (type === BlockType.COMMENTED) {
      this.#filmPresenterMostCommented.set(film.id, filmPresenter);
    } else {
      this.#filmPresenter.set(film.id, filmPresenter);
    }
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmsListContainerComponent, film));
  }

  #renderFilmsContainer = (films) => {
    render(this.#filmsListComponent, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(films);
  }

  #renderFilmsTop = (from, to) => {
    render(this.#topRateComponent, this.#filmsListContainerTopComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#topRateComponent, RenderPosition.BEFOREEND);

    let filmsOfHigherRating = this.films.slice().sort(sortFilmRating);

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
      .forEach((film) => this.#renderFilm(this.#filmsListContainerTopComponent, film, BlockType.TOP));
  }

  #renderFilmsMostCommented = (from, to) => {
    render(this.#mostCommentedComponent, this.#filmsListContainerMostComponent, RenderPosition.BEFOREEND);
    render(this.#filmsContentComponent, this.#mostCommentedComponent, RenderPosition.BEFOREEND);

    let filmsOfMostCommented = this.films.slice().sort(sortFilmMostCommented);

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
      .forEach((film) => this.#renderFilm(this.#filmsListContainerMostComponent, film, BlockType.COMMENTED));
  }

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);

    render(this.#filmsListComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);

    this.#noFilmComponent.element.classList[!this.films.length ? 'remove' : 'add']('visually-hidden');
  }

  #handleShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + Films.COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);

    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);

    render(this.#filmsListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsList = () => {
    render(this.#filmsContentComponent, this.#filmsListComponent, RenderPosition.AFTERBEGIN);

    if (!this.films.length) {
      return false;
    }

    const filmCount = this.films.length;
    const films = this.films.slice(0, Math.min(filmCount, Films.COUNT_PER_STEP));

    this.#renderFilmsContainer(films);

    if (filmCount > Films.COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilmsListTop = () => {
    const filterRatingList = this.films.filter((item) => item.filmInfo.totalRating > 0);

    if (filterRatingList.length) {
      this.#renderFilmsTop(0, Films.COUNT_RATED);
    }
  }

  #renderFilmsListMostCommented = () => {
    const filterMostCommentedList = this.films.filter((item) => item.comments.length > 0);

    if (filterMostCommentedList.length) {
      this.#renderFilmsMostCommented(0, Films.COUNT_RATED);
    }
  }

  #renderPopup = () => {
    this.#bodyElement.appendChild(this.#filmDetailsPopupContainerComponent.element);
  }

  #clearFilmsPage = ({resetRenderedFilmCount = false, resetSortType = false} = {}, idFilm = null) => {
    const filmCount = this.films.length;

    this.#scrollPopup = document.querySelector('.film-details').scrollTop;
    if (this.#bodyElement.classList.contains('hide-overflow')) {
      this.#filmOpenId = idFilm;
    } else {
      this.#filmOpenId = null;
    }

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortMenuComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = Films.COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка страницы вызвана
      // уменьшением количества фильмов (например, перенос в любимые)
      // нужно скорректировать число показанных фильмов
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    this.#removePopup();
  }

  #renderFilmsPage = () => {
    if (!this.films.length) {
      render(this.#filmsContainer, this.#filmsContentComponent, RenderPosition.BEFOREEND);

      this.#renderFilmsList();
      this.#renderNoFilms();
      return false;
    }

    this.#renderSort();
    this.#renderPopup();

    render(this.#filmsContainer, this.#filmsContentComponent, RenderPosition.BEFOREEND);

    this.#renderFilmsList();

    if (!this.#isInit) {
      this.#renderFilmsListTop();
      this.#renderFilmsListMostCommented();

      this.#isInit = true;
    }

    if (this.#filmOpenId) {
      const filmCardElement = this.#bodyElement.querySelector(`.film-card[data-id="${this.#filmOpenId}"]`);
      filmCardElement.querySelector('.film-card__link').click();
      document.querySelector('.film-details').scrollTop = this.#scrollPopup;
    }
  }
}
