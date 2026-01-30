import { useChatContext } from '../contexts/ChatContext';

export function useChat(platform?: 'linkedin' | 'instagram' | 'images') {
  const context = useChatContext();

  // User requested mixed history in sidebar, so we return all conversations
  // const filteredConversations = platform 
  //   ? context.conversations.filter(c => c.platform === platform)
  //   : context.conversations;
  const filteredConversations = context.conversations;

  // Partitioning: Don't show a conversation from another platform in the active view
  let activeConversation = context.currentConversation;
  if (platform && activeConversation && activeConversation.platform !== platform) {
    activeConversation = null;
  }

  return {
    ...context,
    conversations: filteredConversations,
    currentConversation: activeConversation,
  };
}
