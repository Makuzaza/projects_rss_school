import type { User } from '../../interfaces';
import type { WebSocketAPI } from '../../services/WebSocketAPI';
import { isLoggedFromSessionStorage } from '../../utils/commonUtils';
import { eventBus } from '../../utils/events';
import { Component } from '../Component';
import './Header.css';

export class Header extends Component<'header'> {
  private headerContainer: Component<'div'>;
  private headerLogo: Component<'h2'>;
  private buttonsWrap: Component<'div'>;
  private infoButton: Component<'button'>;
  private logOutButton: Component<'button'>;
  private userInfo: Component<'div'>;
  private userName: string | null = null;
  private webSocketAPI: WebSocketAPI;

  constructor(webSocketAPI: WebSocketAPI) {
    super('header', { className: `header`, id: 'header' });
    this.webSocketAPI = webSocketAPI;
    this.headerContainer = new Component('div', { className: `header-container`, id: 'headerContainer' });
    this.appendChild(this.headerContainer);

    this.headerLogo = new Component('h2', { className: `header-logo`, text: 'Fun Chat' });
    this.userInfo = new Component('div', { className: `user-info`, id: 'userInfo' });
    this.buttonsWrap = new Component('div', { className: `buttons-wrap` });

    this.infoButton = new Component('button', {
      className: `button`,
      text: 'About',
      id: 'infoButton',
    }).setAttribute('type', 'button');
    this.logOutButton = new Component('button', {
      className: `button`,
      text: 'Log out',
      id: 'logOutButton',
    })
      .setAttribute('type', 'button')
      .setAttribute('disabled', '');

    this.buttonsWrap.appendChildren([this.infoButton, this.logOutButton]);
    this.headerContainer.appendChildren([this.headerLogo, this.userInfo, this.buttonsWrap]);
    this.infoButton.element.addEventListener('click', this.onAboutBtnClick.bind(this));
    this.logOutButton.element.addEventListener('click', this.onLogoutBtnClick.bind(this));
    eventBus.subscribe('aboutBtnClicked', this.disableAboutBtn.bind(this));
    eventBus.subscribe('successLogin', this.handleSuccessLogin.bind(this));
    eventBus.subscribe('backButtonClicked', this.enableAboutBtn.bind(this));
    this.checkIsUserLogged();
  }

  private setUserNameInHeader(): void {
    const currentUserString = sessionStorage.getItem('user');
    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString);
      this.userName = currentUser.login;
      this.userInfo.element.textContent = `${this.userName}`;
    }
  }

  private checkIsUserLogged(): void {
    if (isLoggedFromSessionStorage()) {
      this.enableLogoutBtn();
    } else {
      this.disableLogoutBtn();
    }
  }

  private onAboutBtnClick(event: MouseEvent): void {
    window.location.hash = '#about';
    eventBus.emit('aboutBtnClicked', event);
  }

  private onLogoutBtnClick(): void {
    this.userInfo.element.textContent = '';
    this.disableLogoutBtn();

    let login;
    let password;

    const currentUserString = sessionStorage.getItem('user');
    if (currentUserString) {
      const user = JSON.parse(currentUserString);
      login = user.login;
      password = user.password;
    }

    if (login && password) {
      this.webSocketAPI.userLogout(login, password);
    }
  }

  private disableAboutBtn(): void {
    this.infoButton.element.setAttribute('disabled', '');
  }

  private enableAboutBtn(): void {
    this.infoButton.element.removeAttribute('disabled');
  }

  private enableLogoutBtn(): void {
    this.logOutButton.element.removeAttribute('disabled');
  }

  private disableLogoutBtn(): void {
    this.logOutButton.element.setAttribute('disabled', '');
  }

  private handleSuccessLogin(): void {
    this.setUserNameInHeader();
    this.enableLogoutBtn();
  }
}
