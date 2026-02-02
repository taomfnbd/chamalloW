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
  // Gestion par onglets
  const [activeTab, setActiveTab] = useState<'general' | 'photo' | 'instagram' | 'linkedin'>('general');

  // Instructions séparées par contexte
  const [instructionsMap, setInstructionsMap] = useState({
    general: [],
    photo: [],
    instagram: [],
    linkedin: []
  });

  const [newInstruction, setNewInstruction] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructionsMap({
        ...instructionsMap,
        [activeTab]: [...instructionsMap[activeTab], newInstruction.trim()]
      });
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructionsMap({
      ...instructionsMap,
      [activeTab]: instructionsMap[activeTab].filter((_, i) => i !== index)
    });
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

  const handleSave = async () => {
    // 1. Sauvegarde locale (on aplatit tout pour la compatibilité existante si besoin, ou on adapte onSave plus tard)
    // Pour l'instant on garde une structure simple pour le composant parent, ou on lui passe tout
    // Le composant parent attend AgentConfig qui a instructions: string[]. 
    // On va concaténer tout pour le parent pour ne pas casser l'app, mais le webhook aura le détail.
    const allInstructionsFlat = [
      ...instructionsMap.general,
      ...instructionsMap.photo,
      ...instructionsMap.instagram,
      ...instructionsMap.linkedin
    ];

    onSave({
      instructions: allInstructionsFlat, // Rétrocompatibilité interne
      documents,
      keywords,
      updatedAt: new Date(),
    });

    // 2. Envoi au Webhook - PAYLOAD STRUCTURÉ (Aplati pour clarté n8n)
    const payload = {
      // Instructions par canal
      general_instructions: instructionsMap.general,
      photo_instructions: instructionsMap.photo,
      instagram_instructions: instructionsMap.instagram,
      linkedin_instructions: instructionsMap.linkedin,
      
      // Autres données
      documents: documents.map(d => d.name),
      keywords,
      timestamp: new Date().toISOString()
    };
    
    const WEBHOOK_URL = process.env.EXPO_PUBLIC_AGENT_WEBHOOK || ''; 

    try {
      // if (__DEV__) console.log('Envoi au webhook:', payload);
      
      // 1. GET (Résumé)
      const summary = {
        // Version finale
        instructions_count: allInstructionsFlat.length,
        ...payload // On essaie de tout mettre si ça tient
      };
      const getUrl = `${WEBHOOK_URL}?data=${encodeURIComponent(JSON.stringify(summary))}`;
      fetch(getUrl, { mode: 'no-cors' }).catch(e => console.error('GET fail', e));

      // 2. POST (Payload complet structuré)
      const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
      const beaconSent = navigator.sendBeacon(WEBHOOK_URL, blob);

      if (beaconSent) {
        alert('✅ Données envoyées !');
      } else {
        // 3. Fallback Fetch si Beacon échoue
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(payload)
        });
        alert('✅ Données envoyées (Fetch)');
      }
      
    } catch (error: any) {
      console.error('Erreur webhook:', error);
      alert(`⚠️ Erreur d'envoi: ${error.message}`);
    }

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
          
          {/* NAVIGATION ONGLETS */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'general' && styles.activeTab]} 
              onPress={() => setActiveTab('general')}
            >
              <FontAwesome name="globe" size={16} color={activeTab === 'general' ? COLORS.textInverse : COLORS.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>Général</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'photo' && styles.activeTab]} 
              onPress={() => setActiveTab('photo')}
            >
              <FontAwesome name="camera" size={16} color={activeTab === 'photo' ? COLORS.textInverse : COLORS.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'photo' && styles.activeTabText]}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'instagram' && styles.activeTab]} 
              onPress={() => setActiveTab('instagram')}
            >
              <FontAwesome name="instagram" size={16} color={activeTab === 'instagram' ? COLORS.textInverse : COLORS.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'instagram' && styles.activeTabText]}>Insta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'linkedin' && styles.activeTab]} 
              onPress={() => setActiveTab('linkedin')}
            >
              <FontAwesome name="linkedin" size={16} color={activeTab === 'linkedin' ? COLORS.textInverse : COLORS.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'linkedin' && styles.activeTabText]}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              {activeTab === 'general' && "Ces règles s'appliqueront à TOUS les agents."}
              {activeTab === 'photo' && "Instructions spécifiques pour l'analyse et la génération photo."}
              {activeTab === 'instagram' && "Spécificités pour les légendes et stories Instagram."}
              {activeTab === 'linkedin' && "Ton et format pour le réseau professionnel."}
            </Text>
            
            {/* INSTRUCTIONS LIST */}
            <View style={styles.section}>
              <View style={styles.listContainer}>
                {instructionsMap[activeTab].length === 0 && (
                  <Text style={styles.emptyText}>Aucune instruction spécifique pour le moment.</Text>
                )}
                {instructionsMap[activeTab].map((inst, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.listItemText}>{inst}</Text>
                    <TouchableOpacity onPress={() => handleRemoveInstruction(index)} style={styles.trashIcon}>
                      <FontAwesome name="trash-o" size={18} color={COLORS.error} />
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
  // Styles pour les cibles
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundTertiary,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  activeTabText: {
    color: COLORS.textInverse,
    fontFamily: FONTS.bold,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },
  trashIcon: {
    padding: 8,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
