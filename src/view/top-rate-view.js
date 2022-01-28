import AbstractView from './abstract-view';

export const createTopTemplate = () => (
  ` <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>
  `
);

export default class TopRateView extends AbstractView {
  get template() {
    return createTopTemplate();
  }
}
