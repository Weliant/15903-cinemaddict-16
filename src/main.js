import MovieListPresenter from './presenter/movie-list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import UserPresenter from './presenter/user-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import {AUTHORIZATION, END_POINT} from './consts.js';
import ApiService from './api-service.js';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');

new UserPresenter(siteHeaderElement, filmsModel);
new FilterPresenter(siteMainElement, filterModel, filmsModel);
new MovieListPresenter(siteMainElement, filmsModel, filterModel);

filmsModel.init();

