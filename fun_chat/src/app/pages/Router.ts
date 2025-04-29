import type { Callback } from '../utils/types';

export enum Routes {
  Login = '',
  Chat = '#chat',
  About = '#about',
}

// check route
export function checkRoute(route: string): Routes {
  if (Routes.Login.includes(route)) {
    return Routes.Login;
  }
  if (Routes.Chat.includes(route)) {
    return Routes.Chat;
  }
  if (Routes.About.includes(route)) {
    return Routes.About;
  }
  return Routes.Login;
}

export class Router {
  private setPage: Callback<string>;
  public currentPage: Routes;

  constructor(setPageContent: Callback<string>) {
    this.currentPage = Routes.Login;
    this.setPage = setPageContent;

    window.onhashchange = (): void => {
      this.handleLocation();
    };

    window.onload = (): void => {
      this.handleLocation();
    };
  }

  public handleLocation(): void {
    const route = window.location.hash;
    this.currentPage = checkRoute(route);

    this.setPage(this.currentPage);
  }
}
