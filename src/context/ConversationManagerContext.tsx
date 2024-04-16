// Packages:
import React, { createContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

  // Functions:
  const addConversation = (conversationID: string, state: ConversationState) => {
    if (typeof conversations[conversationID] !== 'undefined') {
      console.error('[Conversation Manager - React]: Conversation already exists - restarting conversation: ', conversationID);

      endConversation(conversationID);
    }

    setConversations(_conversations => {
      _conversations[conversationID] = state;
      return _conversations;
    });
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

    setConversations(_conversations => {
      _conversations[conversationID].messages.push(message);
      return _conversations;
    });
  };

  const initiateResendMessageTimeout = (conversationID: string) => {
    if (typeof conversations[conversationID] === 'undefined') return;

    if (conversations[conversationID].resendMessageTimeoutID) clearTimeout(conversations[conversationID].resendMessageTimeoutID);
    const resendMessageTimeoutID = window.setTimeout(() => {
      const lastMessage = {
        ...conversations[conversationID].messages.slice(-1)[0],
        sentAt: new Date().getTime(),
      } as Message;
      window.parent.postMessage(JSON.stringify(lastMessage), '*');
      setConversations(_conversations => {
        _conversations[conversationID].messages.push(lastMessage);
        return _conversations;
      });
      initiateResendMessageTimeout(conversationID);
    }, RESEND_MESSAGE_TIMEOUT);

    setConversations(_conversations => {
      _conversations[conversationID].resendMessageTimeoutID = resendMessageTimeoutID;
      return _conversations;
    });
  };

  const initiateKillConversationTimeout = (conversationID: string) => {
    if (typeof conversations[conversationID] === 'undefined') return;

    if (conversations[conversationID].killConversationTimeoutID) clearTimeout(conversations[conversationID].killConversationTimeoutID);
    const killConversationTimeoutID = window.setTimeout(() => endConversation(conversationID), KILL_CONVERSATION_TIMEOUT);

    setConversations(_conversations => {
      _conversations[conversationID].killConversationTimeoutID = killConversationTimeoutID;
      return _conversations;
    });
  };

  const beginConversation = async ({
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

    clearTimeout(conversations[conversationID].resendMessageTimeoutID);
    clearTimeout(conversations[conversationID].killConversationTimeoutID);

    setConversations(_conversations => {
      delete _conversations[conversationID];
      return _conversations;
    });
  };

  const onFlutterMessage = async (event: MessageEvent<any>) => {
    try {
      if (typeof event.data !== 'string') return;
      if (event.data.trim().length === 0) return;
      const message = JSON.parse(event.data) as Message | undefined;

      if (!message || !message.conversationID) {
        throw new Error('Message cannot be deciphered.');
      }

      if (message.sender !== Sender.FLUTTER) return;

      if (
        !doesFlutterKnowThatReactIsReady &&
        message.callType === CallType.ACKNOWLEDGEMENT &&
        message.conversationType === ConversationType.READY
      ) {
        setDoesFlutterKnowThatReactIsReady(true);
      }

      if (message.callType === CallType.ACKNOWLEDGEMENT) endConversation(message.conversationID);

      if (message.callType === CallType.RESPONSE) {
        clearTimeout(conversations[message.conversationID]?.resendMessageTimeoutID);
        setConversations(_conversations => {
          delete _conversations[message.conversationID]?.resendMessageTimeoutID;
          return _conversations;
        });

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

      conversations[message.conversationID]?.handlerFunction?.(message);
    } catch (error) {
      // console.error('[Conversation Manager - React]: Encountered an error while reading the message', error);
    }
  };

  const onReactMessage = async (event: MessageEvent<any>) => {
    try {
      if (typeof event.data !== 'string') return;
      if (event.data.trim().length === 0) return;
      const message = JSON.parse(event.data) as Message | undefined;

      if (!message || !message.conversationID) {
        throw new Error('Message cannot be deciphered.');
      }

      if (message.sender !== Sender.REACT) return;

      if (
        message.conversationType === ConversationType.READY
      ) {
        const newMessage: Message = {
          ...message,
          callType: CallType.ACKNOWLEDGEMENT,
          payload: '',
          sender: Sender.FLUTTER,
          sentAt: new Date().getTime(),
        };

        window.parent.postMessage(JSON.stringify(newMessage), '*');

        console.log('[Conversation Manager - Flutter] Readiness acknowledged.');
      }

      if (
        message.conversationType === ConversationType.GET_TEMPLATE
      ) {
        const newMessage: Message = {
          ...message,
          callType: CallType.RESPONSE,
          payload: JSON.stringify({
            template: {
              title: 'Empty Template',
              summary: 'Nice to meet you!',
              content: `{\"type\":\"page\",\"data\":{\"value\":{\"breakpoint\":\"480px\",\"headAttributes\":\"\",\"font-size\":\"14px\",\"font-weight\":\"400\",\"line-height\":\"1.7\",\"headStyles\":[],\"fonts\":[],\"responsive\":true,\"font-family\":\"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans','Helvetica Neue', sans-serif\",\"text-color\":\"#000000\"}},\"attributes\":{\"background-color\":\"#efeeea\",\"width\":\"600px\"},\"children\":[{\"type\":\"advanced_wrapper\",\"data\":{\"value\":{}},\"attributes\":{\"padding\":\"20px 0px 20px 0px\",\"border\":\"none\",\"direction\":\"ltr\",\"text-align\":\"center\"},\"children\":[{\"type\":\"advanced_text\",\"data\":{\"value\":{\"content\":\"Make it easy for everyone to compose emails!\"}},\"attributes\":{\"padding\":\"10px 25px 10px 25px\",\"align\":\"left\",\"id\":\"alphabet\"},\"children\":[]}]}]}`,
            },
            mergeTags: [],
            blockIDMap: "{\"content.children.[0].children.[0]\":\"alphabet\"}",
            blockIDs: ['alphabet']
          }),
          sender: Sender.FLUTTER,
          sentAt: new Date().getTime(),
        };

        window.parent.postMessage(JSON.stringify(newMessage), '*');

        console.log('[Conversation Manager - Flutter] Template sent.');
      }

      if (
        message.conversationType === ConversationType.SAVE &&
        message.callType === CallType.RESPONSE
      ) {
        const newMessage = {
          ...message,
          callType: CallType.ACKNOWLEDGEMENT,
          payload: '',
          sender: Sender.FLUTTER,
          sentAt: new Date().getTime(),
        };
        window.parent.postMessage(JSON.stringify(newMessage), '*');

        console.log('[Conversation Manager - Flutter] Template received:', message.payload);
        console.log('[Conversation Manager - Flutter] Template saved.');
      }
    } catch (error) {
      // console.error('[Conversation Manager - Flutter]: Encountered an error while reading the message', error);
    }
  };

  // Exposed Functions:
  const announceReadiness = () => {
    console.log('[Conversation Manager - React] Requesting acknowledgement of readiness.');
    beginConversation({
      conversationType: ConversationType.READY,
      payload: ''
    });
  };

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

  const getTemplate = async (callback: (message: Message) => void) => {
    console.log('[Conversation Manager - React] Requesting template.');
    const requestMessage = await beginConversation({
      conversationType: ConversationType.GET_TEMPLATE,
      payload: '',
    });

    setConversations(_conversations => {
      _conversations[requestMessage.conversationID].handlerFunction = callback;
      return _conversations;
    });
  };

  const requestTemplateSave = async (payload: any, callback: (message: Message) => void) => {
    const requestMessage = await beginConversation({
      conversationType: ConversationType.SAVE,
      payload,
    });

    setConversations(_conversations => {
      _conversations[requestMessage.conversationID].handlerFunction = callback;
      return _conversations;
    });
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
    // NOTE: Uncomment the following lines to mock Flutter's responses.
    // window.addEventListener('message', onReactMessage);
    // (window as any).mockFlutterSave = () => {
    //   const message: Message = {
    //     conversationID: uuidv4(),
    //     conversationType: ConversationType.SAVE,
    //     callType: CallType.REQUEST,
    //     payload: '',
    //     sender: Sender.FLUTTER,
    //     sentAt: new Date().getTime(),
    //   };

    //   window.parent.postMessage(JSON.stringify(message), '*');
    // };
    announceReadiness();

    return () => {
      window.removeEventListener('message', onFlutterMessage);
      // window.removeEventListener('message', onReactMessage);
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
        sendMessageToFlutter,
      }}
    >
      {children}
    </ConversationManagerContext.Provider>
  );
};

// Exports:
export { ConversationManagerContext, ConversationManagerProvider };
