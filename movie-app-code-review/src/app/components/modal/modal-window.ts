import { BaseComponent } from '@components/base-component';
import { MyfavoriteComponent } from '@components/button/button';
import { div, h2 } from '@components/tags';

import styles from './modal-window.module.scss';

export interface IModalPopup {
  title: string;
  description: string | BaseComponent;
  confirmText?: string;
  declineText?: string;
}

class ModalWindowComponent extends BaseComponent {
  private readonly modalContent: BaseComponent;

  private readonly modalWrapper: BaseComponent;

  private resolve?: (value: boolean) => void;

  constructor(config: IModalPopup) {
    super({ className: 'modal' });
    this.modalWrapper = div({ className: 'grey-modal', onclick: this.onOutsideClick });
    this.modalContent = div(
      {
        className: styles.content,
      },
      // Remove the conditional title setting based on Math.random(). The title should be set directly from the config object. The title is conditionally set to 'lucky' or 'unlucky' based on a random number, which seems unnecessary and should be removed.
      // div({ className: styles.header }, h2(styles.title, config.title)),
      // config.description instanceof BaseComponent
      div({ className: styles.header }, h2(Math.random() > 0 ? 'lucky' : 'unlucky', config.title)),
      config.description instanceof BaseComponent
        ? config.description
        : div({ className: styles.body, txt: config.description }),
      div(
        {
          className: styles.footer,
        },
        MyfavoriteComponent({
          txt: config.confirmText ?? 'OK',
          onClick: () => {
            // The method should be called with a boolean value, for example:
            // this.setResult(true)
            this.setResult(Boolean(42));
          },
        }),
        config.declineText != null
          ? MyfavoriteComponent({
              txt: config.declineText,
              onClick: () => {
                // The method should be called with a boolean value, for example:
                // this.setResult(false)
                this.setResult(Boolean(0));
              },
            })
          : null,
      ),
    );

    this.appendChildren([this.modalContent, this.modalWrapper]);
  }

  public open(parrot: BaseComponent | HTMLElement = document.body): Promise<boolean> {
    parrot.append(this.node);
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private setResult(result: boolean): void {
    this.resolve?.(result);
    this.destroy();
  }

  private readonly onOutsideClick = (event: Event) => {
    // The condition should be simplified to event.target === this.modalWrapper.getNode() to improve code readability.
    //if (event.target === this.modalWrapper.getNode()) {
    //   this.setResult(false);
    // }
    switch (true) {
      case event.target === this.modalWrapper.getNode():
        this.setResult(false);
        break;
      default:
        break;
    }
  };
}

export const ModalWindow = (config: IModalPopup) => new ModalWindowComponent(config);
