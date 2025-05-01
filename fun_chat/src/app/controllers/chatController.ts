import { MessageComponent } from '../components/message/messageComponent';
import type {
  DeleteResponse,
  EditMsgOption,
  EditResponse,
  EventResponse,
  FetchHistoryResponse,
  MessageDataMap,
  MessageReadStatusChange,
  MSGSentServerResponse,
  User,
} from '../interfaces';
import { ChatModel } from '../models/ChatModel';
import type { ChatPage } from '../pages/chatPage/ChatPage';
import type { WebSocketAPI } from '../services/WebSocketAPI';
import { getUserFromSessionStorage, scrollToNewMessage, setOptions } from '../utils/commonUtils';
import {
  eventGetUsersBus,
  eventExternalUserBus,
  eventNewUserAuthBus,
  eventBus,
  eventSearchInputChangedBus,
  eventUserSelectedBus,
  eventMessageSentBus,
  eventFetchHistoryBus,
  eventMSGSentServerResponseBus,
  eventMessageReadBus,
  eventDeleteMsgBtnClickedBus,
  eventDeleteMsgResponseBus,
  eventEditMsgBtnClickedBus,
  eventMessageEditBus,
  eventEditMsgResponseBus,
} from '../utils/events';

export class ChatController {
  public chatModel: ChatModel;
  private webSocketAPI: WebSocketAPI;
  public chatPage: ChatPage;
  private messageMap: MessageDataMap;
  private messageToEditId = '';

  constructor(webSocketAPI: WebSocketAPI, chatPage: ChatPage) {
    this.webSocketAPI = webSocketAPI;
    this.chatPage = chatPage;
    this.chatModel = new ChatModel();
    this.messageMap = {};

    this.addSubscriptions();
  }

  private addSubscriptions(): void {
    eventGetUsersBus.subscribe('USER_ACTIVE_data', responseData => {
      this.chatModel.updateActiveUsers(responseData.payload.users);
      const asideUsersList = document.getElementById('asideUsersList');
      if (asideUsersList) {
        this.chatPage.renderUsers(this.chatModel.activeUsers, asideUsersList, this.messageMap);
      }
    });
    eventGetUsersBus.subscribe('USER_INACTIVE_data', responseData => {
      this.chatModel.updateInactiveUsers(responseData.payload.users);
      const asideUsersList = document.getElementById('asideUsersList');
      if (asideUsersList) {
        this.chatPage.renderUsers(this.chatModel.inactiveUsers, asideUsersList, this.messageMap);
      }
    });
    eventExternalUserBus.subscribe('USER_EXTERNAL_LOGIN', this.handleUSER_EXTERNAL_LOG_IN_OUT.bind(this));
    eventExternalUserBus.subscribe('USER_EXTERNAL_LOGOUT', this.handleUSER_EXTERNAL_LOG_IN_OUT.bind(this));
    eventNewUserAuthBus.subscribe('newUserAuth', this.callDrawNewUser.bind(this));
    eventBus.subscribe('successLogin', this.setCurUser.bind(this));
    eventSearchInputChangedBus.subscribe('searchInputChanged', this.callSearchHandler.bind(this));
    eventUserSelectedBus.subscribe('userToChatWithSelected', this.userToChatWithSelectedHandler.bind(this));
    eventMessageSentBus.subscribe('eventMessageSent', this.messageSentHandler.bind(this));
    eventMSGSentServerResponseBus.subscribe('MSG_SEND', this.messageSentFromServerHandler.bind(this));
    eventFetchHistoryBus.subscribe('MSG_FROM_USER_Fetched', this.historyFetchedHandler.bind(this));
    eventMessageReadBus.subscribe('MSG_READ', this.messageReadHandler.bind(this));
    eventDeleteMsgBtnClickedBus.subscribe('deleteMsgBtnClicked', this.deleteMsgHandler.bind(this));
    eventDeleteMsgResponseBus.subscribe('MSG_DELETE', this.deleteMsgResponseHandler.bind(this));
    eventEditMsgBtnClickedBus.subscribe('editMsgBtnClicked', this.editMsgHandler.bind(this));
    eventMessageEditBus.subscribe('eventMessageEdit', this.editedMsgTextHandler.bind(this));
    eventEditMsgResponseBus.subscribe('MSG_EDIT_response', this.editMsgResponseHandler.bind(this));
  }

