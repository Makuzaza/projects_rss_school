export interface User {
  login: string;
  password?: string;
  id?: string;
  isLogined?: boolean;
}

export interface AuthMessage {
  id: string;
  type: string;
  payload: {
    user: User;
  };
}

export type EditMsgOption = {
  id: string;
  text: string;
};

export interface FetchHistoryRequest {
  id: string;
  type: "MSG_FROM_USER";
  payload: {
    user: {
      login: string;
    };
  };
}

export interface Message {
  id: string;
  type: string;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}

export interface MessageReadStatusChange {
  id: string;
  type: "MSG_READ";
  payload: {
    message: {
      id: string;
      status?: {
        isReaded: boolean;
      };
    };
  };
}

export interface RequestForAllUsers {
  id: string;
  type: string;
  payload: null;
}

export interface MessageData {
  id: string;
  from: string;
  to?: string;
  text: string;
  datetime: number;
  status: {
    isDelivered?: boolean | undefined;
    isReaded?: boolean | undefined;
    isEdited?: boolean | undefined;
  };
}

export interface MSGSentServerResponse {
  id: string;
  type: "MSG_SEND";
  payload: {
    message: {
      id: string;
      from: string;
      to: string;
      text: string;
      datetime: number;
      status: {
        isDelivered?: boolean | undefined;
        isReaded?: boolean | undefined;
        isEdited?: boolean | undefined;
      };
    };
  };
}

export type DeleteResponse = {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
      status: {
        isDeleted: boolean;
      };
    };
  };
};

export type EditResponse = {
  id: string;
  type: "MSG_EDIT";
  payload: {
    message: {
      id: string;
      text: string;
      status: {
        isEdited: boolean;
      };
    };
  };
};

export interface EventResponse {
  id: string;
  type: string;
  payload: {
    user?: { login: string; isLogined: boolean };
    error?: string;
  };
}

export interface FetchHistoryResponse {
  id: string;
  type: "MSG_FROM_USER";
  payload: {
    messages: MessageData[];
  };
}

export interface UsersResponseData {
  id: string;
  type: string;
  payload: {
    users: User[];
  };
}

export type MessageDataMap = {
    [key: string]: MessageData[];
  };