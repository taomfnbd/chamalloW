import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, KeyboardAvoidingView, Platform } from 'react-native';
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

const LINKEDIN_SUGGESTIONS = [
  "Idée de post motivation",
  "Post sur les kettlebells",
  "Témoignage client",
  "Storytelling échec",
  "Annonce nouveau programme"
];

export default function LinkedInScreen() {
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
  } = useChat('linkedin');

  const [showHistory, setShowHistory] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (currentConversation?.messages) {
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [currentConversation?.messages]);

  const handleSend = (content: string, attachments?: any[]) => {
    sendMessage('linkedin', content, attachments);
  };

  const handleNewConversation = () => {
    newConversation('linkedin');
    setShowHistory(false);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setShowHistory(false);
  };

  return (
    <ScreenLayout>
      <Header 
        platform="LinkedIn"
        onMenuPress={() => setShowHistory(!showHistory)}
        onPlanningPress={() => setShowPlanning(true)}
        onAgentPress={() => setShowAgent(true)}
      />

      <PlanningModal
        visible={showPlanning}
        onClose={() => setShowPlanning(false)}
        onSave={(config) => api.updatePlanning(config)}
        platform="linkedin"
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
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          data={currentConversation?.messages || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={(!currentConversation || currentConversation.messages.length === 0) ? styles.emptyContainer : styles.messagesList}
          renderItem={({ item }) => (
            item.isEditable ? (
              <EditableMessage 
                message={item} 
                onUpdate={updateMessage}
                onRegenerate={regenerateMessage}
                onValidate={validateMessage}
                platform="linkedin"
              />
            ) : (
              <ChatBubble message={item} />
            )
          )}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Text style={styles.emptyTitle}>👋 Salut Rudy !</Text>
              <SuggestionList 
                suggestions={LINKEDIN_SUGGESTIONS} 
                onSelect={handleSend} 
              />
            </View>
          }
          ListFooterComponent={isLoading ? <TypingIndicator /> : null}
        />
      </View>

      <ChatInput 
        onSend={handleSend} 
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
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Revert to center if flexGrow fixes the size
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: 40,
  },
  emptyContent: {
    width: '100%',
    alignItems: 'center',
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