  private editMsgHandler(option: EditMsgOption): void {
    const oldText = option.text;
    const input = document.getElementById('dialogInput');
    const button = document.getElementById('dialogFormButton');

    if (button) {
      button.removeAttribute('disabled');
    }

    if (input && input instanceof HTMLInputElement) {
      input.setAttribute('data-isedited', 'true');
      input.focus();
      input.value = oldText;
      this.messageToEditId = option.id;
    }
  }

  private editedMsgTextHandler(message: string): void {
    const option = {
      id: this.messageToEditId,
      text: message,
    };
    this.webSocketAPI.MessageTextEditing(option);
  }

  private editMsgResponseHandler(response: EditResponse): void {
    const { isEdited } = response.payload.message.status;
    const { id } = response.payload.message;
    const { text } = response.payload.message;
    const messageContainer = document.getElementById(`${id}`);
    const messageTextEl = document.getElementById(`messageText_${id}`);
    const messageFooterEditStatusEl = document.getElementById(`editStatus_${id}`);
    const messageHeaderUser = document.getElementById(`messageHeaderUser_${id}`)?.innerText;

    if (isEdited && messageContainer && messageTextEl && messageFooterEditStatusEl && messageHeaderUser) {
      messageTextEl.textContent = text;
      messageFooterEditStatusEl.textContent = isEdited === true ? 'edited' : '';
    }
  }

  private messageReadHandler(data: MessageReadStatusChange): void {
    // console.log(data);
  }

  private deleteMsgHandler(msgId: string): void {
    // console.log(`deleteMessage`, msgId);
    this.webSocketAPI.messageDeletion(msgId);
  }

  private deleteMsgResponseHandler(response: DeleteResponse): void {
    const deletedMessageId = response.payload.message.id;
    const { isDeleted } = response.payload.message.status;
    if (isDeleted) {
      this.deleteMessageFromPage(deletedMessageId);
    }
  }

  private deleteMessageFromPage(msgId: string): void {
    const messageElement = document.getElementById(msgId);
    if (messageElement) {
      messageElement.style.opacity = '0';
      setTimeout(() => {
        messageElement.remove();
      }, 1500);
    }
  }

  private handleUSER_EXTERNAL_LOG_IN_OUT(responseData: EventResponse): void {
    const { user } = responseData.payload;
    if (user) {
      this.chatPage.displayUpdatedStatus(user);
      this.chatModel.updateUserStatusArrays(user);
    }
    if (user && this.chatModel.recipient === user.login) {
      this.chatPage.updateStatusInDialogueHeader(user);
    }
    if (responseData.type === 'USER_EXTERNAL_LOGIN') {
      Array.from(document.querySelectorAll('label[data-user="sensing-status"]')).forEach(label => {
        const el = label;
        el.textContent = 'delivered';
      });
    }
  }

  private messageSentFromServerHandler(responseData: MSGSentServerResponse): void {
    const options = setOptions(responseData);
    const dialogueOpenWith = document.getElementById('dialogUserName')?.innerText;
    const dialogBody = document.getElementById('dialogBody');
    const messageBlock = new MessageComponent();
    if (
      dialogBody &&
      this.chatModel.mode === 'dialogStarted' &&
      this.chatModel.currentUser?.login === options.to &&
      dialogueOpenWith === options.from
    ) {
      messageBlock.setMessageData(options, 'recipient');
      dialogBody.prepend(messageBlock.element);
      scrollToNewMessage(dialogBody, messageBlock.element);
    }

    if (dialogBody && this.chatModel.currentUser?.login === options.from && dialogueOpenWith === options.to) {
      const el = document.getElementById('dialogBodyText');
      this.chatModel.mode = 'dialogStarted';
      if (el) {
        this.chatPage.renderDialogBodyText(this.chatModel.mode, el);
      }

      messageBlock.setMessageData(options, 'current');
      dialogBody.prepend(messageBlock.element);
      scrollToNewMessage(dialogBody, messageBlock.element);
    }
  }

