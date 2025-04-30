import { Component } from '../Component';
import './userLine.css';

export class UserLine extends Component<'li'> {
  private userLineName: Component<'span'>;
  private userLineStatus: Component<'span'>;
  public userLineCounter: Component<'span'>;

  constructor(name: string, status: boolean) {
    super('li', { className: `user-line` });
    this.setAttribute('id', `${name}`);
    this.userLineName = new Component('span', { className: `user-line_name`, id: `userLineName_${name}` }).setTextContent(`${name}`);

    this.userLineStatus = new Component('span', { className: `user-line_status`, id: `userLineStatus_${name}` }).setAttribute(
      'data-status',
      `${status}`
    );

    this.userLineCounter = new Component('span', { className: `user-line_counter`, id: `userLineCounter_${name}` });
    this.appendChildren([this.userLineStatus, this.userLineName, this.userLineCounter]);
  }
}
