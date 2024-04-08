// Packages:
import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, set, isEqual } from 'lodash';
import { IEmailTemplate } from 'easy-email-editor';

// Typescript:
export enum ConversationType {
  READY,
  SAVE,
  GET_TEMPLATE,
}

export enum CallType {
  REQUEST,
  RESPONSE,
  ACKNOWLEDGEMENT,
}

export enum Sender {
  FLUTTER,
  REACT,
}

export interface Message {
  conversationID: string;
  conversationType: ConversationType;
  callType: CallType;
  payload: string;
  sender: Sender;
  sentAt: number;
}

export interface ConversationState {
  createdAt: number;
  messages: Message[];
  resendMessageTimeoutID?: number;
  killConversationTimeoutID?: number;
  handlerFunction?: ((message: Message) => void);
}

export interface ConversationManagerValues {
  acknowledgeAndEndConversation: (conversationID: string) => void;
  doesFlutterKnowThatReactIsReady: boolean;
  getTemplate: (callback: (message: Message) => void) => void;
  requestTemplateSave: (payload: any, callback: (message: Message) => void) => void;
  registerEventHandlers: {
    onRequestSave: (callback: (message: Message) => void) => void;
  };
  internalTemplateData?: IEmailTemplate;
  setInternalTemplateData: React.Dispatch<React.SetStateAction<IEmailTemplate | undefined>>;
  sendMessageToFlutter: ({ conversationID, conversationType, callType, payload, sentAt, }: {
    conversationID: string;
    conversationType: ConversationType;
    callType: CallType;
    payload: any;
    sentAt?: number | undefined;
  }) => void;
}

// Constants:
const defaultProvider: ConversationManagerValues = {
  acknowledgeAndEndConversation: () => { },
  doesFlutterKnowThatReactIsReady: false,
  getTemplate: () => { },
  requestTemplateSave: () => { },
  registerEventHandlers: {
    onRequestSave: () => { },
  },
  setInternalTemplateData: () => { },
  sendMessageToFlutter: () => { },
};

// Context:
const ConversationManagerContext = createContext(defaultProvider);

