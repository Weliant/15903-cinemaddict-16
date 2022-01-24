import {remove} from '../utils/render.js';
import FilmDetailsPopupView from '../view/film-details-popup-view.js';
import CloseButtonView from '../view/close-button-view.js';
import FilmDetailsPosterView from '../view/film-details-poster-view.js';
import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsTitleCommentsView from '../view/film-details-title-comments-view.js';
import FilmDetailsCommentView from '../view/film-details-comment-view.js';
import FilmDetailsCommentsNewView from '../view/film-details-comments-new-view.js';
import {UserAction, UpdateType, AUTHORIZATION, END_POINT} from '../consts.js';
import CommentsModel from '../model/comments-model.js';
import {getFullDateHumanize} from './../utils/film.js';
import ApiService from '../api-service.js';
import {generateIdComment} from '../mock/comment.js';

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
  #commentsNewComponent = null;
  #commentsModel = null;

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

  #handleCommentViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  #handleCommentModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#newCommentData = {};
        this.clearComment();
        this.#renderComments();
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

  #renderComments = () => {
    this.#commentsTitleComponent = new FilmDetailsTitleCommentsView(this.comments);
    this.#commentsComponent = new FilmDetailsCommentView(this.comments);
    this.#commentsNewComponent = new FilmDetailsCommentsNewView(this.#newCommentData);

    const siteFilmDetailsCommentsWrapElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');
    siteFilmDetailsCommentsWrapElement.textContent = '';
    siteFilmDetailsCommentsWrapElement.appendChild(this.#commentsTitleComponent.element);
    siteFilmDetailsCommentsWrapElement.appendChild(this.#commentsComponent.element);
    siteFilmDetailsCommentsWrapElement.appendChild(this.#commentsNewComponent.element);

    this.#commentsComponent.setDeleteClickHandler((id) => {
      // вызвать запрос удаления комментария
      this.#handleCommentViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        {id}
      );

      this.#film.comments = this.#film.comments.filter((item) => item !== id);

      this.#changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.#film}
      );
    });

    this.#commentsNewComponent.setSendKeydownHandler((comment) => {
      const commentNew = {
        id: generateIdComment(),
        author: 'John Doe',
        date: getFullDateHumanize('2019-05-11T16:12:32.554Z'),
        ...comment
      };

      // вызвать запрос добавления комментария
      this.#handleCommentViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        commentNew
      );

      this.#film.comments.push(commentNew.id);
      this.#changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...this.#film}
      );
    });
  }

  clearComment = () => {
    remove(this.#commentsTitleComponent);
    remove(this.#commentsComponent);
    remove(this.#commentsNewComponent);
  }

  destroy = () => {
    remove(this.#filmDetailsPopupComponent);
    this.clearComment();
  }
}
