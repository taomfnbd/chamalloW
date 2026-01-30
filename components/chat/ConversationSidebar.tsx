import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, SafeAreaView, Platform, TouchableWithoutFeedback } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { Conversation } from '../../types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConversationSidebarProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  currentId?: string;
  visible: boolean;
  onClose: () => void;
}

export default function ConversationSidebar({ 
  conversations, 
  onSelect, 
  onNew, 
  onDelete,
  currentId,
  visible,
  onClose
}: ConversationSidebarProps) {
  
  // Group conversations
  const groupedConversations = React.useMemo(() => {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const last7Days: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const weekAgo = subDays(now, 7);

    conversations.forEach(conv => {
      const date = new Date(conv.updatedAt);
      if (isToday(date)) {
        today.push(conv);
      } else if (isYesterday(date)) {
        yesterday.push(conv);
      } else if (isAfter(date, weekAgo)) {
        last7Days.push(conv);
      } else {
        older.push(conv);
      }
    });

    return [
      { title: "Aujourd'hui", data: today },
      { title: "Hier", data: yesterday },
      { title: "7 derniers jours", data: last7Days },
      { title: "Plus ancien", data: older },
    ].filter(section => section.data.length > 0);
  }, [conversations]);

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={[
        styles.item,
        item.id === currentId && styles.itemActive
      ]}
      onPress={() => onSelect(item.id)}
    >
      {item.platform === 'linkedin' ? (
        <FontAwesome name="linkedin-square" size={16} color="#0077B5" style={styles.itemIcon} />
      ) : item.platform === 'instagram' ? (
        <FontAwesome name="instagram" size={16} color="#E1306C" style={styles.itemIcon} />
      ) : item.platform === 'images' ? (
        <FontAwesome name="image" size={14} color={COLORS.primary} style={styles.itemIcon} />
      ) : (
        <FontAwesome name="comment-o" size={14} color={COLORS.textSecondary} style={styles.itemIcon} />
      )}
      
      <Text style={[
        styles.itemTitle,
        item.id === currentId && styles.itemTitleActive
      ]} numberOfLines={1}>
        {item.title || "Nouvelle conversation"}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        <FontAwesome name="trash-o" size={14} color={COLORS.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.sidebar}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onNew} style={styles.newChatButton}>
                <View style={styles.newChatContent}>
                  <FontAwesome name="plus" size={12} color={COLORS.textPrimary} />
                  <Text style={styles.newChatText}>Nouveau chat</Text>
                </View>
                <FontAwesome name="pencil-square-o" size={16} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={groupedConversations}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                  {item.data.map(conv => (
                    <React.Fragment key={conv.id}>
                      {renderItem({ item: conv })}
                    </React.Fragment>
                  ))}
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />

            <View style={styles.footer}>
              <TouchableOpacity style={styles.footerItem}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>R</Text>
                </View>
                <Text style={styles.footerText}>Rudy Morel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sidebar: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: COLORS.background, // Use theme background
    height: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary, // Use theme background
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newChatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  newChatText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  listContent: {
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  itemActive: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  itemIcon: {
    marginRight: SPACING.sm,
    width: 16,
    textAlign: 'center',
  },
  itemTitle: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    flex: 1,
  },
  itemTitleActive: {
    color: COLORS.textPrimary,
  },
  deleteBtn: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8, 
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  footerText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
});
