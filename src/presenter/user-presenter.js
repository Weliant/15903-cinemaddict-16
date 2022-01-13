import UserMenuView from '../view/user-menu-view.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {Rank, URL_AVATAR} from '../consts.js';

export default class UserPresenter {
  #filterContainer = null;
  #filmsModel = null;

  #userMenuComponent = null;

  #userRank = new Map();
  #fromValue = 1;

  constructor(filterContainer, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);

    for (let i = 0; i < Rank.STATUS.length; i++) {
      const countFilms = this.#fromValue + Rank.RANGE*i;
      this.#userRank.set(countFilms, Rank.STATUS[i]);
    }

    this.init();
  }

  init = () => {
    const prevUserMenuComponent = this.#userMenuComponent;
    const user = this.#generateUser(this.#filmsModel.films);

    this.#userMenuComponent = new UserMenuView(user);

    if (prevUserMenuComponent === null) {
      render(this.#filterContainer, this.#userMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#userMenuComponent, prevUserMenuComponent);
    remove(prevUserMenuComponent);
  }

  #getRank = (films) => {
    const countWatchedFilms = films.filter((film) => film.userDetails.alreadyWatched).length;
    let rank = '';

    if(countWatchedFilms) {
      for (const value of this.#userRank.entries()) {
        if (countWatchedFilms >= value[0]) {
          rank = value[1];
        } else {
          break;
        }
      }
    }

    return rank;
  };

  #generateUser = (films) => {
    const urlAvatar = 'bitmap@2x.png';

    return {
      rank: this.#getRank(films),
      avatar: `${URL_AVATAR}/${urlAvatar}`,
    };
  };

  #handleModelEvent = () => {
    this.init();
  }
}
