import type { AuthMessage, EditMsgOption, FetchHistoryRequest, Message, MessageReadStatusChange, RequestForAllUsers, User } from '../interfaces';
import { generateRandomNumber, getUserIdFromSessionStorage, setSessionStorage, updateSessionStorage } from '../utils/commonUtils';
import {
  eventBus,
  eventGetUsersBus,
  eventExternalUserBus,
  eventMSGSentServerResponseBus,
  eventFetchHistoryBus,
  eventMessageReadBus,
  eventDeleteMsgResponseBus,
  eventEditMsgResponseBus,
} from '../utils/eventBus';

export class WebSocketAPI {
  public ws: WebSocket;
  public errorMessage = '';

  constructor() {
    this.ws = new WebSocket('ws://127.0.0.1:4000');
  }

  public userAuthentication(userData: User): void {
    const authMessage: AuthMessage = {
      id: generateRandomNumber().toString(),
      type: 'USER_LOGIN',
      payload: {
        user: userData,
      },
    };

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(authMessage));
    } else {
      this.ws.addEventListener('open', () => {
        this.ws.send(JSON.stringify(authMessage));
      });
    }

    const currentUser: User = {
      login: authMessage.payload.user.login,
      password: authMessage.payload.user.password,
      isLogined: false,
      id: authMessage.id,
    };
    setSessionStorage(currentUser);
  }

  public userLogout(login: string, password: string): void {
    const message: AuthMessage = {
      id: getUserIdFromSessionStorage(),
      type: 'USER_LOGOUT',
      payload: {
        user: {
          login,
          password,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public sendMessage(messageString: string, sendTo: string): void {
    const message: Message = {
      id: getUserIdFromSessionStorage(),
      type: 'MSG_SEND',
      payload: {
        message: {
          to: sendTo,
          text: messageString,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public fetchMessageHistoryWithUser(login: string): void {
    const message: FetchHistoryRequest = {
      id: getUserIdFromSessionStorage(),
      type: 'MSG_FROM_USER',
      payload: {
        user: {
          login: `${login}`,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public getAllAuthenticatedUsers(): void {
    const message: RequestForAllUsers = {
      id: generateRandomNumber().toString(),
      type: 'USER_ACTIVE',
      payload: null,
    };
    this.ws.send(JSON.stringify(message));
  }

  public getAllUnauthorizedUsers(): void {
    const message: RequestForAllUsers = {
      id: generateRandomNumber().toString(),
      type: 'USER_INACTIVE',
      payload: null,
    };
    this.ws.send(JSON.stringify(message));
  }

  public MessageReadStatusChange(id: string): void {
    const message: MessageReadStatusChange = {
      id: generateRandomNumber().toString(),
      type: 'MSG_READ',
      payload: {
        message: {
          id,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public messageDeletion(msgId: string): void {
    const message: {
      id: string;
      type: string;
      payload: {
        message: {
          id: string;
        };
      };
    } = {
      id: generateRandomNumber().toString(),
      type: 'MSG_DELETE',
      payload: {
        message: {
          id: msgId,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  public MessageTextEditing(option: EditMsgOption): void {
    const message: {
      id: string;
      type: string;
      payload: {
        message: {
          id: string;
          text: string;
        };
      };
    } = {
      id: generateRandomNumber().toString(),
      type: 'MSG_EDIT',
      payload: {
        message: {
          id: option.id,
          text: option.text,
        },
      },
    };
    this.ws.send(JSON.stringify(message));
  }

  private handleMessage(event: MessageEvent): void {
    const responseData = JSON.parse(event.data);
    if (responseData.type === 'ERROR') {
      this.errorMessage = responseData.payload.error;
      eventBus.emit('authError', responseData.payload.error);
    }
    if (responseData.type === 'USER_LOGIN') {
      eventBus.emit('successLogin', responseData);
      window.location.hash = '#chat';
      const { isLogined } = responseData.payload.user;
      updateSessionStorage(isLogined);
    }
    if (responseData.type === 'USER_LOGOUT') {
      sessionStorage.clear();
      window.location.hash = '';
      eventBus.emit('userLoggedOut', responseData);
    }
    if (responseData.type === 'USER_ACTIVE') {
      eventGetUsersBus.emit('USER_ACTIVE_data', responseData);
    }
    if (responseData.type === 'USER_INACTIVE') {
      eventGetUsersBus.emit('USER_INACTIVE_data', responseData);
    }
    if (responseData.type === 'USER_EXTERNAL_LOGIN') {
      eventExternalUserBus.emit('USER_EXTERNAL_LOGIN', responseData);
    }
    if (responseData.type === 'USER_EXTERNAL_LOGOUT') {
      eventExternalUserBus.emit('USER_EXTERNAL_LOGOUT', responseData);
    }
    this.handleResponseMessage(event);
  }

  private handleResponseMessage(event: MessageEvent): void {
    const responseData = JSON.parse(event.data);
    if (responseData.type === 'MSG_SEND') {
      eventMSGSentServerResponseBus.emit('MSG_SEND', responseData);
    }
    if (responseData.type === 'MSG_FROM_USER') {
      eventFetchHistoryBus.emit('MSG_FROM_USER_Fetched', responseData);
    }
    if (responseData.type === 'MSG_READ') {
      eventMessageReadBus.emit('MSG_READ', responseData);
    }
    if (responseData.type === 'MSG_DELETE') {
      eventDeleteMsgResponseBus.emit('MSG_DELETE', responseData);
    }
    if (responseData.type === 'MSG_EDIT') {
      eventEditMsgResponseBus.emit('MSG_EDIT_response', responseData);
    }
  }

  public start(): void {
    this.ws.addEventListener('message', this.handleMessage.bind(this));
  }
}
