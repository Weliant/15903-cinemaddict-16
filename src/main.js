import UserMenuView from './view/user-menu-view.js';
import FooterStatisticView from './view/footer-statistic-view.js';

import MovieListPresenter from './presenter/movie-list-presenter.js';

import {render, RenderPosition} from './utils/render.js';
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

const movieListPresenter = new MovieListPresenter(siteMainElement);

movieListPresenter.init(films, filters);

if (user.rank) {
  render(siteHeaderElement, new UserMenuView(user), RenderPosition.BEFOREEND);
}

render(siteFooterStatisticElement, new FooterStatisticView(films.length), RenderPosition.BEFOREEND);


