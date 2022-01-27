import MenuView from './view/menu-view';
import FilmListPresenter from './presenter/film-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import UserPresenter from './presenter/user-presenter';
import StatisticsPresenter from './presenter/statistics-presenter';
import FooterPresenter from './presenter/footer-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import ApiService, {AUTHORIZATION, END_POINT} from './services/api-service';
import {MenuItem} from './consts';
import {render, RenderPosition} from './utils/render.js';

let typeMenu = MenuItem.FILMS;

const menuComponent = new MenuView();

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const bodyElement = document.querySelector('body');
const siteMainElement = bodyElement.querySelector('.main');
const siteHeaderElement = bodyElement.querySelector('.header');
const siteFooterStatisticElement = bodyElement.querySelector('.footer .footer__statistics');

render(siteMainElement, menuComponent, RenderPosition.BEFOREEND);
const navigationElement = siteMainElement.querySelector('.main-navigation');

const filterPresenter = new FilterPresenter(navigationElement, filterModel, filmsModel);
const filmListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);
let statisticsPresenter = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (typeMenu !== menuItem) {
        typeMenu = menuItem;
        menuComponent.clear();
        statisticsPresenter.destroy();
        filmListPresenter.destroy();
        filmListPresenter.init();
      }
      break;
    case MenuItem.STATISTICS:
      if (typeMenu !== menuItem) {
        typeMenu = menuItem;
        filterPresenter.clear();
        filmListPresenter.destroy();
        statisticsPresenter = new StatisticsPresenter(siteMainElement, filmsModel);
        statisticsPresenter.init();
      }
      break;
  }
};

filterPresenter.setMenuClickHandler(handleSiteMenuClick);
menuComponent.setMenuClickHandler(handleSiteMenuClick);

new UserPresenter(siteHeaderElement, filmsModel);
new FooterPresenter(siteFooterStatisticElement, filmsModel);

filmsModel.init();
filterPresenter.init();
filmListPresenter.init();

