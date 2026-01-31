import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Platform } from 'react-native';
import { COLORS, SPACING, FONTS } from '../../constants/theme';
import Header from '../../components/ui/Header';
import ConversationSidebar from '../../components/chat/ConversationSidebar';
import ChatBubble from '../../components/chat/ChatBubble';
import EditableMessage from '../../components/chat/EditableMessage';
import ChatInput from '../../components/chat/ChatInput';
import ImageBubble from '../../components/chat/ImageBubble';
import SuggestionList from '../../components/chat/SuggestionList';
import ScreenLayout from '../../components/ui/ScreenLayout';
import TypingIndicator from '../../components/ui/TypingIndicator';
import { useChat } from '../../hooks/useChat';
import PlanningModal from '../../components/planning/PlanningModal';
import AgentTrainer from '../../components/agent/AgentTrainer';
import { api } from '../../services/api';
import * as ImagePicker from 'expo-image-picker';

const IMAGES_SUGGESTIONS = [
  "Photo réaliste salle de sport",
  "Logo minimaliste",
  "Illustration anatomie muscle",
  "Poster motivation"
];

export default function ImagesScreen() {
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
    isLoading,
    error
  } = useChat('images');

  const [showHistory, setShowHistory] = useState(false);
  const [showPlanning, setShowPlanning] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (currentConversation?.messages) {
      if (flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    }
  }, [currentConversation?.messages]);

  const handleSend = (content: string, attachments: any[] = []) => {
    if (attachments.length > 0) {
      // For now, simulate sending the first image attachment as the content
      const firstImage = attachments.find(a => a.type === 'image');
      if (firstImage) {
        sendMessage('images', `[Image] ${firstImage.uri}`);
        return;
      }
    }
    sendMessage('images', content);
  };

  const handleNewConversation = () => {
    newConversation('images');
    setShowHistory(false);
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setShowHistory(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    // Check if message has image attachment or content is a URL (simple check)
    const isImage = item.attachments?.find((a: any) => a.type === 'image') || (item.content.startsWith('http') || item.content.startsWith('file://'));
    
    if (isImage) {
      const uri = item.attachments?.[0]?.uri || item.content.replace('[Image] ', '');
      return (
        <View>
          <ImageBubble 
            uri={uri} 
            isUser={item.role === 'user'} 
            onPress={() => {}} 
          />
          {item.content && !item.content.startsWith('http') && !item.content.startsWith('file://') && !item.content.startsWith('[Image]') && (
             <ChatBubble message={item} />
          )}
        </View>
      );
    }

    if (item.isEditable) {
      return (
        <EditableMessage 
          message={item} 
          onUpdate={updateMessage}
          onRegenerate={regenerateMessage}
          onValidate={validateMessage}
        />
      );
    }

    return <ChatBubble message={item} />;
  };

  return (
    <ScreenLayout error={error}>
      <Header 
        platform="Images" // Deprecated logic but useful title? No badge.
        // Actually Header ignores platform badge now.
        onMenuPress={() => setShowHistory(!showHistory)}
        onPlanningPress={() => setShowPlanning(true)}
        onAgentPress={() => setShowAgent(true)}
      />

      <PlanningModal
        visible={showPlanning}
        onClose={() => setShowPlanning(false)}
        onSave={(config) => api.updatePlanning(config)}
        platform="images"
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
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyContent}>
              <Text style={styles.emptyTitle}>Générateur d'Images IA 🎨</Text>
              <SuggestionList 
                suggestions={IMAGES_SUGGESTIONS} 
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
    justifyContent: 'center',
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
