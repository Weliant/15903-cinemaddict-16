import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../consts.js';

export default class CommentsModel extends AbstractObservable {
  #apiService = null;
  #film = {};
  #comments = [];

  constructor(film, apiService) {
    super();
    this.#film = film;
    this.#apiService = apiService;
  }

  init = async () => {
    try {
      const comments = await this.#apiService.getComment(this.#film);
      this.#comments = comments;
      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#comments = [];
      this._notify(UpdateType.ERROR);
      throw new Error('Can\'t load comment');
    }
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
