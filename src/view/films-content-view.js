import AbstractView from './abstract-view';

const createFilmsContentTemplate = () => '<section class="films"></section>';

export default class FilmsContentView extends AbstractView {
  get template() {
    return createFilmsContentTemplate();
  }
}
