import {createUserMenuTemplate} from './view/user-menu-view.js';
import {createFilterTemplate} from './view/filter-view.js';
import {createSortMenuTemplate} from './view/sort-menu-view.js';
import {createContentFilmsTemplate} from './view/films-content-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createLoadingTemplate} from './view/loading-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-botton-view.js';
import {createStatisticInfoTemplate} from './view/statistic-info-view.js';
import {createFooterStatisticTemplate} from './view/footer-statistic-view.js';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup-view.js';
import {createFilmDetailsInfoTemplate} from './view/film-details-info-view.js';
import {createFilmDetailsCommentTemplate} from './view/film-details-comment-view.js';
import {createFilmDetailsCommentNewTemplate} from './view/film-details-comments-new-view.js';
import {renderTemplate, RenderPosition} from './render.js';

import {generateFilm} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {generateUser} from './mock/user.js';

const FILMS_COUNT = 20;
const FILMS_COUNT_PER_STEP = 5;
const FILMS_COUNT_RATED = 2;

const films = Array.from({length: FILMS_COUNT}, generateFilm);
const filters = generateFilter(films);
const user = generateUser(films);

const bodyElement = document.querySelector('body');
const footerElement = document.querySelector('footer');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticElement = siteFooterElement.querySelector('.footer__statistics');

if (user.rank) {
  renderTemplate(siteHeaderElement, createUserMenuTemplate(user), RenderPosition.BEFOREEND);
}

renderTemplate(siteMainElement, createFilterTemplate(filters), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createContentFilmsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createStatisticInfoTemplate(films, user), RenderPosition.BEFOREEND);
renderTemplate(siteFooterStatisticElement, createFooterStatisticTemplate(films.length), RenderPosition.BEFOREEND);
// renderTemplate(footerElement, createFilmDetailsPopupTemplate(films[0].comments), RenderPosition.AFTEREND);

const siteFilmsContentElement = document.querySelector('.films');
const siteFilmsListElement = siteFilmsContentElement.querySelector('.films-list');
const siteFilmsListExtraElement = siteFilmsContentElement.querySelectorAll('.films-list.films-list--extra');
const siteFilmsListContainerElement = siteFilmsListElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  renderTemplate(siteFilmsListContainerElement, createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

const siteFilmDetailsElement = document.querySelector('.film-details');
const siteFilmDetailsInfoElement = siteFilmDetailsElement.querySelector('.film-details__info-wrap');
const siteFilmDetailsCommentsElement = siteFilmDetailsElement.querySelector('.film-details__new-comment');
const siteFilmDetailsCommentNewElement = siteFilmDetailsElement.querySelector('.film-details__new-comment');

siteFilmsListExtraElement.forEach((element) => {
  for (let i = 0; i < FILMS_COUNT_RATED; i++) {
    renderTemplate(element.querySelector('.films-list__container'), createFilmCardTemplate(films[i]), RenderPosition.BEFOREEND);
  }
});

// renderTemplate(siteFilmsListElement, createLoadingTemplate(), RenderPosition.BEFOREEND);

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmCount = FILMS_COUNT_PER_STEP;

  renderTemplate(siteFilmsListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = siteFilmsListElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(siteFilmsListContainerElement, createFilmCardTemplate(task), RenderPosition.BEFOREEND));

    renderedFilmCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(siteFilmDetailsInfoElement, createFilmDetailsInfoTemplate(films[0]), RenderPosition.BEFOREEND);
renderTemplate(siteFilmDetailsCommentsElement, createFilmDetailsCommentTemplate(films[0].comments), RenderPosition.BEFOREBEGIN);
renderTemplate(siteFilmDetailsCommentNewElement, createFilmDetailsCommentNewTemplate(), RenderPosition.BEFOREEND);

if(siteFilmDetailsElement){
  // bodyElement.classList.add('hide-overflow');
}

