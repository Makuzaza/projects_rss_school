import type { User } from '../interfaces';
import type { WebSocketAPI } from '../services/WebSocketAPI';

export class LoginController {
  private webSocketAPI: WebSocketAPI;

  constructor(webSocketAPI: WebSocketAPI) {
    this.webSocketAPI = webSocketAPI;
  }

  public validateUserName(userName: string): boolean {
    // Only letters (any case), minimum 4 characters
    const usernameRegex = /^[a-zA-Z]{4,}$/;
    const isUsernameValid = usernameRegex.test(userName) && userName.length >= 4;
    return isUsernameValid;
  }

  public validatePassword(password: string): boolean {
    // At least 6 characters, must contain at least one letter and one digit
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    const isPasswordValid = passwordRegex.test(password) && password.length >= 6;
    return isPasswordValid;
  }

  public handleFormSubmit(userData: User): void {
    this.webSocketAPI.userAuthentication(userData);
  }
}
