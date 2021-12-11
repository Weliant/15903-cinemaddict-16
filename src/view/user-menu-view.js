import {createElement} from '../render.js';

const createUserMenuTemplate = (user) => {
  const {rank, avatar} = user;

  return   `<section class="header__profile profile">
              <p class="profile__rating">${rank}</p>
              <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
            </section>
          `;
};

export default class UserMenuView {
  #element = null;
  #user = null;

  constructor(user){
    this.#user = user;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createUserMenuTemplate(this.#user);
  }

  removeElement() {
    this.#element = null;
  }
}
