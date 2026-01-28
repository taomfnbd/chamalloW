import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { AgentConfig, Document } from '../../types';
import Button from '../ui/Button';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import { v4 as uuidv4 } from 'uuid';

interface AgentTrainerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (config: AgentConfig) => void;
}

export default function AgentTrainer({ visible, onClose, onSave }: AgentTrainerProps) {
  const [instructions, setInstructions] = useState<string[]>(['Utilise toujours un emoji 💪 au début de mes posts.', 'Ton amical et motivant.']);
  const [newInstruction, setNewInstruction] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['kettlebell', 'transformation', 'force']);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleAddDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      
      const asset = result.assets[0];
      const newDoc: Document = {
        id: uuidv4(),
        name: asset.name,
        uri: asset.uri,
        type: asset.mimeType || 'unknown',
        uploadedAt: new Date(),
      };
      
      setDocuments([...documents, newDoc]);
    } catch (err) {
      console.error('Error picking document', err);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = () => {
    onSave({
      instructions,
      documents,
      keywords,
      updatedAt: new Date(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Base de Connaissance</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              Personnalise le style de Rudy et enrichis ses connaissances. 
              Ces éléments s'ajoutent à la base existante.
            </Text>
            
            {/* INSTRUCTIONS */}
            <View style={styles.section}>
              <Text style={styles.label}>Instructions de Style & Règles</Text>
              <Text style={styles.helperText}>Ex: "Ne jamais utiliser d'exclamation excessive", "Mentionner toujours le lien bio".</Text>
              
              <View style={styles.listContainer}>
                {instructions.map((inst, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{inst}</Text>
                    <TouchableOpacity onPress={() => handleRemoveInstruction(index)}>
                      <FontAwesome name="trash-o" size={16} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={newInstruction}
                  onChangeText={setNewInstruction}
                  placeholder="Nouvelle instruction..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                />
                <TouchableOpacity onPress={handleAddInstruction} style={styles.addButton}>
                  <FontAwesome name="plus" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* DOCUMENTS */}
            <View style={styles.section}>
              <Text style={styles.label}>Documents de Référence</Text>
              <Text style={styles.helperText}>PDFs, Guides, Anciens posts pour l'inspiration.</Text>
              
              <View style={styles.listContainer}>
                {documents.map(doc => (
                  <View key={doc.id} style={styles.docItem}>
                    <View style={styles.docIcon}>
                      <FontAwesome name="file-text-o" size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.docInfo}>
                      <Text style={styles.docName} numberOfLines={1}>{doc.name}</Text>
                      <Text style={styles.docDate}>Ajouté le {doc.uploadedAt.toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveDocument(doc.id)} style={styles.deleteButton}>
                      <FontAwesome name="times" size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>
                ))}
                
                <TouchableOpacity style={styles.addDocButton} onPress={handleAddDocument}>
                  <FontAwesome name="cloud-upload" size={16} color={COLORS.primary} />
                  <Text style={styles.addDocText}>Importer un document</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* KEYWORDS */}
            <View style={styles.section}>
              <Text style={styles.label}>Mots-clés Marque</Text>
              <View style={styles.keywordsContainer}>
                {keywords.map(kw => (
                  <View key={kw} style={styles.keywordChip}>
                    <Text style={styles.keywordText}>{kw}</Text>
                    <TouchableOpacity onPress={() => handleRemoveKeyword(kw)}>
                      <FontAwesome name="times" size={10} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={newKeyword}
                  onChangeText={setNewKeyword}
                  placeholder="Nouveau mot-clé"
                  placeholderTextColor={COLORS.textMuted}
                  onSubmitEditing={handleAddKeyword}
                />
                <TouchableOpacity onPress={handleAddKeyword} style={styles.addButton}>
                  <FontAwesome name="plus" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button title="ENREGISTRER LES MODIFICATIONS" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background, // Darker
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    paddingTop: SPACING.lg,
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  closeButton: {
    position: 'absolute',
    right: SPACING.lg,
    padding: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100, // Space for footer
  },
  section: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    fontSize: 16,
    marginBottom: 4,
  },
  helperText: {
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  listContainer: {
    gap: SPACING.sm,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  listItemText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    flex: 1,
    marginRight: SPACING.md,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.backgroundTertiary,
    color: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontFamily: FONTS.regular,
    minHeight: 44,
  },
  addButton: {
    backgroundColor: COLORS.backgroundTertiary,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  docDate: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  addDocButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  addDocText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundTertiary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  keywordText: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
