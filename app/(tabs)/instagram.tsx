import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import Header from '../../components/ui/Header';
import ConversationSidebar from '../../components/chat/ConversationSidebar';
import ChatBubble from '../../components/chat/ChatBubble';
import EditableMessage from '../../components/chat/EditableMessage';
import ChatInput from '../../components/chat/ChatInput';
import { useChat } from '../../hooks/useChat';
import PlanningModal from '../../components/planning/PlanningModal';
import AgentTrainer from '../../components/agent/AgentTrainer';
import SuggestionList from '../../components/chat/SuggestionList';
import ScreenLayout from '../../components/ui/ScreenLayout';
import TypingIndicator from '../../components/ui/TypingIndicator';
import { api } from '../../services/api';

const INSTAGRAM_SUGGESTIONS = [
  "Légende photo workout",
  "Idée Reel transition",
  "Carrousel éducatif",
  "Question engagement",
  "Story sondage"
];

export default function InstagramScreen() {
  const { 
    conversations, 
    currentConversation, 
    sendMessage, 
    updateMessage, 
    regenerateMessage, 
    validateMessage, 
    selectConversation, 
    newConversation,
    deleteConversation,
    isLoading 
  } = useChat('instagram');

  const [showHistory, setShowHistory] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (currentConversation?.messages && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentConversation?.messages]);

  const handleSend = (content: string) => {
    sendMessage('instagram', content);
  };

  const handleNewConversation = () => {
    newConversation('instagram');
    setShowHistory(false);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setShowHistory(false);
  };

  return (
    <ScreenLayout>
      <Header 
        platform="Instagram"
        onMenuPress={() => setShowHistory(!showHistory)}
        onPlanningPress={() => setShowPlanning(true)}
        onAgentPress={() => setShowAgent(true)}
      />

      <PlanningModal
        visible={showPlanning}
        onClose={() => setShowPlanning(false)}
        onSave={(config) => api.updatePlanning(config)}
        platform="instagram"
      />

      <AgentTrainer
        visible={showAgent}
        onClose={() => setShowAgent(false)}
        onSave={(config) => api.updateAgent(config)}
      />

      <ConversationSidebar 
        conversations={conversations}
        visible={showHistory}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={deleteConversation}
        onClose={() => setShowHistory(false)}
        currentId={currentConversation?.id}
      />

      <View style={styles.chatContainer}>
        {(!currentConversation || currentConversation.messages.length === 0) ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>👋 Salut Rudy !</Text>
            
            <SuggestionList 
              suggestions={INSTAGRAM_SUGGESTIONS} 
              onSelect={handleSend} 
            />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentConversation.messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => (
              item.isEditable ? (
                <EditableMessage 
                  message={item} 
                  onUpdate={updateMessage}
                  onRegenerate={regenerateMessage}
                  onValidate={validateMessage}
                  platform="instagram"
                />
              ) : (
                <ChatBubble message={item} />
              )
            )}
            ListFooterComponent={isLoading ? <TypingIndicator /> : null}
          />
        )}
      </View>

      <ChatInput 
        onSend={(content, attachments) => handleSend(content)} 
        isLoading={isLoading}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    padding: SPACING.md,
    paddingBottom: SPACING.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  suggestion: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginTop: SPACING.md,
  },
  loadingBubble: {
    backgroundColor: COLORS.bubbleAI,
    alignSelf: 'flex-start',
    padding: SPACING.md,
    borderRadius: SPACING.md,
    marginBottom: SPACING.md,
    borderBottomLeftRadius: 2,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
  }
});
