import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTemplates } from '../../hooks/useTemplates';
import { TopicBadge } from '../../components/TopicBadge';
import { Topic, Template } from '../../types';

const TOPIC_COLORS = ['#2196F3', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#F44336', '#795548'];
const TOPIC_ICONS = ['airplane', 'restaurant', 'book', 'camera', 'fitness', 'home', 'musical-notes', 'briefcase', 'leaf', 'heart'];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function TopicsScreen() {
  const router = useRouter();
  const { topics, templates, addTopic, deleteTopic, deleteTemplate, getTemplatesForTopic } = useTemplates();

  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicColor, setNewTopicColor] = useState(TOPIC_COLORS[0]);
  const [newTopicIcon, setNewTopicIcon] = useState(TOPIC_ICONS[0]);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);

  function handleAddTopic() {
    if (!newTopicName.trim()) return;
    addTopic({
      id: uid(),
      name: newTopicName.trim(),
      color: newTopicColor,
      icon: newTopicIcon,
      templateIds: [],
    });
    setNewTopicName('');
    setTopicModalVisible(false);
  }

  function confirmDeleteTopic(topic: Topic) {
    Alert.alert(
      `Delete "${topic.name}"?`,
      'All templates in this topic will also be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTopic(topic.id) },
      ]
    );
  }

  function confirmDeleteTemplate(tmpl: Template) {
    Alert.alert(
      `Delete template "${tmpl.name}"?`,
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTemplate(tmpl.id) },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="layers-outline" size={56} color="#ddd" />
            <Text style={styles.emptyTitle}>No topics yet</Text>
            <Text style={styles.emptyHint}>Add a topic to get started</Text>
          </View>
        }
        renderItem={({ item: topic }) => {
          const topicTemplates = getTemplatesForTopic(topic.id);
          const expanded = expandedTopicId === topic.id;
          return (
            <View style={styles.topicCard}>
              <TouchableOpacity
                style={styles.topicHeader}
                onPress={() => setExpandedTopicId(expanded ? null : topic.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.topicIcon, { backgroundColor: topic.color + '22' }]}>
                  <Ionicons name={topic.icon as any} size={22} color={topic.color} />
                </View>
                <View style={styles.topicMeta}>
                  <Text style={styles.topicName}>{topic.name}</Text>
                  <Text style={styles.topicCount}>{topicTemplates.length} template{topicTemplates.length !== 1 ? 's' : ''}</Text>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#999" />
                <TouchableOpacity onPress={() => confirmDeleteTopic(topic)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.templateList}>
                  {topicTemplates.length === 0 && (
                    <Text style={styles.noTemplates}>No templates — add one below</Text>
                  )}
                  {topicTemplates.map(tmpl => (
                    <View key={tmpl.id} style={styles.templateRow}>
                      <Ionicons name="document-outline" size={16} color="#777" />
                      <Text style={styles.templateName}>{tmpl.name}</Text>
                      <View style={styles.templateActions}>
                        <TouchableOpacity
                          onPress={() => router.push(`/template/${tmpl.id}`)}
                          style={styles.iconBtn}
                        >
                          <Ionicons name="pencil" size={16} color="#2196F3" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => confirmDeleteTemplate(tmpl)} style={styles.iconBtn}>
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={[styles.addTemplateBtn, { borderColor: topic.color }]}
                    onPress={() => router.push({ pathname: '/template/new', params: { topicId: topic.id } })}
                  >
                    <Ionicons name="add" size={16} color={topic.color} />
                    <Text style={[styles.addTemplateText, { color: topic.color }]}>Add template</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setTopicModalVisible(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* New Topic Modal */}
      <Modal visible={topicModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Topic</Text>

            <TextInput
              style={styles.input}
              value={newTopicName}
              onChangeText={setNewTopicName}
              placeholder="Topic name (e.g. Photography)"
              placeholderTextColor="#aaa"
              autoFocus
            />

            <Text style={styles.modalLabel}>Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
              {TOPIC_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, newTopicColor === c && styles.colorDotSelected]}
                  onPress={() => setNewTopicColor(c)}
                />
              ))}
            </ScrollView>

            <Text style={styles.modalLabel}>Icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconRow}>
              {TOPIC_ICONS.map(ic => (
                <TouchableOpacity
                  key={ic}
                  style={[styles.iconOption, newTopicIcon === ic && { backgroundColor: newTopicColor + '22', borderColor: newTopicColor }]}
                  onPress={() => setNewTopicIcon(ic)}
                >
                  <Ionicons name={ic as any} size={22} color={newTopicIcon === ic ? newTopicColor : '#666'} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setTopicModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: newTopicColor }]}
                onPress={handleAddTopic}
              >
                <Text style={styles.confirmText}>Add Topic</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: 16, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingTop: 120, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptyHint: { fontSize: 14, color: '#aaa' },
  topicCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' } as any,
    }),
  },
  topicHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  topicIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  topicMeta: { flex: 1 },
  topicName: { fontSize: 16, fontWeight: '700', color: '#111' },
  topicCount: { fontSize: 12, color: '#999', marginTop: 1 },
  deleteBtn: { padding: 6, marginLeft: 4 },
  templateList: { borderTopWidth: 1, borderTopColor: '#f3f4f6', padding: 12, gap: 8 },
  noTemplates: { fontSize: 13, color: '#aaa', fontStyle: 'italic', paddingLeft: 4 },
  templateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  templateName: { flex: 1, fontSize: 14, color: '#333' },
  templateActions: { flexDirection: 'row' },
  iconBtn: { padding: 6 },
  addTemplateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  addTemplateText: { fontSize: 13, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowColor: '#2196F3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
      android: { elevation: 6 },
      web: { boxShadow: '0 4px 16px rgba(33,150,243,0.4)', cursor: 'pointer' } as any,
    }),
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
  },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 4 },
  colorRow: { flexGrow: 0, marginBottom: 4 },
  colorDot: { width: 32, height: 32, borderRadius: 16, marginRight: 10, borderWidth: 2, borderColor: 'transparent' },
  colorDotSelected: { borderColor: '#111', transform: [{ scale: 1.15 }] },
  iconRow: { flexGrow: 0, marginBottom: 4 },
  iconOption: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 2, borderColor: 'transparent' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  cancelText: { fontSize: 15, color: '#666', fontWeight: '600' },
  confirmBtn: { flex: 2, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  confirmText: { fontSize: 15, color: '#fff', fontWeight: '700' },
});
