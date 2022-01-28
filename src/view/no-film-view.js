import AbstractView from './abstract-view';
import {textMessage} from '../consts';

const createNoFilmTemplate = (filter) => {
  const text = textMessage[filter?.toUpperCase()];

  return `<h2 class="films-list__title visually-hidden">${text}</h2>`;
};

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
}
