import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  Share,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import { usePosts } from '../../hooks/usePosts';
import { useTemplates } from '../../hooks/useTemplates';
import { SectionEditor } from '../../components/SectionEditor';
import { TopicBadge } from '../../components/TopicBadge';
import { buildClipboardContent } from '../../utils/htmlExport';
import { Section, SectionType } from '../../types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_SECTION_CONTENT: Partial<Record<SectionType, Partial<Section>>> = {
  heading: { label: 'Heading', content: '' },
  paragraph: { label: 'Paragraph', content: '' },
  bullet_list: { label: 'Bullet List', content: '' },
  numbered_list: { label: 'Numbered List', content: '' },
  image: { label: 'Image', content: '', mediaUri: undefined },
  quote: { label: 'Quote', content: '' },
  tip_box: { label: 'Tip Box', content: '' },
  divider: { label: 'Divider', content: '' },
  html_block: { label: 'HTML Block', content: '' },
};

export default function PostEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { posts, updatePost, updateSection, addSection, removeSection, reorderSections, markReady } = usePosts();
  const { topics } = useTemplates();

  const post = posts.find(p => p.id === id);
  const topic = topics.find(t => t.id === post?.topicId);

  const [title, setTitle] = useState(post?.title ?? '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (post) setTitle(post.title);
  }, [post?.id]);

  useEffect(() => {
    navigation.setOptions({
      title: title || 'Untitled Post',
      headerRight: () => (
        <View style={styles.headerRight}>
          {post?.status !== 'ready' && (
            <TouchableOpacity onPress={handleMarkReady} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Mark Ready</Text>
            </TouchableOpacity>
          )}
          {post?.status === 'ready' && (
            <View style={styles.readyBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
              <Text style={styles.readyText}>Ready</Text>
            </View>
          )}
        </View>
      ),
    });
  }, [post?.status, title]);

  const saveTitle = useCallback((t: string) => {
    setTitle(t);
    if (post) updatePost(post.id, { title: t });
  }, [post, updatePost]);

  const handleSectionChange = useCallback((section: Section) => {
    if (post) updateSection(post.id, section);
  }, [post, updateSection]);

  const handleAddBelow = useCallback((afterId: string) => {
    if (!post) return;
    const newSection: Section = {
      id: uid(),
      type: 'paragraph',
      label: 'Paragraph',
      content: '',
    };
    addSection(post.id, newSection, afterId);
  }, [post, addSection]);

  const handleMoveUp = useCallback((sectionId: string) => {
    if (!post) return;
    const idx = post.sections.findIndex(s => s.id === sectionId);
    if (idx <= 0) return;
    const next = [...post.sections];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    reorderSections(post.id, next);
  }, [post, reorderSections]);

  const handleMoveDown = useCallback((sectionId: string) => {
    if (!post) return;
    const idx = post.sections.findIndex(s => s.id === sectionId);
    if (idx < 0 || idx >= post.sections.length - 1) return;
    const next = [...post.sections];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    reorderSections(post.id, next);
  }, [post, reorderSections]);

  const handlePickImage = useCallback(async (sectionId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add images to your post.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: true,
    });
    if (result.canceled || !result.assets[0]) return;
    if (!post) return;
    const section = post.sections.find(s => s.id === sectionId);
    if (!section) return;
    updateSection(post.id, { ...section, mediaUri: result.assets[0].uri });
  }, [post, updateSection]);

  const handleMarkReady = useCallback(() => {
    if (post) markReady(post.id);
  }, [post, markReady]);

  const handleCopyHtml = useCallback(async () => {
    if (!post) return;
    const html = buildClipboardContent(post, topic);
    await Clipboard.setStringAsync(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [post, topic]);

  const handleShare = useCallback(async () => {
    if (!post) return;
    const html = buildClipboardContent(post, topic);
    await Share.share({ message: html, title: post.title || 'Blog Post' });
  }, [post, topic]);

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Post not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Topic badge */}
        {topic && (
          <View style={styles.topicRow}>
            <TopicBadge topic={topic} />
          </View>
        )}

        {/* Title */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={saveTitle}
          placeholder="Post title..."
          placeholderTextColor="#ccc"
          multiline
        />

        {/* Sections */}
        {post.sections.map((section, idx) => (
          <SectionEditor
            key={section.id}
            section={section}
            onChange={handleSectionChange}
            onDelete={() => removeSection(post.id, section.id)}
            onMoveUp={idx > 0 ? () => handleMoveUp(section.id) : undefined}
            onMoveDown={idx < post.sections.length - 1 ? () => handleMoveDown(section.id) : undefined}
            onAddBelow={() => handleAddBelow(section.id)}
            onPickImage={handlePickImage}
            topicColor={topic?.color ?? '#2196F3'}
          />
        ))}

        {/* Add first section if empty */}
        {post.sections.length === 0 && (
          <TouchableOpacity
            style={styles.addFirstSection}
            onPress={() => {
              addSection(post.id, { id: uid(), type: 'paragraph', label: 'Paragraph', content: '' });
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#aaa" />
            <Text style={styles.addFirstText}>Add your first section</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom export bar */}
      <View style={styles.exportBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
          onPress={handleCopyHtml}
          activeOpacity={0.85}
        >
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={18} color="#fff" />
          <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy HTML for WordPress'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scroll: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#aaa', fontSize: 15 },
  topicRow: { marginBottom: 12 },
  titleInput: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 20,
    lineHeight: 34,
  },
  addFirstSection: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    borderRadius: 14,
    paddingVertical: 40,
  },
  addFirstText: { fontSize: 15, color: '#aaa' },
  exportBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2196F3',
    borderRadius: 22,
    height: 44,
  },
  copyBtnSuccess: { backgroundColor: '#22c55e' },
  copyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  headerRight: { flexDirection: 'row', alignItems: 'center', marginRight: 8 },
  headerBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#2196F3', borderRadius: 16 },
  headerBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  readyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readyText: { color: '#22c55e', fontSize: 13, fontWeight: '700' },
});
