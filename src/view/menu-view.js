import AbstractView from './abstract-view';
import {MenuItem} from '../consts';

const createMenuTemplate = () => `<nav class="main-navigation">
                                    <a href="#stats" class="main-navigation__additional">Stats</a>
                                  </nav>`;

export default class MenuView extends AbstractView {
  get template() {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelector('.main-navigation__additional').addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.menuClick(MenuItem.STATISTICS);
    evt.target.classList.add('main-navigation__additional--active');
  }

  clear = () => {
    const menuItemElement = this.element.querySelector('.main-navigation__additional--active');

    if (menuItemElement) {
      menuItemElement.classList.remove('main-navigation__additional--active');
    }
  }
}
