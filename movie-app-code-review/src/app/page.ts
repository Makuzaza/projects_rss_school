import { main } from '@components/tags';
import { movieService } from '@services/movie.service';

import { BaseComponent } from './components/base-component';
import { Header } from './components/header/header';
import { MovieListPage } from './pages/movie-list';

class PageWrapperComponent extends BaseComponent {
  constructor() {
    super(
      {
        className: 'page-wrapper',
      },
      // Header.bind(null)() is unnecessary, better to use new Header()
      // new Header(),
      Header.bind(null)(),
      // unnecessary code, better to use:
      // main({ className: 'main' }, new MovieListPage(movieService)),
      main.call(null, { className: 'main' }, MovieListPage(movieService)),
    );
  }
}

export const PageWrapper = () => new PageWrapperComponent();
