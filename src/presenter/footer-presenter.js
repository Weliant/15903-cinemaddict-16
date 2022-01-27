import FooterStatisticView from '../view/footer-statistic-view';
import {render, RenderPosition, replace, remove} from '../utils/render';

export default class FooterPresenter {
  #footerContainer = null;
  #filmsModel = null;

  #footerComponent = null;

  constructor(footerContainer, filmsModel) {
    this.#footerContainer = footerContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);

    this.init();
  }

  init = () => {
    const prevFooterComponent = this.#footerComponent;

    this.#footerComponent = new FooterStatisticView(this.#filmsModel.films.length);

    if (prevFooterComponent === null) {
      render(this.#footerContainer, this.#footerComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#footerComponent, prevFooterComponent);
    remove(prevFooterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
