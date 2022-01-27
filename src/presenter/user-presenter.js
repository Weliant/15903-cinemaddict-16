import UserMenuView from '../view/user-menu-view';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {generateUser} from '../utils/user';

export default class UserPresenter {
  #userContainer = null;
  #filmsModel = null;

  #userMenuComponent = null;

  constructor(userContainer, filmsModel) {
    this.#userContainer = userContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.init();
  }

  init = () => {
    const prevUserMenuComponent = this.#userMenuComponent;
    const user = generateUser(this.#filmsModel.films);

    this.#userMenuComponent = new UserMenuView(user);

    if (prevUserMenuComponent === null) {
      render(this.#userContainer, this.#userMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#userMenuComponent, prevUserMenuComponent);
    remove(prevUserMenuComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
