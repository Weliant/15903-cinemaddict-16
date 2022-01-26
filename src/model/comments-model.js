import AbstractObservable from '../services/abstract-observable';
import {UpdateType} from '../consts';
import {adaptToClient} from '../utils/film';

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

  addComment = async (updateType, update) => {
    try {
      const response = await this.#apiService.addComment(update);
      this.#comments = response.comments;

      const updateInfoFilm = {
        film: adaptToClient(response.movie),
      };

      this._notify(updateType, updateInfoFilm);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update.comment);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];

      update.film.comments = update.film.comments.filter((item) => item !== update.comment.id);

      const updateInfoFilm = {
        film: update.film,
      };

      this._notify(updateType, updateInfoFilm);
    } catch(err) {
      throw new Error('Can\'t delete comment');
    }
  }
}
