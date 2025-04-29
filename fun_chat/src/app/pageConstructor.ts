import { Component } from './components/Component';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { WebSocketAPI } from './services/WebSocketAPI';
import { MainContent } from './pages/mainContent/MainContent';

class SiteWrapperComponent extends Component<'div'> {
  public webSocketAPI: WebSocketAPI;
  constructor() {
    super('div', { className: 'site-wrapper', id: 'siteWrapper' });
    this.webSocketAPI = new WebSocketAPI();
    const headerComponent = new Header(this.webSocketAPI);
    const mainComponent = new MainContent(this.webSocketAPI);
    const footerComponent = new Footer();
    this.appendChildren([headerComponent, mainComponent, footerComponent]);
  }
}

export const SiteWrapper = (): SiteWrapperComponent => new SiteWrapperComponent();
