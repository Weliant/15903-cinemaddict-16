import UserMenuView from './view/user-menu-view.js';
import FilterView from './view/filter-view.js';
import SortMenuView from './view/sort-menu-view.js';
import FilmsContentView from './view/films-content-view.js';
import FilmsListView from './view/films-list-view.js';
import FilmsListContainerView from './view/films-container-view.js';
import TopRateView from './view/top-rate-view.js';
import MostCommentedView from './view/most-commented-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import FooterStatisticView from './view/footer-statistic-view.js';
import FilmDetailsPopupView from './view/film-details-popup-view.js';
import CloseButtonView from './view/close-button-view.js';
import FilmDetailsPosterView from './view/film-details-poster-view.js';
import FilmDetailsInfoView from './view/film-details-info-view.js';
import FilmDetailsCommentView from './view/film-details-comment-view.js';
import FilmDetailsCommentNewView from './view/film-details-comments-new-view.js';

import {render, RenderPosition, remove} from './utils/render.js';
import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUser} from './mock/user.js';
import {Films} from './consts.js';
import {isEscPressed} from './utils/common.js';

const films = Array.from({length: Films.COUNT}, generateFilm);
const filters = generateFilter(films);
const user = generateUser(films);

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteFooterStatisticElement = bodyElement.querySelector('.footer .footer__statistics');

if (user.rank) {
  render(siteHeaderElement, new UserMenuView(user), RenderPosition.BEFOREEND);
}

render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND);
render(siteFooterStatisticElement, new FooterStatisticView(films.length), RenderPosition.BEFOREEND);

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
  if (isEscPressed(evt)) {
    evt.preventDefault();
    removePopup();
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const renderFilm = (filmContainerElement, film) => {
  const filmComponent = new FilmCardView(film);

  filmComponent.setOpenClickHandler(() => {
    removePopup();

    const filmDetailsPopupComponent = new FilmDetailsPopupView(film.comments);
    const closeButtonComponent = new CloseButtonView(film.comments);

    bodyElement.appendChild(filmDetailsPopupComponent.element);

    const siteFilmDetailsElement = filmDetailsPopupComponent.element.querySelector('.film-details__info-wrap');
    const siteFilmDetailsCommentsWrapElement = filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    const buttonCloseElement = filmDetailsPopupComponent.element.querySelector('.film-details__close');

    siteFilmDetailsElement.appendChild(new FilmDetailsPosterView(film).element);
    siteFilmDetailsElement.appendChild(new FilmDetailsInfoView(film).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentView(film.comments).element);
    siteFilmDetailsCommentsWrapElement.appendChild(new FilmDetailsCommentNewView().element);
    buttonCloseElement.appendChild(closeButtonComponent.element);

    if (filmDetailsPopupComponent) {
      bodyElement.classList.add('hide-overflow');
    }

    document.addEventListener('keydown', onEscKeyDown);

    closeButtonComponent.setCloseClickHandler(() => {
      document.removeEventListener('keydown', onEscKeyDown);
      removePopup();
    });
  });

  render(filmContainerElement, filmComponent, RenderPosition.BEFOREEND);
};

const renderFilmList = (mainContainer, listFilms) => {
  const filmContentComponent = new FilmsContentView();
  render(mainContainer, filmContentComponent, RenderPosition.BEFOREEND);

  const filmsListComponent = new FilmsListView(filters[0]);
  render(filmContentComponent, filmsListComponent, RenderPosition.BEFOREEND);

  const noFilmComponent = filmsListComponent.element.querySelector('.films-list__title');

  if (!listFilms.length) {
    noFilmComponent.classList.remove('visually-hidden');
  } else {
    noFilmComponent.classList.add('visually-hidden');

    render(mainContainer.querySelector('.main-navigation'), new SortMenuView(), RenderPosition.AFTEREND);

    const filmsListContainerComponent = new FilmsListContainerView();
    render(filmsListComponent, filmsListContainerComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(listFilms.length, Films.COUNT_PER_STEP); i++) {
      renderFilm(filmsListContainerComponent.element, films[i]);
    }

    const mostCommentedComponent = new MostCommentedView();
    const filmsListContainerMostComponent = new FilmsListContainerView();

    render(mostCommentedComponent, filmsListContainerMostComponent, RenderPosition.BEFOREEND);
    render(filmsListComponent, mostCommentedComponent, RenderPosition.AFTEREND);

    const topRateComponent = new TopRateView();
    const filmsListContainerTopComponent = new FilmsListContainerView();

    render(topRateComponent, filmsListContainerTopComponent, RenderPosition.BEFOREEND);
    render(filmsListComponent, topRateComponent, RenderPosition.AFTEREND);

    for (let i = 0; i < Films.COUNT_RATED; i++) {
      renderFilm(filmsListContainerMostComponent.element, films[i]);
    }

    for (let i = 0; i < Films.COUNT_RATED; i++) {
      renderFilm(filmsListContainerTopComponent.element, films[i]);
    }

    if (listFilms.length > Films.COUNT_PER_STEP) {
      let renderedFilmCount = Films.COUNT_PER_STEP;

      const showMoreButton = new ShowMoreButtonView();

      render(filmsListComponent, showMoreButton, RenderPosition.BEFOREEND);
      showMoreButton.setClickHandler(() => {
        listFilms
          .slice(renderedFilmCount, renderedFilmCount + Films.COUNT_PER_STEP)
          .forEach((film) => renderFilm(filmsListContainerComponent.element, film));
        renderedFilmCount += Films.COUNT_PER_STEP;

        if (renderedFilmCount >= listFilms.length) {
          remove(showMoreButton);
        }
      });
    }
  }
};

renderFilmList(siteMainElement, films);

