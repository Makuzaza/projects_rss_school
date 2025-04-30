import { Component } from '../../components/Component';
import { UserLine } from '../../components/userLine/userLine';
import type { MessageDataMap, User } from '../../interfaces';
import { eventMessageEditBus, eventMessageSentBus, eventSearchInputChangedBus, eventUserSelectedBus } from '../../utils/eventBus';
import './ChatPage.css';

export class ChatPage extends Component<'section'> {
  private aside: Component<'aside'>;
  private contactSearch: Component<'input'>;
  public usersList: Component<'ul'>;
  private dialogContainer: Component<'article'>;
  private dialogHeader: Component<'h3'>;
  private dialogHeaderUserName: Component<'span'>;
  private dialogHeaderUserStatus: Component<'span'>;

  public dialogBody: Component<'div'>;
  private dialogBodyText: Component<'span'>;
  private dialogForm: Component<'form'>;
  public dialogInput: Component<'input'>;
  private dialogFormButton: Component<'button'>;

  constructor() {
    super('section', { className: `chat-page`, id: 'chatPage' });

    this.aside = new Component('aside', { className: `chat-page_aside`, id: 'chatPageAside' });
    this.contactSearch = new Component('input', { className: `aside_contact-search`, id: 'asideContactSearch' });
    this.usersList = new Component('ul', { className: `aside_users-list`, id: 'asideUsersList' });
    this.dialogContainer = new Component('article', { className: `chat-page_dialog`, id: 'chatPageDialog' });
    this.dialogHeader = new Component('h3', { className: `dialog-header`, id: 'dialogHeader' });
    this.dialogHeaderUserName = new Component('span', { className: `dialog-header_user-name`, id: 'dialogUserName' });
    this.dialogHeaderUserStatus = new Component('span', { className: `dialog-header_user-status`, id: 'dialogUserStatus' });
    this.dialogBody = new Component('div', { className: `dialog-body`, id: 'dialogBody' });
    this.dialogBodyText = new Component('span', { className: `dialog-body_text`, id: 'dialogBodyText' });
    this.dialogForm = new Component('form', { className: `dialog-form`, id: 'dialogForm' });
    this.dialogInput = new Component('input', { className: `dialog-input`, id: 'dialogInput' });
    this.dialogFormButton = new Component('button', { className: `dialog-form-button`, text: 'Send', id: 'dialogFormButton' });
    this.handleSearchInputChange();
    this.handleSelectUserToChatWith();
    this.constructPage();
    this.handleDialogueInputChange();
    this.dialogForm.element.addEventListener('submit', this.onFormSubmit.bind(this));
  }

  public handleSearchInputChange(): void {
    this.contactSearch.element.addEventListener('input', () => {
      const searchString = this.contactSearch.element.value.trim();
      eventSearchInputChangedBus.emit('searchInputChanged', searchString);
    });
  }

  public handleDialogueInputChange(): void {
    this.dialogInput.element.addEventListener('input', () => {
      const messageString = this.dialogInput.element.value.trim();
      if (messageString) {
        this.dialogFormButton.element.removeAttribute('disabled');
      } else {
        this.dialogFormButton.element.setAttribute('disabled', '');
      }
    });
  }

  private onFormSubmit(event: Event): void {
    event.preventDefault();
    const message = this.dialogInput.element.value;
    this.dialogInput.element.value = '';
    this.dialogFormButton.element.setAttribute('disabled', '');

    if (this.dialogInput.element.hasAttribute('data-isedited')) {
      this.dialogInput.element.removeAttribute('data-isedited');
      eventMessageEditBus.emit('eventMessageEdit', message);
    } else {
      eventMessageSentBus.emit('eventMessageSent', message);
    }
  }

  public handleSelectUserToChatWith(): void {
    this.usersList.element.addEventListener('click', (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        const selectedUserLineElement = e.target.closest('li');
        if (selectedUserLineElement) {
          const id = selectedUserLineElement.getAttribute('id') || '';
          eventUserSelectedBus.emit('userToChatWithSelected', id);
          this.displaySelectedUserInDialogue(id);
        }
      }
    });
  }

  private displaySelectedUserInDialogue(id: string): void {
    const name = document.getElementById(`userLineName_${id}`)?.innerText;
    const status = document.getElementById(`userLineStatus_${id}`)?.getAttribute('data-status');
    if (name && status) {
      this.setUserInfoToGialogHeader(name, status);
    }
  }

  private setUserInfoToGialogHeader(name: string, status: string): void {
    this.dialogHeaderUserName.element.textContent = name;
    this.dialogHeaderUserStatus.element.textContent = status === 'true' ? 'Online' : 'Offline';
  }

  private constructPage(): void {
    this.dialogFormButton.setAttribute('disabled', '').setAttribute('type', 'submit');
    this.dialogInput.setAttribute('placeholder', 'Enter your message...').setAttribute('disabled', '');
    this.contactSearch.setAttribute('placeholder', 'Search...');
    this.aside.appendChildren([this.contactSearch, this.usersList]);
    this.dialogHeader.appendChildren([this.dialogHeaderUserName, this.dialogHeaderUserStatus]);
    this.dialogForm.appendChildren([this.dialogInput, this.dialogFormButton]);
    this.dialogBody.appendChild(this.dialogBodyText);
    this.dialogContainer.appendChildren([this.dialogHeader, this.dialogBody, this.dialogForm]);
    this.appendChildren([this.aside, this.dialogContainer]);
    this.renderDialogBodyText();
  }

  public renderDialogBodyText(mode = 'default', targetElement: HTMLElement = this.dialogBodyText.element): void {
    const el = targetElement;
    let text;
    switch (mode) {
      case 'userSelected':
        text = 'Enter your first message...';
        break;
      case 'dialogStarted':
        text = '';
        break;
      default:
        text = 'Select a user to send a message...';
        break;
    }
    el.innerText = `${text}`;
  }

  public renderUsers(users: User[], root: HTMLElement, messageMap?: MessageDataMap): void {
    console.log(`messageMap`, messageMap);
    users.forEach(user => {
      const name = user.login;
      const isLogged = user.isLogined || false;

      const userLineElement = new UserLine(name, isLogged);

      if (messageMap && Object.entries(messageMap).length !== 0) {
        Object.entries(messageMap).forEach(([key, value]) => {
          if (key === name) {
            userLineElement.userLineCounter.element.textContent = `${value.length}`;
            userLineElement.userLineCounter.setAttribute('data-visible', 'true');
          }
        });
      }

      root.append(userLineElement.element);
    });
  }

  public drawNewLoggedUser(user: User, root: HTMLElement): void {
    const name = user.login;
    const isLogged = user.isLogined || false;

    if (isLogged === true) {
      console.log(`draw user`, user);
      const userLineElement = new UserLine(name, isLogged);
      root.prepend(userLineElement.element);
    }
  }

  public displayUpdatedStatus(user: User): void {
    const name = user.login;
    const isLogged = user.isLogined || false;
    const statusElement = document.getElementById(`userLineStatus_${name}`);

    if (statusElement) {
      statusElement.setAttribute('data-status', `${isLogged}`);
    }
  }

  public updateStatusInDialogueHeader(user: User): void {
    const isLogged = user.isLogined || false;
    const dialogueStatusElement = document.getElementById(`dialogUserStatus`);
    if (dialogueStatusElement) {
      dialogueStatusElement.innerText = isLogged ? 'online' : 'offline';
    }
  }

  public updateMessageStatus(): void {}
}
