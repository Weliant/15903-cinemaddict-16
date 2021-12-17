import AbstractView from './abstract-view.js';

const createFilmDetailsCommentItemTemplate = (data) => {
  const {comment, emotion, author, date} = data;

  return   `
            <li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete">Delete</button>
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

export default class FilmDetailsCommentView extends AbstractView {
  #comments = null;

  constructor(comments){
    super();
    this.#comments = comments;
  }

  get template() {
    return createFilmDetailsCommentTemplate(this.#comments);
  }
}
