import {render, RenderPosition, remove, replace} from '../utils/render.js';
import FilmCardView from '../view/film-card-view.js';
import FilmDetailsPopupView from '../view/film-details-popup-view.js';
import CloseButtonView from '../view/close-button-view.js';
import FilmDetailsPosterView from '../view/film-details-poster-view.js';
import FilmDetailsInfoView from '../view/film-details-info-view.js';
import FilmDetailsTitleCommentsView from '../view/film-details-title-comments-view.js';
import FilmDetailsCommentView from '../view/film-details-comment-view.js';
import FilmDetailsCommentsNewView from '../view/film-details-comments-new-view.js';
import {UserAction, UpdateType} from '../consts.js';
import CommentsModel from '../model/comments-model.js';
import {generateComment, generateIdComment} from '../mock/comment.js';

export default class MoviePresenter {
  #filmListContainer = null;
  #filmComponent = null;
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

  constructor(filmListContainer, changeData, addEventDocument, removePopup) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#addEventDocument = addEventDocument;
    this.#removePopup = removePopup;
  }

  get comments() {
    return this.#commentsModel.comments;
  }

  init = (film, isUpdate = false, container = '', commentsStore = null) => {
    this.#film = film;

    this.#filmDetailsPopupContainerComponent = this.#bodyElement.querySelector('.film-details');

    const selectorPopup = `.film-details__inner[data-id="${this.#film.id}"]`;
    const filmsPopup = this.#filmDetailsPopupContainerComponent.querySelector(selectorPopup);

    if (commentsStore) {
      this.#newCommentData = commentsStore;
    }

    if (isUpdate) {
      const selectorCard = `.film-card[data-id="${this.#film.id}"]`;
      const filmCard = container.element.querySelector(selectorCard);

      if (filmCard.dataset.id === this.#film.id) {

        this.#createNewFilmComponent();

        const el = filmCard;
        replace(this.#filmComponent, el);
      }
    } else {
      this.#createNewFilmComponent();
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
    }

    if (filmsPopup?.dataset.id === this.#film.id) {
      this.#openPopupClickHandler();
    }
  }

  updateInfo = (film, container = '') => {
    this.#film = film;

    const selectorCard = `.film-card[data-id="${this.#film.id}"]`;
    const filmCard = container.element.querySelector(selectorCard);

    if (filmCard.dataset.id === this.#film.id) {

      this.#createNewFilmComponent();

      const el = filmCard;
      replace(this.#filmComponent, el);
    }
  }

  #createNewFilmComponent = () => {
    this.#filmComponent = new FilmCardView(this.#film);

    this.#filmComponent.setOpenClickHandler(this.#openPopupClickHandler);
    this.#filmComponent.setWatchListClickHandler(this.#watchListeClickHandler);
    this.#filmComponent.setWatchedClickHandler(this.#watchedClickHandler);
    this.#filmComponent.setFavoiteClickHandler(this.#favoriteClickHandler);
  }

  #watchListeClickHandler = () => {
    this.#changeData(
      UserAction.ADD_WATCHLIST,
      UpdateType.MICRO,
      {...this.#film, userDetails: {...this.#film.userDetails, watchlist: !this.#film.userDetails.watchlist}},
    );
  }

  #watchedClickHandler = () => {
    this.#changeData(
      UserAction.ADD_HISTORY,
      UpdateType.MICRO,
      {...this.#film, userDetails: {...this.#film.userDetails, alreadyWatched: !this.#film.userDetails.alreadyWatched}},
    );
  }

  #favoriteClickHandler = () => {
    this.#changeData(
      UserAction.ADD_FAVORITES,
      UpdateType.MICRO,
      {...this.#film, userDetails: {...this.#film.userDetails, favorite: !this.#film.userDetails.favorite}},
    );
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

  #handleCommentModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#newCommentData = {};
        this.clearPopup();
        this.#renderComments();
        break;
    }
  }

  #renderComments = () => {
    this.#commentsTitleComponent = new FilmDetailsTitleCommentsView(this.comments);
    this.#commentsComponent = new FilmDetailsCommentView(this.comments);
    this.#commentsNewComponent = new FilmDetailsCommentsNewView(this.#newCommentData);

    const siteFilmDetailsCommentsWrapElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__comments-wrap');

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
        UpdateType.MICRO,
        {...this.#film}
      );
    });

    this.#commentsNewComponent.setSendKeydownHandler((comment) => {
      const commentNew = {
        id: generateIdComment(),
        author: 'John Doe',
        date: '2019-05-11T16:12:32.554Z',
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
        UpdateType.MICRO,
        {...this.#film}
      );
    });
  }

  #openPopupClickHandler = () => {
    this.#removePopup();

    this.#changeData(
      UserAction.OPEN_FILM_CARD,
      UpdateType.MICRO,
      {...this.#film},
    );

    this.#commentsModel = new CommentsModel();

    this.#film.comments.forEach((item) => {
      const objComment = generateComment();
      const objFullComment = {
        id: item,
        ...objComment
      };
      this.#commentsModel.comments.push(objFullComment);
    });

    this.#commentsModel.addObserver(this.#handleCommentModelEvent);

    this.#filmDetailsPopupComponent = new FilmDetailsPopupView(this.#film);
    this.#closeButtonComponent = new CloseButtonView();
    this.#filmDetailsPopupContainerComponent.appendChild(this.#filmDetailsPopupComponent.element);

    const siteFilmDetailsElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__info-wrap');
    const buttonCloseElement = this.#filmDetailsPopupComponent.element.querySelector('.film-details__close');

    siteFilmDetailsElement.appendChild(new FilmDetailsPosterView(this.#film).element);
    siteFilmDetailsElement.appendChild(new FilmDetailsInfoView(this.#film).element);
    buttonCloseElement.appendChild(this.#closeButtonComponent.element);

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

  clearPopup = () => {
    remove(this.#commentsTitleComponent);
    remove(this.#commentsComponent);
    remove(this.#commentsNewComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmDetailsPopupComponent);
    this.clearPopup();
  }
}
