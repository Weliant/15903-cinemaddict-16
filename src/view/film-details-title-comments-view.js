import SmartView from './smart-view';

const createFilmDetailsCommentNewTemplate = (data) => {
  const {countComments} = data;

  return   `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${countComments}</span></h3>`;
};

export default class FilmDetailsTitleCommentsView extends SmartView {
  constructor(comments) {
    super();
    this._data = FilmDetailsTitleCommentsView.parseTaskToData(comments);
  }

  get template() {
    return createFilmDetailsCommentNewTemplate(this._data);
  }

  static parseTaskToData = (comments) => ({
    countComments: comments?.length
  });
}
