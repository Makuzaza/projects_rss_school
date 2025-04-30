import type { MessageData, MSGSentServerResponse, User } from '../interfaces';
import type { ConstructorOf } from './types';

export function isSome<T>(value: unknown): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function isInstanceOf<T>(elemType: ConstructorOf<T>, value: unknown): value is T {
  return value instanceof elemType;
}

export function isHTMLElementTag<Tag extends keyof HTMLElementTagNameMap>(value: unknown): value is Tag {
  return typeof value === 'string';
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 10000) + 1;
}

export function setSessionStorage(user: User): void {
  const userString = JSON.stringify(user);
  sessionStorage.setItem('user', userString);
}

export function updateSessionStorage(isLogged: boolean): void {
  const currentUserString = sessionStorage.getItem('user');
  if (currentUserString) {
    const currentUser: User = JSON.parse(currentUserString);
    currentUser.isLogined = isLogged;
    setSessionStorage(currentUser);
  }
}

export function getUserIdFromSessionStorage(): string {
  const userString = sessionStorage.getItem('user') || '';
  const currentUser: User = JSON.parse(userString);
  return currentUser.id || '';
}

export function isLoggedFromSessionStorage(): boolean {
  const userString = sessionStorage.getItem('user') || '';
  if (userString) {
    const currentUser: User = JSON.parse(userString);
    return currentUser.isLogined || false;
  }
  return false;
}

export function setUserNameInHeader(): string {
  const currentUserString = sessionStorage.getItem('user');
  let userName;
  if (currentUserString) {
    const currentUser: User = JSON.parse(currentUserString);
    userName = currentUser.login;
  }
  return userName || '';
}

export function getUserFromSessionStorage(): User | null {
  const userString = sessionStorage.getItem('user');
  if (!userString) {
    return null;
  }
  return JSON.parse(userString);
}

export function formatDateTimeFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
}

export function scrollToNewMessage(container: HTMLElement, messageBlock: HTMLElement): void {
  const dialogBody = container;

  const containerHeight = dialogBody.clientHeight;
  const windowHeight = window.innerHeight;

  if (dialogBody.scrollHeight <= windowHeight) {
    dialogBody.scrollTop = dialogBody.scrollHeight;
  } else {
    const newMessageHeight = messageBlock.offsetHeight;
    const newScrollTop = dialogBody.scrollHeight - containerHeight + newMessageHeight;

    dialogBody.scrollTop = newScrollTop;
  }
}

export function setOptions(responseData: MSGSentServerResponse): MessageData {
  const { id } = responseData.payload.message;
  const { datetime } = responseData.payload.message;
  const { text } = responseData.payload.message;
  const { from } = responseData.payload.message;
  const { to } = responseData.payload.message;
  const { status } = responseData.payload.message;

  const options = { datetime, status, text, from, to, id };
  return options;
}
