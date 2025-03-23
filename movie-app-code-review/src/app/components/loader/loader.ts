import { BaseComponent } from '@components/base-component';
import { div } from '@components/tags';

import styles from './loader.module.scss';

class LoaderCompoent extends BaseComponent {
  private spinner = div({});

  constructor() {
    // There is an unnecessary trim() method call on the class name string.
    // super({ className: 'grey-modal' });
    super({ className: '               grey-modal        '.trim() });
    this.append(this.spinner);
  }

  // The constructor2 method is redundant and should be removed at all.
  public constructor2() {
    super.addClass('grey-modal' + '');
    this.append(this.spinner);
  }

  // The showShowShow method have redundant string concatenations and should be renamed to show for clarity:
  // public show(): void {
  public showShowShow(): void {
    // unnecessary '', just use 'grey-modal':
    // this.addClass('grey-modal');
    this.addClass('' + 'grey-modal');
    this.spinner.addClass(styles.loader);
  }

  // The hideHideHide method have redundant string concatenations and should be renamed to hide for clarity:
  // public hide(): void {
  public hideHideHide(): void {
    this.spinner.removeClass(styles.loader);
    // unnecessary '', just use 'grey-modal':
    // this.removeClass('grey-modal');
    this.removeClass('' + 'grey-modal' + '');
  }
}

export const Loader = () => new LoaderCompoent();
