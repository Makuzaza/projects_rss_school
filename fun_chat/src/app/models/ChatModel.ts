import type { MessageData, MessageDataMap, User } from '../interfaces';
import { eventNewUserAuthBus } from '../utils/eventBus';

export class ChatModel {
  public activeUsers: User[] = [];
  public inactiveUsers: User[] = [];
  public allUsers: User[] = [];
  public currentUser: User | null = null;
  public recipient = '';
  public mode = 'default';

  public messages: Record<string, MessageData[]> = {};

  public setStatus(name: string): boolean {
    return this.activeUsers.some(user => {
      return user.login === name;
    });
  }

  public addMessageToStore(recipient: string, message: MessageData): void {
    if (!this.messages[recipient]) {
      this.messages[recipient] = [];
    }
    this.messages[recipient].push(message);
  }

  public updateActiveUsers(users: User[]): void {
    this.activeUsers = users.filter(user => {
      return user.login !== this.currentUser?.login;
    });
  }

  public updateInactiveUsers(users: User[]): void {
    this.inactiveUsers = users;
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  public updateUserStatusArrays(UserToUpdate: User): void {
    const activeUserIndex = this.activeUsers.findIndex(user => user.login === UserToUpdate.login);
    const inActiveUserIndex = this.inactiveUsers.findIndex(user => user.login === UserToUpdate.login);
    if (activeUserIndex !== -1) {
      this.activeUsers[activeUserIndex].isLogined = UserToUpdate.isLogined;
      this.inactiveUsers.push(...this.activeUsers.splice(activeUserIndex, 1));
    } else if (inActiveUserIndex !== -1) {
      this.inactiveUsers[inActiveUserIndex].isLogined = UserToUpdate.isLogined;
      this.activeUsers.push(...this.inactiveUsers.splice(inActiveUserIndex, 1));
    } else if (activeUserIndex === -1 && inActiveUserIndex === -1) {
      eventNewUserAuthBus.emit('newUserAuth', UserToUpdate);
    }
  }

  public searchUser(userToSearch: string, callback: (users: User[], root: HTMLElement, messageMap?: MessageDataMap) => void): void {
    const asideUsersList = document.getElementById('asideUsersList');

    const users = [...this.activeUsers, ...this.inactiveUsers];
    const filteredUsers = users.filter(user => {
      return user.login.toLowerCase().includes(userToSearch.toLowerCase());
    });

    if (asideUsersList) {
      asideUsersList.innerHTML = '';
      callback(filteredUsers, asideUsersList);
    }
  }
}
