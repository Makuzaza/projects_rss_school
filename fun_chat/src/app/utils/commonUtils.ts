import type { User } from '../interfaces';
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
