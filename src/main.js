import FooterStatisticView from './view/footer-statistic-view.js';
import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import UserPresenter from './presenter/user-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {render, RenderPosition} from './utils/render.js';
import {generateFilm} from './mock/film.js';
import {Films} from './consts.js';

const films = Array.from({length: Films.COUNT}, generateFilm);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteFooterStatisticElement = bodyElement.querySelector('.footer .footer__statistics');

new UserPresenter(siteHeaderElement, filmsModel);
new FilterPresenter(siteMainElement, filterModel, filmsModel);
new MovieListPresenter(siteMainElement, filmsModel, filterModel);

render(siteFooterStatisticElement, new FooterStatisticView(films.length), RenderPosition.BEFOREEND);


