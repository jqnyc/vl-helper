import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePosts } from '../../hooks/usePosts';
import { useTemplates } from '../../hooks/useTemplates';
import { TopicBadge } from '../../components/TopicBadge';
import { Post } from '../../types';

export default function PostsScreen() {
  const router = useRouter();
  const { posts, loading, deletePost } = usePosts();
  const { topics } = useTemplates();

  const topicMap = useMemo(() =>
    Object.fromEntries(topics.map(t => [t.id, t])),
    [topics]
  );

  function confirmDelete(post: Post) {
    Alert.alert(
      'Delete post?',
      `"${post.title || 'Untitled'}" will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePost(post.id) },
      ]
    );
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.hint}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={p => p.id}
        contentContainerStyle={posts.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={56} color="#ddd" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyHint}>Tap + to start a new blog post</Text>
          </View>
        }
        renderItem={({ item }) => {
          const topic = topicMap[item.topicId];
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/post/${item.id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.cardTop}>
                {topic && <TopicBadge topic={topic} size="sm" />}
                <View style={[styles.statusDot, item.status === 'ready' ? styles.statusReady : styles.statusDraft]} />
              </View>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title || 'Untitled Post'}
              </Text>
              <View style={styles.cardMeta}>
                <Text style={styles.metaText}>{formatDate(item.updatedAt)}</Text>
                <Text style={styles.metaText}>{item.sections.length} sections</Text>
                <Text style={[styles.metaStatus, item.status === 'ready' ? styles.metaReady : styles.metaDraft]}>
                  {item.status === 'ready' ? 'Ready' : 'Draft'}
                </Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/new')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hint: { color: '#aaa', fontSize: 14 },
  list: { padding: 16, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptyHint: { fontSize: 14, color: '#aaa' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' } as any,
    }),
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusDraft: { backgroundColor: '#f59e0b' },
  statusReady: { backgroundColor: '#22c55e' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  metaText: { fontSize: 12, color: '#999' },
  metaStatus: { fontSize: 12, fontWeight: '600' },
  metaDraft: { color: '#f59e0b' },
  metaReady: { color: '#22c55e' },
  deleteBtn: { position: 'absolute', top: 14, right: 14, padding: 4 },
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
});
