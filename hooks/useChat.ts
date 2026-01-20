import { useChatContext } from '../contexts/ChatContext';

export function useChat(platform?: 'linkedin' | 'instagram' | 'images') {
  const context = useChatContext();

  const filteredConversations = platform 
    ? context.conversations.filter(c => c.platform === platform)
    : context.conversations;

  return {
    ...context,
    conversations: filteredConversations,
  };
}
