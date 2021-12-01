const createFilmDetailsCommentItemTemplate = (comment) => {
  const {message, emoji, author, date} = comment;

  return   `
          <li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
          </span>
          <div>
            <p class="film-details__comment-text">${message}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>
        `;
};

export const createFilmDetailsCommentTemplate = (comments) => {
  const commentItemsTemplate = comments
    .map((comment) => createFilmDetailsCommentItemTemplate(comment))
    .join('');

  return `<ul class="film-details__comments-list">
            ${commentItemsTemplate}
          </ul>`;
};
