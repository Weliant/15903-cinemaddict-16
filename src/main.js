import MovieListPresenter from './presenter/movie-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import UserPresenter from './presenter/user-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import ApiService, {AUTHORIZATION, END_POINT} from './services/api-service';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');

new UserPresenter(siteHeaderElement, filmsModel);
new FilterPresenter(siteMainElement, filterModel, filmsModel);
new MovieListPresenter(siteMainElement, filmsModel, filterModel);

filmsModel.init();

