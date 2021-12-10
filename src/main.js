import UserMenuView from './view/user-menu-view.js';
import FilterView from './view/filter-view.js';
import SortMenuView from './view/sort-menu-view.js';
import FilmsContentView from './view/films-content-view.js';
import FilmsListView from './view/films-list-view.js';
import NoFilmView from './view/no-film-view.js';
import FilmsListContainerView from './view/films-container-view.js';
import TopRateView from './view/top-rate-view.js';
import MostCommentedView from './view/most-commented-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-botton-view.js';
import FooterStatisticView from './view/footer-statistic-view.js';
import FilmDetailsPopupView from './view/film-details-popup-view.js';
import FilmDetailsPosterView from './view/film-details-poster-view.js';
import FilmDetailsInfoView from './view/film-details-info-view.js';
import FilmDetailsCommentView from './view/film-details-comment-view.js';
import FilmDetailsCommentNewView from './view/film-details-comments-new-view.js';

import {render, RenderPosition} from './render.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUser} from './mock/user.js';
import {Films} from './consts.js';

const films = Array.from({length: Films.COUNT}, generateFilm);
const filters = generateFilter(films);
const user = generateUser(films);

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteFooterStatisticElement = bodyElement.querySelector('.footer .footer__statistics');

if (user.rank) {
  render(siteHeaderElement, new UserMenuView(user).element, RenderPosition.BEFOREEND);
}

render(siteMainElement, new FilterView(filters).element, RenderPosition.BEFOREEND);
render(siteFooterStatisticElement, new FooterStatisticView(films.length).element, RenderPosition.BEFOREEND);

const removePopup = () => {
  const popupComponent = bodyElement.querySelector('.film-details');
  if (popupComponent){
    bodyElement.removeChild(popupComponent);
  }
  if (bodyElement.classList.contains('hide-overflow')) {
    bodyElement.classList.remove('hide-overflow');
  }
};

const onEscKeyDown = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    removePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const onPopupClose = (evt) => {
  evt.target.removeEventListener('click', onPopupClose);
  document.removeEventListener('keydown', onEscKeyDown);
  removePopup();
};

const renderFilm = (filmContainerElement, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', (evt) => {
    evt.preventDefault();

    removePopup();

    const filmDetailsPopupComponent = new FilmDetailsPopupView(film.comments);

    bodyElement.appendChild(filmDetailsPopupComponent.element);

    const siteFilmDetailsElement = filmDetailsPopupComponent.element.querySelector('.film-details__info-wrap');
    const siteFilmDetailsCommentsWrapElement = filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    const buttonCloseElement = filmDetailsPopupComponent.element.querySelector('.film-details__close-btn');

    siteFilmDetailsElement.appendChild(new FilmDetailsPosterView(film).element);
    siteFilmDetailsElement.appendChild(new FilmDetailsInfoView(film).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentView(film.comments).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentNewView().element);

    if (filmDetailsPopupComponent) {
      bodyElement.classList.add('hide-overflow');
    }

    document.addEventListener('keydown', onEscKeyDown);
    buttonCloseElement.addEventListener('click', onPopupClose);
  });

  render(filmContainerElement, filmComponent.element, RenderPosition.BEFOREEND);
};

const renderFilmList = (mainContainer, listFilms) => {
  const filmContentComponent = new FilmsContentView();
  render(mainContainer, filmContentComponent.element, RenderPosition.BEFOREEND);

  const filmsListComponent = new FilmsListView();
  render(filmContentComponent.element, filmsListComponent.element, RenderPosition.BEFOREEND);

  const noFilmComponent = new NoFilmView(filters[0]);
  render(filmsListComponent.element, noFilmComponent.element, RenderPosition.BEFOREEND);

  if (!listFilms.length) {
    noFilmComponent.element.classList.remove('visually-hidden');
  } else {
    noFilmComponent.element.classList.add('visually-hidden');

    render(mainContainer.querySelector('.main-navigation'), new SortMenuView().element, RenderPosition.AFTEREND);

    const filmsListContainerComponent = new FilmsListContainerView();
    render(filmsListComponent.element, filmsListContainerComponent.element, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(listFilms.length, Films.COUNT_PER_STEP); i++) {
      renderFilm(filmsListContainerComponent.element, films[i]);
    }

    const mostCommentedComponent = new MostCommentedView();
    const filmsListContainerMostComponent = new FilmsListContainerView();

    render(mostCommentedComponent.element, filmsListContainerMostComponent.element, RenderPosition.BEFOREEND);
    render(filmsListComponent.element, mostCommentedComponent.element, RenderPosition.AFTEREND);

    const topRateComponent = new TopRateView();
    const filmsListContainerTopComponent = new FilmsListContainerView();

    render(topRateComponent.element, filmsListContainerTopComponent.element, RenderPosition.BEFOREEND);
    render(filmsListComponent.element, topRateComponent.element, RenderPosition.AFTEREND);

    for (let i = 0; i < Films.COUNT_RATED; i++) {
      renderFilm(filmsListContainerMostComponent.element, films[i]);
    }

    for (let i = 0; i < Films.COUNT_RATED; i++) {
      renderFilm(filmsListContainerTopComponent.element, films[i]);
    }

    if (listFilms.length > Films.COUNT_PER_STEP) {
      let renderedFilmCount = Films.COUNT_PER_STEP;

      const showMoreButton = new ShowMoreButtonView();

      render(filmsListComponent.element, showMoreButton.element, RenderPosition.BEFOREEND);

      showMoreButton.element.addEventListener('click', (evt) => {
        evt.preventDefault();
        listFilms
          .slice(renderedFilmCount, renderedFilmCount + Films.COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmsListContainerComponent.element, film));
        renderedFilmCount += Films.COUNT_PER_STEP;

        if (renderedFilmCount >= listFilms.length) {
          showMoreButton.element.remove();
        }
      });
    }
  }
};

renderFilmList(siteMainElement, films);

