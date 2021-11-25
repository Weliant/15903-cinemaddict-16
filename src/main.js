import {createUserMenuTemplate} from './view/user-menu-view.js';
import {createSiteMenuTemplate} from './view/site-menu-view.js';
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

const FILMS_COUNT = 5;
const FILMS_COUNT_RATED = 2;

const bodyElement = document.querySelector('body');
const footerElement = document.querySelector('footer');
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticElement = siteFooterElement.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createUserMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createContentFilmsTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteMainElement, createStatisticInfoTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFooterStatisticElement, createFooterStatisticTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerElement, createFilmDetailsPopupTemplate(), RenderPosition.AFTEREND);

const siteFilmsContentElement = document.querySelector('.films');
const siteFilmsListElement = siteFilmsContentElement.querySelector('.films-list');
const siteFilmsListExtraElement = siteFilmsContentElement.querySelectorAll('.films-list.films-list--extra');
const siteFilmsListContainerElement = siteFilmsListElement.querySelector('.films-list__container');
const siteFilmDetailsElement = document.querySelector('.film-details');
const siteFilmDetailsInfoElement = siteFilmDetailsElement.querySelector('.film-details__info-wrap');
const siteFilmDetailsCommentsElement = siteFilmDetailsElement.querySelector('.film-details__comments-list');
const siteFilmDetailsCommentNewElement = siteFilmDetailsElement.querySelector('.film-details__new-comment');

for (let i = 0; i < FILMS_COUNT; i++) {
  renderTemplate(siteFilmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

siteFilmsListExtraElement.forEach((element) => {
  for (let i = 0; i < FILMS_COUNT_RATED; i++) {
    renderTemplate(element.querySelector('.films-list__container'), createFilmCardTemplate(), RenderPosition.BEFOREEND);
  }
});

renderTemplate(siteFilmsListElement, createLoadingTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilmsListElement, createShowMoreButtonTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilmDetailsInfoElement, createFilmDetailsInfoTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilmDetailsCommentsElement, createFilmDetailsCommentTemplate(), RenderPosition.BEFOREEND);
renderTemplate(siteFilmDetailsCommentNewElement, createFilmDetailsCommentNewTemplate(), RenderPosition.BEFOREEND);

if(siteFilmDetailsElement){
  bodyElement.classList.add('hide-overflow');
}