// Functions:
const ConversationManagerProvider = ({ children }: { children: React.ReactNode; }) => {
  // Constants:
  const RESEND_MESSAGE_TIMEOUT = 2000;
  const RESEND_MESSAGE_LIMIT = 5;
  const KILL_CONVERSATION_TIMEOUT = RESEND_MESSAGE_LIMIT * 1000;

  // State:
  const [conversations, setConversations] = useState<Record<string, ConversationState>>({});
  const [doesFlutterKnowThatReactIsReady, setDoesFlutterKnowThatReactIsReady] = useState(false);
  const [eventHandlers, setEventHandlers] = useState({
    onRequestSave: (_message: Message) => { }
  });
  const [internalTemplateData, setInternalTemplateData] = useState<IEmailTemplate>();

  // Functions:
  const addConversation = (conversationID: string, state: ConversationState) => {
    if (typeof conversations[conversationID] !== 'undefined') {
      console.error('[Conversation Manager - React]: Conversation already exists - restarting conversation: ', conversationID);

      endConversation(conversationID);
    }

    const newConversations = cloneDeep(conversations);
    newConversations[conversationID] = state;
    setConversations(newConversations);
  };

  const sendMessageToFlutter = ({
    conversationID,
    conversationType,
    callType,
    payload,
    sentAt,
  }: {
    conversationID: string;
    conversationType: ConversationType;
    callType: CallType;
    payload: any;
    sentAt?: number;
  }) => {
    if (typeof conversations[conversationID] === 'undefined') {
      console.error('[Conversation Manager - React]: Cannot send message as the conversation is already over.');

      return;
    }

    const message: Message = {
      conversationID,
      conversationType,
      callType,
      payload: JSON.stringify(payload),
      sender: Sender.REACT,
      sentAt: sentAt ?? new Date().getTime(),
    };

    window.parent.postMessage(JSON.stringify(message), '*');

    if (
      [
        CallType.REQUEST,
        CallType.RESPONSE,
      ].includes(callType)
    ) {
      initiateResendMessageTimeout(conversationID);
      initiateKillConversationTimeout(conversationID);
    } else if (callType === CallType.ACKNOWLEDGEMENT) {
      endConversation(conversationID);

      return;
    }

    const newConversations = cloneDeep(conversations);
    newConversations[conversationID].messages.push(message);
    setConversations(newConversations);
  };

  const initiateResendMessageTimeout = (conversationID: string) => {
    if (typeof conversations[conversationID] === 'undefined') return;

    const newConversations = cloneDeep(conversations);

    if (conversations[conversationID].resendMessageTimeoutID) clearTimeout(conversations[conversationID].resendMessageTimeoutID);
    const resendMessageTimeoutID = window.setTimeout(() => {
      const lastMessage = {
        ...conversations[conversationID].messages.slice(-1)[0],
        sentAt: new Date().getTime(),
      } as Message;
      window.parent.postMessage(JSON.stringify(lastMessage), '*');
      newConversations[conversationID].messages.push(lastMessage);
      initiateResendMessageTimeout(conversationID);
    }, RESEND_MESSAGE_TIMEOUT);
    newConversations[conversationID].resendMessageTimeoutID = resendMessageTimeoutID;

    setConversations(newConversations);
  };

  const initiateKillConversationTimeout = (conversationID: string) => {
    if (typeof conversations[conversationID] === 'undefined') return;

    const newConversations = cloneDeep(conversations);

    if (newConversations[conversationID].killConversationTimeoutID) clearTimeout(newConversations[conversationID].killConversationTimeoutID);
    const killConversationTimeoutID = window.setTimeout(() => endConversation(conversationID), KILL_CONVERSATION_TIMEOUT);
    newConversations[conversationID].killConversationTimeoutID = killConversationTimeoutID;

    setConversations(newConversations);
  };

  const beginConversation = ({
    conversationType,
    payload,
  }: {
    conversationType: ConversationType;
    payload: any;
  }) => {
    const conversationID = uuidv4();
    const createdAt = new Date().getTime();
    const message: Message = {
      conversationID,
      conversationType,
      callType: CallType.REQUEST,
      payload: JSON.stringify(payload),
      sender: Sender.REACT,
      sentAt: createdAt,
    };

    addConversation(conversationID, {
      createdAt,
      messages: [message],
    });
    sendMessageToFlutter({
      conversationID,
      conversationType,
      callType: CallType.REQUEST,
      payload,
      sentAt: createdAt,
    });

    return message;
  };

  const endConversation = (conversationID: string) => {
    if (typeof conversations[conversationID] === 'undefined') return;

    const newConversations = cloneDeep(conversations);

    clearTimeout(newConversations[conversationID].resendMessageTimeoutID);
    clearTimeout(newConversations[conversationID].killConversationTimeoutID);

    delete newConversations[conversationID];

    setConversations(newConversations);
  };

  const onFlutterMessage = async (event: MessageEvent<any>) => {
    try {
      const message = JSON.parse(event.data) as Message | undefined;
      if (!message || !message.conversationID) {
        throw new Error('Message cannot be deciphered.');
      }

      if (
        !doesFlutterKnowThatReactIsReady &&
        message.callType === CallType.ACKNOWLEDGEMENT &&
        message.conversationType === ConversationType.READY
      ) {
        setDoesFlutterKnowThatReactIsReady(true);
      }

      if (message.callType === CallType.ACKNOWLEDGEMENT) endConversation(message.conversationID);

      if (message.callType === CallType.RESPONSE) {
        const newConversations = cloneDeep(conversations);
        clearTimeout(newConversations[message.conversationID].resendMessageTimeoutID);
        delete newConversations[message.conversationID].resendMessageTimeoutID;
        setConversations(newConversations);

        initiateKillConversationTimeout(message.conversationID);
      }

      if (message.callType === CallType.REQUEST) {
        addConversation(
          message.conversationID,
          {
            createdAt: message.sentAt,
            messages: [message]
          }
        );

        switch (message.conversationType) {
          case ConversationType.SAVE:
            eventHandlers.onRequestSave(message);
            break;
          default:
            break;
        }
      }

      conversations[message.conversationID].handlerFunction?.(message);
    } catch (error) {
      console.error('[Conversation Manager - React]: Encountered an error while reading the message', error);
    }
  };

  // Exposed Functions:
  const announceReadiness = () => beginConversation({
    conversationType: ConversationType.READY,
    payload: ''
  });

  const acknowledgeAndEndConversation = (conversationID: string) => {
    const lastMessage = conversations[conversationID].messages.slice(-1)[0];
    sendMessageToFlutter({
      ...lastMessage,
      conversationID,
      conversationType: lastMessage.conversationType,
      callType: CallType.ACKNOWLEDGEMENT,
      payload: '',
      sentAt: new Date().getTime(),
    });
  };

  const getTemplate = (callback: (message: Message) => void) => {
    const requestMessage = beginConversation({
      conversationType: ConversationType.GET_TEMPLATE,
      payload: ''
    });

    const newConversations = cloneDeep(conversations);
    newConversations[requestMessage.conversationID].handlerFunction = callback;
    setConversations(newConversations);
  };

  const requestTemplateSave = (payload: any, callback: (message: Message) => void) => {
    const requestMessage = beginConversation({
      conversationType: ConversationType.SAVE,
      payload,
    });

    const newConversations = cloneDeep(conversations);
    newConversations[requestMessage.conversationID].handlerFunction = callback;
    setConversations(newConversations);
  };

  const registerEventHandlers = {
    onRequestSave: (callback: (message: Message) => void) => {
      setEventHandlers(_eventHandlers => {
        _eventHandlers['onRequestSave'] = callback;
        return _eventHandlers;
      });
    },
  };

  // Effects:
  useEffect(() => {
    window.addEventListener('message', onFlutterMessage);
    announceReadiness();

    return () => {
      window.removeEventListener('message', onFlutterMessage);
    };
  }, []);

  // Return:
  return (
    <ConversationManagerContext.Provider
      value={{
        acknowledgeAndEndConversation,
        doesFlutterKnowThatReactIsReady,
        getTemplate,
        requestTemplateSave,
        registerEventHandlers,
        internalTemplateData,
        setInternalTemplateData,
        sendMessageToFlutter,
      }}
    >
      {children}
    </ConversationManagerContext.Provider>
  );
};

// Exports:
export { ConversationManagerContext, ConversationManagerProvider };
