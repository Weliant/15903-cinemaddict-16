import AbstractView from './abstract-view.js';

const createFilmDetailsPopupTemplate = (comments) => (
  `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
        </div>
        <div class="film-details__info-wrap"></div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <div class="film-details__new-comment">
          </div>
        </section>
      </div>
    </form>
  </section>
  `
);

export default class FilmDetailsPopupView extends AbstractView {
  #comments = null;

  constructor(comments){
    super();
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsPopupTemplate(this.#comments);
  }
}
