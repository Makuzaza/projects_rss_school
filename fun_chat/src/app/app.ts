import type { Component } from './components/Component';

import { SiteWrapper } from './pageConstructor';

class App {
  private siteWrapper: Component<'div'>;
  private root: HTMLElement;
  constructor(siteWrapper: Component<'div'>, root: HTMLElement) {
    this.siteWrapper = siteWrapper;
    this.root = root;
  }

  public start(): void {
    this.root.append(this.siteWrapper.element);
  }
}
const app = new App(SiteWrapper(), document.body);

app.start();
