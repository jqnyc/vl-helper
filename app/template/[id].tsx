import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTemplates } from '../../hooks/useTemplates';
import { Section, SectionType, Template } from '../../types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const SECTION_TYPES: { type: SectionType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'text' },
  { type: 'paragraph', label: 'Paragraph', icon: 'document-text' },
  { type: 'bullet_list', label: 'Bullet List', icon: 'list' },
  { type: 'numbered_list', label: 'Numbered List', icon: 'list-circle' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'quote', label: 'Quote', icon: 'chatbubble-ellipses' },
  { type: 'tip_box', label: 'Tip Box', icon: 'information-circle' },
  { type: 'divider', label: 'Divider', icon: 'remove' },
];

export default function TemplateEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string; topicId?: string }>();
  const params = useLocalSearchParams<{ topicId?: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const { templates, topics, addTemplate, updateTemplate } = useTemplates();

  const isNew = id === 'new';
  const existing = isNew ? null : templates.find(t => t.id === id);
  const topicId = existing?.topicId ?? params.topicId ?? '';
  const topic = topics.find(t => t.id === topicId);

  const [name, setName] = useState(existing?.name ?? '');
  const [sections, setSections] = useState<Omit<Section, 'id'>[]>(existing?.sections ?? []);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? 'New Template' : 'Edit Template' });
  }, []);

  function addSectionOfType(type: SectionType, label: string) {
    setSections(prev => [...prev, { type, label, content: '', placeholder: `Enter ${label.toLowerCase()}...` }]);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setSections(prev => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    setSections(prev => {
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function removeSection(idx: number) {
    setSections(prev => prev.filter((_, i) => i !== idx));
  }

  function updateSectionField(idx: number, field: keyof Omit<Section, 'id'>, value: string) {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please give this template a name.');
      return;
    }
    if (isNew) {
      await addTemplate({
        id: uid(),
        topicId,
        name: name.trim(),
        sections,
      });
    } else if (existing) {
      await updateTemplate({ ...existing, name: name.trim(), sections });
    }
    router.back();
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {topic && (
          <View style={[styles.topicChip, { backgroundColor: topic.color + '22', borderColor: topic.color }]}>
            <Ionicons name={topic.icon as any} size={14} color={topic.color} />
            <Text style={[styles.topicChipText, { color: topic.color }]}>{topic.name}</Text>
          </View>
        )}

        <Text style={styles.label}>Template name</Text>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Weekly Update"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Sections ({sections.length})</Text>
        {sections.map((s, idx) => (
          <View key={idx} style={[styles.sectionRow, { borderLeftColor: topic?.color ?? '#2196F3' }]}>
            <View style={styles.sectionInfo}>
              <Ionicons name={SECTION_TYPES.find(x => x.type === s.type)?.icon as any ?? 'document'} size={16} color={topic?.color ?? '#2196F3'} />
              <View style={styles.sectionFields}>
                <TextInput
                  style={styles.sectionLabelInput}
                  value={s.label}
                  onChangeText={v => updateSectionField(idx, 'label', v)}
                  placeholder="Label"
                  placeholderTextColor="#bbb"
                />
                <Text style={styles.sectionType}>{s.type.replace('_', ' ')}</Text>
              </View>
            </View>
            <View style={styles.sectionActions}>
              <TouchableOpacity onPress={() => moveUp(idx)} style={styles.iconBtn}>
                <Ionicons name="arrow-up" size={16} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDown(idx)} style={styles.iconBtn}>
                <Ionicons name="arrow-down" size={16} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeSection(idx)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.addLabel}>Add section</Text>
        <View style={styles.addGrid}>
          {SECTION_TYPES.map(({ type, label, icon }) => (
            <TouchableOpacity
              key={type}
              style={[styles.addChip, { borderColor: topic?.color ?? '#2196F3' }]}
              onPress={() => addSectionOfType(type, label)}
            >
              <Ionicons name={icon as any} size={14} color={topic?.color ?? '#2196F3'} />
              <Text style={[styles.addChipText, { color: topic?.color ?? '#2196F3' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>{isNew ? 'Create Template' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { padding: 16 },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  topicChipText: { fontSize: 12, fontWeight: '600' },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 8 },
  nameInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
      android: { elevation: 1 },
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' } as any,
    }),
  },
  sectionInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionFields: { flex: 1 },
  sectionLabelInput: { fontSize: 14, fontWeight: '600', color: '#111' },
  sectionType: { fontSize: 11, color: '#aaa', marginTop: 1 },
  sectionActions: { flexDirection: 'row' },
  iconBtn: { padding: 6 },
  addLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 16, marginBottom: 8 },
  addGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  addChipText: { fontSize: 13, fontWeight: '600' },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2196F3',
    borderRadius: 22,
    height: 48,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
