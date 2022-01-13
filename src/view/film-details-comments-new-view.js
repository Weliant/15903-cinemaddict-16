import he from 'he';
import SmartView from './smart-view.js';
import {isEnterMessagePressed} from '../utils/common.js';

const COMMENT_BLANK = {
  comment: '',
  emotion: ''
};

const emotionItem = (emotion) => emotion && emotion !== 'undefined' ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : '';

const createFilmDetailsCommentNewTemplate = (data) => {
  const {comment, emotion} = data;
  const text = !comment || comment === undefined ? ''  : comment.trim();

  return   `<div class="film-details__new-comment">
        <div class="film-details__add-emoji-label" data-emotion="${emotion}">
          ${emotionItem(emotion)}
        </div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(text)}</textarea>
        </label>

        <div class="film-details__emoji-list">
          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
          <label class="film-details__emoji-label" for="emoji-smile">
            <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
          <label class="film-details__emoji-label" for="emoji-sleeping">
            <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
          <label class="film-details__emoji-label" for="emoji-puke">
            <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
          </label>

          <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
          <label class="film-details__emoji-label" for="emoji-angry">
            <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
          </label>
        </div>
      </div>

`;
};

export default class FilmDetailsCommentsNewView extends SmartView {
  constructor(comment = COMMENT_BLANK) {
    super();
    this._data = FilmDetailsCommentsNewView.parseTaskToData(comment);

    if (this._data.comment) {
      this.element.querySelector('.film-details__comment-input').value = this._data.comment.trim();
    } else {
      this.element.querySelector('.film-details__comment-input').value = '';
    }

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsCommentNewTemplate(this._data);
  }

  static parseTaskToData = (task) => ({...task });

  static parseDataToTask = (data) => {
    const film = {...data};

    return film;
  }

  restoreHandlers = () => {
    document.addEventListener('keydown', this.#buttonSendKeydownHandler);
    this.#setInnerHandlers();
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('change', this.#emotionChangeHandler);
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#commentsTextInputHandler);
  }

  #emotionChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value,
    });
  }

  #commentsTextInputHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  setSendKeydownHandler = (callback) => {
    this._callback.sendKeydown = callback;
    document.addEventListener('keydown', this.#buttonSendKeydownHandler);
  }

  #buttonSendKeydownHandler = (evt) => {
    if (isEnterMessagePressed(evt)) {
      evt.preventDefault();
      const data = {...this._data};
      if (data.emotion && data.comment) {
        this._callback.sendKeydown(data);
        document.removeEventListener('keydown', this.#buttonSendKeydownHandler);
      }
    }
  }

  removeHandlers = () => {
    document.removeEventListener('keydown', this.#buttonSendKeydownHandler);
  }
}
