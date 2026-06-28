import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTemplates } from '../hooks/useTemplates';
import { usePosts } from '../hooks/usePosts';
import { TopicBadge } from '../components/TopicBadge';
import { Topic } from '../types';

type Step = 'topic' | 'template';

export default function NewPostScreen() {
  const router = useRouter();
  const { topics, getTemplatesForTopic } = useTemplates();
  const { createPost } = usePosts();

  const [step, setStep] = useState<Step>('topic');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  async function handleSelectTemplate(templateId: string) {
    if (!selectedTopic) return;
    const templates = getTemplatesForTopic(selectedTopic.id);
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    const post = await createPost(selectedTopic.id, template);
    router.replace(`/post/${post.id}`);
  }

  if (step === 'topic') {
    return (
      <View style={styles.container}>
        <Text style={styles.stepLabel}>Step 1 of 2</Text>
        <Text style={styles.heading}>Choose a topic</Text>
        <FlatList
          data={topics}
          keyExtractor={t => t.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: item.color }]}
              onPress={() => { setSelectedTopic(item); setStep('template'); }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>
                  {getTemplatesForTopic(item.id).length} template{getTemplatesForTopic(item.id).length !== 1 ? 's' : ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const templates = selectedTopic ? getTemplatesForTopic(selectedTopic.id) : [];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => setStep('topic')}>
        <Ionicons name="arrow-back" size={18} color="#2196F3" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      {selectedTopic && <TopicBadge topic={selectedTopic} />}
      <Text style={styles.stepLabel} style={{ marginTop: 12 }}>Step 2 of 2</Text>
      <Text style={styles.heading}>Choose a template</Text>
      <FlatList
        data={templates}
        keyExtractor={t => t.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.noTemplates}>
            No templates for this topic yet.{'\n'}Add one in the Topics tab.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderLeftColor: selectedTopic?.color ?? '#2196F3' }]}
            onPress={() => handleSelectTemplate(item.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="document-outline" size={22} color={selectedTopic?.color ?? '#2196F3'} />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.sections.length} sections</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  stepLabel: { fontSize: 12, color: '#aaa', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  heading: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 20 },
  list: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderLeftWidth: 4,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' } as any,
    }),
  },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardSub: { fontSize: 12, color: '#999', marginTop: 2 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 15, color: '#2196F3', fontWeight: '600' },
  noTemplates: { textAlign: 'center', color: '#aaa', lineHeight: 22, marginTop: 40 },
});
