import AbstractView from './abstract-view';

const createMostCommentedTemplate = () => (
  ` <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
    </section>
  `
);

export default class MostCommentedView extends AbstractView {
  get template() {
    return createMostCommentedTemplate();
  }
}
