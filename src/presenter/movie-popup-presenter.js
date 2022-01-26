import {remove} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import CloseButtonView from '../view/close-button-view';
import FilmDetailsPosterView from '../view/film-details-poster-view';
import FilmDetailsInfoView from '../view/film-details-info-view';
import FilmDetailsTitleCommentsView from '../view/film-details-title-comments-view';
import FilmDetailsCommentView from '../view/film-details-comment-view';
import {UserAction, UpdateType} from '../consts';
import CommentsModel from '../model/comments-model';
import ApiService, {AUTHORIZATION, END_POINT} from '../services/api-service';
import CommentPresenter, {State as CommentPresenterViewState} from './comment-presenter';
import CommentNewPresenter, {State as CommentNewPresenterViewState} from './comment-new-presenter';

export default class MoviePopupPresenter {
  #film = null;
  #changeData = null;
  #addEventDocument = null;
  #removePopup = null;
  #newCommentData = null;

  #bodyElement = document.querySelector('body');
  #filmDetailsPopupContainerComponent = null;
  #filmDetailsPopupComponent = null;
  #closeButtonComponent = null;
  #commentsTitleComponent = null;
  #commentsComponent = null;
  #commentsModel = null;
  #commentPresenter = new Map();
  #commentNewPresenter = null;

  constructor(changeData, addEventDocument, removePopup) {
    this.#changeData = changeData;
    this.#addEventDocument = addEventDocument;
    this.#removePopup = removePopup;
  }

  get comments() {
    return this.#commentsModel?.comments;
  }

  init = (film, isUpdate = false, commentsStore = null) => {
    this.#film = film;
    this.#filmDetailsPopupContainerComponent = this.#bodyElement.querySelector('.film-details');

    if (commentsStore) {
      this.#newCommentData = commentsStore;
    }

    this.#removePopup();

    this.#changeData(
      UserAction.OPEN_FILM_CARD,
      UpdateType.MICRO,
      {...this.#film},
    );

    this.#filmDetailsPopupComponent = new FilmDetailsPopupView(this.#film);
    this.#closeButtonComponent = new CloseButtonView();
    this.#filmDetailsPopupContainerComponent.appendChild(this.#filmDetailsPopupComponent.element);

    const siteFilmDetailsElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__info-wrap');
    const buttonCloseElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__close');

    siteFilmDetailsElement.appendChild(new FilmDetailsPosterView(this.#film).element);
    siteFilmDetailsElement.appendChild(new FilmDetailsInfoView(this.#film).element);
    buttonCloseElement.appendChild(this.#closeButtonComponent.element);

    if (!isUpdate) {
      this.#commentsModel = new CommentsModel(this.#film, new ApiService(END_POINT, AUTHORIZATION));

      this.#commentsModel.init().finally(() => {
      });

      this.#commentsModel.addObserver(this.#handleCommentModelEvent);
    }

    this.#renderComments();

    if (this.#filmDetailsPopupComponent) {
      this.#bodyElement.classList.add('hide-overflow');
    }

    this.#filmDetailsPopupComponent.setWatchListClickHandler(this.#popupWatchListeClickHandler);
    this.#filmDetailsPopupComponent.setWatchedClickHandler(this.#popupWatchedClickHandler);
    this.#filmDetailsPopupComponent.setFavoiteClickHandler(this.#popupFavoriteClickHandler);

    this.#addEventDocument();

    this.#closeButtonComponent.setCloseClickHandler(() => {
      this.#removePopup();
    });
  }

  #popupWatchListeClickHandler = () => {
    const textComment = document.querySelector('.film-details__comment-input').value;
    const emotion = document.querySelector('.film-details__add-emoji-label').dataset.emotion;
    this.#changeData(
      UserAction.ADD_WATCHLIST,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
      textComment,
      emotion
    );
  }

  #popupWatchedClickHandler = () => {
    const textComment = document.querySelector('.film-details__comment-input').value;
    const emotion = document.querySelector('.film-details__add-emoji-label').dataset.emotion;
    this.#changeData(
      UserAction.ADD_HISTORY,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
      textComment,
      emotion
    );
  }

  #popupFavoriteClickHandler = () => {
    const textComment = document.querySelector('.film-details__comment-input').value;
    const emotion = document.querySelector('.film-details__add-emoji-label').dataset.emotion;
    this.#changeData(
      UserAction.ADD_FAVORITES,
      UpdateType.PATCH,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
      textComment,
      emotion
    );
  }

  #handleCommentViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentNewPresenter.setViewState(CommentNewPresenterViewState.SAVING);
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch(err) {
          this.#commentNewPresenter.setViewState(CommentNewPresenterViewState.ABORTING);
        }
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentPresenter.get(update.comment.id).setViewState(CommentPresenterViewState.DELETING);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch(err) {
          this.#commentPresenter.get(update.comment.id).setViewState(CommentPresenterViewState.ABORTING);
        }
        break;
    }
  }

  #handleCommentModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#newCommentData = {};
        this.clearComment();
        this.#renderComments();

        this.#changeData(
          UserAction.UPDATE_FILM,
          UpdateType.MINOR,
          {...update.film}
        );
        break;
      case UpdateType.INIT:
        this.clearComment();
        this.#renderComments();
        break;
      case UpdateType.ERROR:
        this.clearComment();
        this.#renderNoComments();
        break;
    }
  }

  #renderNoComments = () => {
    const siteFilmDetailsCommentsWrapElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    const errorLoadCommentsTemplate = '<h2 style="color: red">Error: Comments not loaded</h2>';
    siteFilmDetailsCommentsWrapElement.innerHTML = errorLoadCommentsTemplate;
  }

  #renderComment = (container, comment) => {
    const commentPresenter = new CommentPresenter(container, this.#handleCommentViewAction);
    commentPresenter.init(comment, this.#film);

    this.#commentPresenter.set(comment.id, commentPresenter);
  }

  #renderComments = () => {
    this.#commentsTitleComponent = new FilmDetailsTitleCommentsView(this.comments);
    this.#commentsComponent = new FilmDetailsCommentView();

    this.comments.forEach((comment) => this.#renderComment(this.#commentsComponent, comment));

    const siteFilmDetailsCommentsWrapElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    siteFilmDetailsCommentsWrapElement.textContent = '';
    siteFilmDetailsCommentsWrapElement.appendChild(this.#commentsTitleComponent.element);
    siteFilmDetailsCommentsWrapElement.appendChild(this.#commentsComponent.element);

    this.#commentNewPresenter = new CommentNewPresenter(siteFilmDetailsCommentsWrapElement, this.#handleCommentViewAction);
    this.#commentNewPresenter.init(this.#newCommentData, this.#film);
  }

  clearComment = () => {
    remove(this.#commentsTitleComponent);
    remove(this.#commentsComponent);
    this.#commentPresenter.forEach((presenter) => presenter.destroy());
    this.#commentPresenter.clear();
    this.#commentNewPresenter.destroy();
  }

  destroy = () => {
    remove(this.#filmDetailsPopupComponent);
    this.clearComment();
  }
}
