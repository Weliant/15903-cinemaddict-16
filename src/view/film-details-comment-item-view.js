import he from 'he';
import SmartView from './smart-view';
import {getFullDateHumanize} from '../utils/film';

const createFilmDetailsCommentItemTemplate = (data) => {
  const {id, comment, emotion, author, date, isDisabled, isDeleting} = data;

  return   `
            <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${he.encode(comment)}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${getFullDateHumanize(date)}</span>
                <button class="film-details__comment-delete" data-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
              </p>
            </div>
          </li>
        `;
};

export default class FilmDetailsCommentItemView extends SmartView {
  constructor(comment){
    super();
    this._data = FilmDetailsCommentItemView.parseCommentToData(comment);
  }

  get template() {
    return createFilmDetailsCommentItemTemplate(this._data);
  }

  restoreHandlers = () => {
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.addEventListener('click', this.#buttonDeleteClickHandler);
  }

  #buttonDeleteClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains('film-details__comment-delete')){
      this._callback.deleteClick(evt.target.dataset.id);
    }
  }

  static parseCommentToData = (comment) => ({...comment,
    isDisabled: false,
    isDeleting: false
  });

  static parseDataToTask = (data) => {
    const comment = {...data};

    delete comment.isDisabled;
    delete comment.isDeleting;

    return comment;
  }
}
