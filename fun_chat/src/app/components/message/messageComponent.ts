import type { MessageData } from '../../interfaces';
import { formatDateTimeFromTimestamp } from '../../utils/commonUtils';
import { eventDeleteMsgBtnClickedBus, eventEditMsgBtnClickedBus } from '../../utils/eventBus';
import { Component } from '../Component';
import './messageComponent.css';

export class MessageComponent extends Component<'div'> {
  public messageContent: Component<'div'>;
  private messageHeader: Component<'div'>;
  private messageHeaderUser: Component<'label'>;
  private messageHeaderDate: Component<'label'>;
  public messageText: Component<'div'>;
  private messageFooter: Component<'div'>;
  private messageFooterStatusWrap: Component<'div'>;
  private messageFooterStatus: Component<'label'>;
  private messageFooterIsEdit: Component<'label'>;
  private editMessageWrap: Component<'div'>;
  private editMessage: Component<'span'>;
  private deleteMessage: Component<'span'>;

  constructor() {
    super('div', { className: `message-container` });

    this.messageContent = new Component('div', { className: `message-content`, id: 'messageContent' });
    this.messageHeader = new Component('div', { className: `message-header`, id: 'messageHeader' });
    this.messageHeaderDate = new Component('label', { className: `message-header_date`, id: 'messageHeaderDate' });
    this.messageHeaderUser = new Component('label', { className: `message-header_user` });
    this.messageText = new Component('div', { className: `message-text` });
    this.messageFooter = new Component('div', { className: `message-footer`, id: 'messageFooter' });
    this.messageFooterStatusWrap = new Component('div', { className: `message-footer-status-wrap`, id: 'messageFooterStatusWrap' });
    this.messageFooterStatus = new Component('label', { className: `message-footer_status`, id: 'messageFooterStatus' });
    this.messageFooterIsEdit = new Component('label', { className: `message-footer_isEdit`, id: 'messageFooterIsEdit' });
    this.editMessageWrap = new Component('div', { className: `edit-message-wrap`, id: 'editMessageWrap' });
    this.editMessage = new Component('span', { className: `edit-message`, id: 'editMessage' });
    this.deleteMessage = new Component('span', { className: `delete-message`, id: 'deleteMessage' });

    this.buildMessageElement();
  }

  private buildMessageElement(): void {
    this.messageHeader.appendChildren([this.messageHeaderUser, this.messageHeaderDate]);
    this.editMessageWrap.appendChildren([this.editMessage, this.deleteMessage]);
    this.messageFooterStatusWrap.appendChildren([this.messageFooterIsEdit, this.messageFooterStatus]);
    this.messageFooter.appendChildren([this.editMessageWrap, this.messageFooterStatusWrap]);
    this.messageContent.appendChildren([this.messageHeader, this.messageText, this.messageFooter]);
    this.appendChild(this.messageContent);
  }

  public setMessageData(options: MessageData, attributeValue: string): void {
    const { text, datetime, status, id } = options;
    const currentUserName = document.getElementById('userInfo')?.textContent;
    let { from } = options;
    if (currentUserName) {
      from = currentUserName === from ? 'You' : from;
    }

    let statusString = '';
    if (attributeValue === 'current') {
      statusString = status.isReaded === true ? 'read' : status.isDelivered === true ? 'delivered' : 'sent';
    }
    if (attributeValue === 'recipient') {
      statusString = status.isEdited === true ? 'edited' : '';
    }
    this.messageText.element.innerText = text;
    this.messageHeaderDate.element.innerText = formatDateTimeFromTimestamp(datetime);
    this.messageFooterStatus.element.innerText = statusString;
    this.messageHeaderUser.element.innerText = from;
    this.messageContent.setAttribute('data-user', `${attributeValue}`);
    this.messageFooterStatus.setAttribute('data-user', `sensing-status`);
    this.setAttribute('id', `${id}`);
    this.messageHeaderUser.setAttribute('id', `messageHeaderUser_${id}`);
    this.messageText.setAttribute('id', `messageText_${id}`);
    this.messageFooterIsEdit.setAttribute('id', `editStatus_${id}`);
    this.editMessageWrap.setAttribute('data-user', `${attributeValue}`);
    this.editMessage.element.addEventListener('click', () => {
      const option = {
        id: this.element.id,
        text: this.messageText.element.textContent || '',
      };
      eventEditMsgBtnClickedBus.emit('editMsgBtnClicked', option);
    });
    this.deleteMessage.element.addEventListener('click', () => {
      eventDeleteMsgBtnClickedBus.emit('deleteMsgBtnClicked', this.element.id);
    });
  }
}
