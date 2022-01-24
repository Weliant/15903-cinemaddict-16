import he from 'he';
import SmartView from './smart-view';
import {getFullDateHumanize} from '../utils/film';

const createFilmDetailsCommentItemTemplate = (data) => {
  const {id, comment, emotion, author, date} = data;

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
                <button class="film-details__comment-delete" data-id="${id}">Delete</button>
              </p>
            </div>
          </li>
        `;
};

const createFilmDetailsCommentTemplate = (comments) => {
  const commentItemsTemplate = comments
    .map((comment) => createFilmDetailsCommentItemTemplate(comment))
    .join('');

  return `<ul class="film-details__comments-list">
            ${commentItemsTemplate}
          </ul>`;
};

export default class FilmDetailsCommentView extends SmartView {
  #comments = null;

  constructor(comments){
    super();
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsCommentTemplate(this.#comments);
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
}
