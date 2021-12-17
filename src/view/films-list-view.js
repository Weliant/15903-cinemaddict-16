import AbstractView from './abstract-view.js';
import {textMessage} from '../consts.js';

const createFilmsListTemplate = (filter) => {
  const text = textMessage[filter.name.toUpperCase()];

  return `<section class="films-list">
            <h2 class="films-list__title visually-hidden">${text}</h2>
          </section>`;
};

export default class FilmsListView extends AbstractView {
  #filter = null;

  constructor(filter){
    super();
    this.#filter = filter;
  }

  get template() {
    return createFilmsListTemplate(this.#filter);
  }
}