  private messageSentHandler(message: string): void {
    this.webSocketAPI.sendMessage(message, this.chatModel.recipient);
  }

  private historyFetchedHandler(data: FetchHistoryResponse): void {
    const { length } = data.payload.messages;
    const { messages } = data.payload;
    const dialogBody = document.getElementById('dialogBody');
    if (dialogBody) {
      dialogBody.innerHTML = '';
    }
    if (length) {
      this.chatModel.mode = 'dialogStarted';
      const el = document.getElementById('dialogBodyText');

      if (el) {
        this.chatPage.renderDialogBodyText(this.chatModel.mode, el);
      }

      messages.forEach(item => {
        const { id } = item;
        const { datetime } = item;
        const { text } = item;
        let { from } = item;
        const { status } = item;
        const attributeValue = this.chatModel.currentUser?.login === from ? 'current' : 'recipient';
        from = this.chatModel.currentUser?.login === from ? 'You' : from;
        const options = { datetime, status, text, from, id };
        const messageBlock = new MessageComponent();
        messageBlock.setMessageData(options, attributeValue);

        if (dialogBody) {
          dialogBody.prepend(messageBlock.element);

          dialogBody.scrollTop = dialogBody.scrollHeight;
        }
      });
    } else {
      this.absenceMesageHistory(this.chatModel.recipient);
    }
  }

  private absenceMesageHistory(user: string): void {
    const dialogBody = document.getElementById('dialogBody');
    if (dialogBody) {
      dialogBody.innerHTML = '';
    }
    this.chatModel.mode = 'dialogStarted';
    const el = document.getElementById('dialogBodyText');
    if (el) {
      this.chatPage.renderDialogBodyText(this.chatModel.mode, el);
    }
  
    const beginningMessage = document.createElement('div');
    beginningMessage.className = 'beginning-message';
    beginningMessage.textContent = `Start conversation with ${user}`;
    beginningMessage.id = 'beginning-of-dialogue';
  
    if (dialogBody) {
      dialogBody.appendChild(beginningMessage);
      dialogBody.scrollTop = dialogBody.scrollHeight;
    }
  
    const dialogInput = document.getElementById('dialogInput');
    if (dialogInput) {
      dialogInput.addEventListener('input', () => {
        const message = document.getElementById('beginning-of-dialogue');
        if (message) {
          message.remove();
        }
      }, { once: true });
    }
  }

  private userToChatWithSelectedHandler(id: string): void {
    this.chatModel.recipient = id;
    const spanText = document.getElementById('dialogBodyText');
    const dialogInput = document.getElementById('dialogInput');
    this.chatModel.mode = 'userSelected';
    this.webSocketAPI.fetchMessageHistoryWithUser(id);
    if (spanText) {
      this.chatPage.renderDialogBodyText(this.chatModel.mode, spanText);
    }
    if (dialogInput) {
      dialogInput.removeAttribute('disabled');
    }
  }

  private callSearchHandler(searchString: string): void {
    this.chatModel.searchUser(searchString, this.chatPage.renderUsers);
  }

  private callDrawNewUser(UserToUpdate: User): void {
    if (UserToUpdate.login !== this.chatModel.currentUser?.login) {
      const asideUsersList = document.getElementById('asideUsersList');
      if (this.chatModel.activeUsers.includes(UserToUpdate) && this.chatModel.inactiveUsers.includes(UserToUpdate)) {
        return;
      }
      if (asideUsersList) {
        this.chatPage.drawNewLoggedUser(UserToUpdate, asideUsersList);
      }
    }
  }

  private setUnreadMessages(): void {
    this.chatModel.activeUsers.forEach(user => {
      this.webSocketAPI.fetchMessageHistoryWithUser(user.login);
    });
    this.chatModel.inactiveUsers.forEach(user => {
      this.webSocketAPI.fetchMessageHistoryWithUser(user.login);
    });
  }

  private setCurUser(): void {
    const user = getUserFromSessionStorage();

    if (user) {
      this.chatModel.setCurrentUser(user);
      this.setUnreadMessages();
    }
  }

  public start(): void {
    this.setCurUser();
    this.webSocketAPI.start();
  }
}
