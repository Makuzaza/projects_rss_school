import { Component } from './components/Component';
import { Header } from './components/header/Header';
import { WebSocketAPI } from './services/WebSocketAPI';

class SiteWrapperComponent extends Component<'div'> {
  public webSocketAPI: WebSocketAPI;
  constructor() {
    super('div', { className: 'site-wrapper', id: 'siteWrapper' });
    this.webSocketAPI = new WebSocketAPI();
    const headerComponent = new Header(this.webSocketAPI);
    this.appendChildren([headerComponent]);
  }
}

export const SiteWrapper = (): SiteWrapperComponent => new SiteWrapperComponent();
