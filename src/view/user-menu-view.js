import AbstractView from './abstract-view.js';

const createUserMenuTemplate = (user) => {
  const {rank, avatar} = user;

  return   `<section class="header__profile profile">
              <p class="profile__rating">${rank}</p>
              <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
            </section>
          `;
};

export default class UserMenuView extends AbstractView {
  #user = null;

  constructor(user){
    super();
    this.#user = user;
  }

  get template() {
    return createUserMenuTemplate(this.#user);
  }
}
