import SmartView from './smart-view';

const createFilmDetailsCommentTemplate = () => '<ul class="film-details__comments-list"></ul>';

export default class FilmDetailsCommentView extends SmartView {
  get template() {
    return createFilmDetailsCommentTemplate(this._data);
  }
}
