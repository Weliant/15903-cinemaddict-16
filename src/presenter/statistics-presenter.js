import StatisticsView from '../view/statistics-view';
import {render, RenderPosition, replace, remove} from '../utils/render';
import {generateUser} from '../utils/user';

export default class StatisticsPresenter {
  #statisticContainer = null;
  #filmsModel = null;

  #statisticComponent = null;

  constructor(statisticContainer, filmsModel) {
    this.#statisticContainer = statisticContainer;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevStatisticComponent = this.#statisticComponent;
    const user = generateUser(this.#filmsModel.films);

    this.#statisticComponent = new StatisticsView(this.#filmsModel.films, user);

    if (prevStatisticComponent === null) {
      render(this.#statisticContainer, this.#statisticComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#statisticComponent, prevStatisticComponent);
    remove(prevStatisticComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }

  destroy = () => {
    remove(this.#statisticComponent);
  }
}
