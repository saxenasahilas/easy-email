// Packages:
import useConversationManager from '@demo/hooks/useConversationManager';
import React, { createContext, useState } from 'react';

// Typescript:
export interface MergeTagValues {
  mergeTags: Record<string, string>;
  setMergeTags: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

// Constants:
const defaultProvider: MergeTagValues = {
  mergeTags: {},
  setMergeTags: () => { }
};

// Context:
const MergeTagsContext = createContext(defaultProvider);

// Functions:
const MergeTagsProvider = ({ children }: { children: React.ReactNode; }) => {
  // Constants:
  const {
    acknowledgeAndEndConversation,
    requestTemplateSave,
  } = useConversationManager();

  // State:
  const [mergeTags, setMergeTags] = useState<Record<string, string>>({});

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
