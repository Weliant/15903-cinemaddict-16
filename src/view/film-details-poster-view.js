import {createElement} from '../render.js';

const createFilmDetailsPosterTemplate = (film) => {
  const {filmInfo} = film;

  return `
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">
          <p class="film-details__age">${filmInfo.ageRating}</p>
        </div>
        `;
};

export default class FilmDetailsPosterView {
  #element = null;
  #film = null;

  constructor(film){
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmDetailsPosterTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
