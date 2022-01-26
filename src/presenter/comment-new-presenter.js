import FilmDetailsCommentsNewView from '../view/film-details-comments-new-view';
import {UserAction, UpdateType} from '../consts';
import {render, RenderPosition, remove} from '../utils/render';

export const State = {
  SAVING: 'SAVING',
  ABORTING: 'ABORTING',
};

export default class CommentNewPresenter {
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
    this.#commentComponent = new FilmDetailsCommentsNewView(this.#comment);
    this.#commentComponent.setSendKeydownHandler((data) => this.#saveClickHandler(data));
  }

  #saveClickHandler = (data) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      {film: this.#film, comment: data}
    );
  }

  setViewState = (state) => {
    const resetFormState = () => {
      this.#commentComponent.updateData({
        isDisabled: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#commentComponent.updateData({
          isDisabled: true,
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
