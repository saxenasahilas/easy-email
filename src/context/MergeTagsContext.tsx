// Packages:
import useConversationManager from '@demo/hooks/useConversationManager';
import React, { createContext, useState } from 'react';
import { CallType, Sender } from './ConversationManagerContext';
import generatePreviewOfTemplate from '@demo/utils/generatePreviewOfTemplate';
import { IEmailTemplate } from 'easy-email-editor';

// Typescript:
export interface MergeTagValues {
  mergeTags: Record<string, string>;
  setMergeTags: (callback: (_mergeTags: Record<string, string>) => Record<string, string>) => Promise<void>;
}

// Constants:
const defaultProvider: MergeTagValues = {
  mergeTags: {},
  setMergeTags: async () => { }
};

// Context:
const MergeTagsContext = createContext(defaultProvider);

// Functions:
const MergeTagsProvider = ({ children }: { children: React.ReactNode; }) => {
  // Constants:
  const {
    acknowledgeAndEndConversation,
    requestTemplateSave,
    internalTemplateData,
  } = useConversationManager();

  // State:
  const [mergeTags, _setMergeTags] = useState<Record<string, string>>({});

  // Functions:
  const setMergeTags = async (callback: (_mergeTags: Record<string, string>) => Record<string, string>) => {
    requestTemplateSave({
      template: internalTemplateData,
      mergeTags,
      preview: await generatePreviewOfTemplate(internalTemplateData as IEmailTemplate, mergeTags),
    }, message => {
      if (
        message.callType === CallType.ACKNOWLEDGEMENT &&
        message.payload &&
        message.sender === Sender.FLUTTER
      ) {
        acknowledgeAndEndConversation(message.conversationID);
        _setMergeTags(callback(mergeTags));
      }
    });
  };

  // Constants:
  const values = {
    mergeTags,
    setMergeTags,
  };

  // Return:
  return <MergeTagsContext.Provider value={values}>{children}</MergeTagsContext.Provider>;
};

// Exports:
export { MergeTagsContext, MergeTagsProvider };
