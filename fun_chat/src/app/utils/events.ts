import type {
  DeleteResponse,
  EditMsgOption,
  EditResponse,
  EventResponse,
  FetchHistoryResponse,
  MessageReadStatusChange,
  MSGSentServerResponse,
  User,
  UsersResponseData,
} from '../interfaces';

type Listener<T> = (data: T) => void;

class EventBus<T> {
  private listeners: { [key: string]: Listener<T>[] } = {};

  subscribe(eventType: string, listener: Listener<T>): void {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  emit(eventType: string, data: T): void {
    const eventListeners = this.listeners[eventType];
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }
}

export const eventBus = new EventBus<Event>();
export const eventGetUsersBus = new EventBus<UsersResponseData>();
export const eventExternalUserBus = new EventBus<EventResponse>();
export const eventNewUserAuthBus = new EventBus<User>();
export const eventSearchInputChangedBus = new EventBus<string>();
export const eventUserSelectedBus = new EventBus<string>();
export const eventMessageSentBus = new EventBus<string>();
export const eventMSGSentServerResponseBus = new EventBus<MSGSentServerResponse>();
export const eventFetchHistoryBus = new EventBus<FetchHistoryResponse>();
export const eventMessageReadBus = new EventBus<MessageReadStatusChange>();
export const eventDeleteMsgBtnClickedBus = new EventBus<string>();
export const eventDeleteMsgResponseBus = new EventBus<DeleteResponse>();

export const eventEditMsgBtnClickedBus = new EventBus<EditMsgOption>();
export const eventMessageEditBus = new EventBus<string>();
export const eventEditMsgResponseBus = new EventBus<EditResponse>();
