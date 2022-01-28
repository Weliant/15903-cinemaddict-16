import AbstractView from './abstract-view';

const createFilmDetailsPosterTemplate = (film) => {
  const {filmInfo} = film;

  return `
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">
          <p class="film-details__age">${filmInfo.ageRating}+</p>
        </div>
        `;
};

export default class FilmDetailsPosterView extends AbstractView {
  #film = null;

  constructor(film){
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsPosterTemplate(this.#film);
  }
}
