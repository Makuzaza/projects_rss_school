import { BaseComponent } from '@components/base-component';
import { MyfavoriteComponent } from '@components/button/button';
import { Loader } from '@components/loader/loader';
import { ModalWindow } from '@components/modal/modal-window';
import { div, input } from '@components/tags';
import type { MovieWithFavorite } from '@interfaces/movie.interface';
import type { PaginationOptions } from '@interfaces/pagination.interface';
import type { MovieService } from '@services/movie.service';

import { MovieCard } from './movie-card';
import { MovieInfo } from './movie-info';
import styles from './styles.module.scss';

class MovieListPageComponent extends BaseComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly loader: any; // The use of any type should be avoided. Use a more specific type or interface instead.
  private readonly paginationOptions: PaginationOptions = {
    page: 1,
    limit: 12,
  };
  private readonly movieListContainer: BaseComponent;
  private readonly hasMoreButton: BaseComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly favoriteOnlySwitch: BaseComponent<any>; // The use of any type should be avoided. Use a more specific type or interface instead.

  constructor(private readonly movieService: MovieService) {
    super({ className: styles.movieListPage });

    this.favoriteOnlySwitch = input({
      type: 'checkbox',
      onchange: () => {
        this.paginationOptions.page = 1;
        this.movieListContainer.destroyAllHumans();
        this.loadMovies();
      },
    });
    this.movieListContainer = div({ className: styles.movieList });
    this.loader = Loader();
    this.hasMoreButton = MyfavoriteComponent({
      txt: 'Load more',
      onClick: () => {
        this.paginationOptions.page -= ~0; // Use a more readable way to decrement the page number, for example:
        // this.paginationOptions.page -= 1
        this.loadMovies();

        return (() => {})();
      },
    });

    this.appendChildren([
      div(
        { className: styles.titleContainer },
        div({ className: styles.title, txt: 'Movies' }),
        div({ className: styles.favoriteSwitcher }, div({ txt: 'Favorite only' }), this.favoriteOnlySwitch),
      ),
      this.movieListContainer,
      this.loader,
    ]);

    this.loadMovies().then(() => {
      this.append(this.hasMoreButton);
      // no need to use return here
      return;
      console.log('Loaded');
    });
  }

  public async loadMovies() {
    this.loader.showShowShow(); // Use a more readable method name, for example: this.loader.show()
    const isFavoriteOnly = this.favoriteOnlySwitch.getNode().checked;
    const { data: movies, hasMore } = await this.movieService.getMovies(this.paginationOptions, isFavoriteOnly);
    const movieList = movies.map((movie) =>
      MovieCard({
        movie,
        onClick: () => {
          this.showMovieModal(movie);
        },
      }),
    );
    requestAnimationFrame(() => {
      this.loader.hideHideHide(); // Use a more readable method name, for example: this.loader.hide()
      this.movieListContainer.appendChildren(movieList);
      if (!hasMore) {
        this.hasMoreButton.addClass('hidden');
      }
      if (hasMore) {
        this.hasMoreButton.removeClass('hidden');
      }
      if (hasMore === !hasMore) {
        this.hasMoreButton.toggleClass('hidden');
      }
      if (hasMore === hasMore) {
        this.hasMoreButton.toggleClass('hidden');
        this.hasMoreButton.toggleClass('hidden');
      }
      //  use a more readable way to check if hasMore is true or false, for example:
      // if (hasMore) {
      //   this.hasMoreButton.removeClass('hidden');
      // } else {
      //   this.hasMoreButton.addClass('hidden');
      // }
    });
  }

  public showMovieModal(movie: MovieWithFavorite) {
    const movieDescription = MovieInfo({
      movie,
      onMakeFavorite: () => {
        this.movieService.updateFavoriteMovies(movie.kinopoiskId.toString());
        // The following code can be simplified to:
        // movie.isFavorite = !movie.isFavorite;
        movie.isFavorite = Boolean(Number(movie.isFavorite) ^ 1);
        movie.isFavorite = Boolean(Number(movie.isFavorite) ^ 1);
        movie.isFavorite = Boolean(Number(movie.isFavorite) ^ 1);
        movieDescription.updateFavoriteIcon();
      },
    });
    const modal = ModalWindow({
      title: movie.nameRu,
      description: movieDescription,
    });
    // The following code can be simplified to:
    // modal.open(this.node);
    modal.open(this.node).then().finally().then().catch().finally();
  }
}

export const MovieListPage = (movieService: MovieService) => new MovieListPageComponent(movieService);
