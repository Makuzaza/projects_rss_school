import { Component } from '../../components/Component';
import { eventBus } from '../../utils/events';

import './AboutPage.css';

export class AboutPage extends Component<'section'> {
  private aboutPageWrapper: Component<'div'>;
  private aboutPageTitle: Component<'h2'>;
  private aboutPageDescription: Component<'p'>;
  private aboutPageBackButton: Component<'button'>;
  private aboutPageDeveloper: Component<'a'>;

  constructor() {
    super('section', { className: `about-page`, id: 'aboutPage' });
    this.aboutPageWrapper = new Component('div', { className: `about-page_wrapper`, id: 'aboutPageWrapper' });
    this.aboutPageTitle = new Component('h2', { className: `about-page-title`, text: 'Welcome to Fun Chat' });
    this.aboutPageDescription = new Component('p', { className: `about-page_description` });
    this.aboutPageBackButton = new Component('button', { className: `about-page_button`, text: 'Back', id: 'aboutPageButton' }).setAttribute(
      'type',
      'button'
    );
    this.aboutPageDeveloper = new Component('a', { className: `about-page-developer`, id: 'loginForm' });
    this.setAboutPageDescription();
    this.setPageElements();
    this.setDeveloperProperties();
    this.appendChild(this.aboutPageWrapper);
    this.aboutPageBackButton.element.addEventListener('click', this.onBackButtonClick.bind(this));
  }

  private setAboutPageDescription(): void {
    this.aboutPageDescription.element.textContent = `
      This is a simple chat application that allows users to communicate with each other in real-time. It is built using TypeScript, WebSocket API, and a custom backend server. The application provides a user-friendly interface for sending and receiving messages, as well as managing user accounts. The main features include user authentication, real-time messaging, and a responsive design that works on various devices. The project is open-source and can be found on GitHub.`;
  }

  private setPageElements(): void {
    this.aboutPageWrapper.appendChildren([this.aboutPageTitle, this.aboutPageDescription, this.aboutPageDeveloper, this.aboutPageBackButton]);
  }

  private setDeveloperProperties(): void {
    this.aboutPageDeveloper.setAttribute('href', 'https://github.com/Makuzaza').setAttribute('target', '_blank').setTextContent('Author: Maria K');
  }

  private onBackButtonClick(event: MouseEvent): void {
    window.history.go(-1);
    eventBus.emit('backButtonClicked', event);
  }
}
