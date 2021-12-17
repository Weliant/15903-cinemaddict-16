import AbstractView from './abstract-view.js';

const createFooterStatisticTemplate = (count) => (
  `<p>
    ${count} movies inside
  </p>`
);

export default class FooterStatisticView extends AbstractView {
  #count = null;

  constructor(count){
    super();
    this.#count = count;
  }

  get template() {
    return createFooterStatisticTemplate(this.#count);
  }
}
