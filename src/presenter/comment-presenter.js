import FilmDetailsCommentItemView from '../view/film-details-comment-item-view';
import {UserAction, UpdateType} from '../consts';
import {render, RenderPosition, remove} from '../utils/render';

export const State = {
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class CommentPresenter {
  #commentListContainer = null;
  #film = null;
  #comment = null;
  #commentComponent = null;
  #changeData = null;

  constructor(commentListContainer, changeData) {
    this.#commentListContainer = commentListContainer;
    this.#changeData = changeData;
  }

  init = (comment, film) => {
    this.#comment = comment;
    this.#film = film;

    this.#createNewCommentComponent();
    render(this.#commentListContainer, this.#commentComponent, RenderPosition.BEFOREEND);
  }

  #createNewCommentComponent = () => {
    this.#commentComponent = new FilmDetailsCommentItemView(this.#comment);

    this.#commentComponent.setDeleteClickHandler(this.#deleteClickHandler);
  }

  #deleteClickHandler = () => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      {film: this.#film, comment: this.#comment}
    );
  }

  setViewState = (state) => {
    const resetFormState = () => {
      this.#commentComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.DELETING:
        this.#commentComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#commentComponent.shake(resetFormState);
        break;
    }
  }

  destroy = () => {
    remove(this.#commentComponent);
  }
}
