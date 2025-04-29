import { AboutPage } from '../aboutPage/AboutPage';
import { LoginPage } from '../loginPage/LoginPage';
import { Router } from '../Router';
import { Component } from '../../components/Component';
import './MainContent.css';
import { getUserFromSessionStorage, isLoggedFromSessionStorage, setUserNameInHeader } from '../../utils/commonUtils';
import type { WebSocketAPI } from '../../services/WebSocketAPI';
import type { AuthMessage, User } from '../../interfaces';


export class MainContent extends Component<'main'> {
  private router: Router;
  private loginPage: LoginPage;
  private aboutPage: AboutPage;
  public webSocketAPI: WebSocketAPI;

  constructor(webSocketAPI: WebSocketAPI) {
    super('main', { className: `main`, id: 'main' });
    this.webSocketAPI = webSocketAPI;
    this.loginPage = new LoginPage(this.webSocketAPI);
    this.aboutPage = new AboutPage();


    this.appendChild(this.loginPage);
    this.router = new Router(this.setPageContent.bind(this));
    console.log(this.router);
    window.addEventListener('unload', () => {
      this.setPageContent();
    });

  }

  private setPageContent(): void {
    const location = window.location.hash;

    if (!isLoggedFromSessionStorage()) {
      if (location === '#chat') {
        window.location.hash = '';
      }
    }

    if (isLoggedFromSessionStorage()) {
      const userInfo = document.getElementById('userInfo');
      const currUser = getUserFromSessionStorage();
      if (userInfo) {
        userInfo.textContent = `${setUserNameInHeader()}`;
      }
      if (currUser) {
        this.reLogUser(currUser);
      }
    }

    if (location === '') {
      this.drawLoginPage();
    } else if (location === '#about') {
      this.drawAboutPage();
    }
  }

  private reLogUser(currUser: User): void {
    const authMessage: AuthMessage = {
      id: currUser.id || '',
      type: 'USER_LOGIN',
      payload: {
        user: {
          login: currUser.login,
          password: currUser.password,
        },
      },
    };
    if (this.webSocketAPI.ws.readyState === WebSocket.OPEN) {
      this.webSocketAPI.ws.send(JSON.stringify(authMessage));
    } else {
      this.webSocketAPI.ws.addEventListener('open', () => {
        this.webSocketAPI.ws.send(JSON.stringify(authMessage));
      });
    }
  }

  private drawAboutPage(): void {
    this.destroyChildren();
    this.aboutPage = new AboutPage();
    this.appendChild(this.aboutPage);
  }

  private drawLoginPage(): void {
    this.destroyChildren();
    this.loginPage = new LoginPage(this.webSocketAPI);
    this.appendChild(this.loginPage);
  }
}
