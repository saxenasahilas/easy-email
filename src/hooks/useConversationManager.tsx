// Packages:
import { useContext } from 'react';

// Context:
import { ConversationManagerContext } from '../context/ConversationManagerContext';

// Functions:
const useConversationManager = () => useContext(ConversationManagerContext);

// Exports:
export default useConversationManager;
