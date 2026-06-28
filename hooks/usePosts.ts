import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, Section, Template } from '../types';

const POSTS_KEY = '@vlhelper_posts';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const raw = await AsyncStorage.getItem(POSTS_KEY);
      setPosts(raw ? JSON.parse(raw) : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  const save = useCallback(async (next: Post[]) => {
    setPosts(next);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(next));
  }, []);

  const createPost = useCallback(async (
    topicId: string,
    template: Template,
    title?: string,
  ): Promise<Post> => {
    const now = new Date().toISOString();
    const post: Post = {
      id: uid(),
      topicId,
      templateId: template.id,
      title: title ?? '',
      sections: template.sections.map(s => ({ ...s, id: uid() })),
      createdAt: now,
      updatedAt: now,
      status: 'draft',
    };
    await save([post, ...posts]);
    return post;
  }, [posts, save]);

  const updatePost = useCallback(async (postId: string, changes: Partial<Post>) => {
    const next = posts.map(p =>
      p.id === postId
        ? { ...p, ...changes, updatedAt: new Date().toISOString() }
        : p
    );
    await save(next);
  }, [posts, save]);

  const updateSection = useCallback(async (postId: string, section: Section) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const sections = post.sections.map(s => s.id === section.id ? section : s);
    await updatePost(postId, { sections });
  }, [posts, updatePost]);

  const addSection = useCallback(async (postId: string, section: Section, afterId?: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    let sections: Section[];
    if (afterId) {
      const idx = post.sections.findIndex(s => s.id === afterId);
      sections = [
        ...post.sections.slice(0, idx + 1),
        section,
        ...post.sections.slice(idx + 1),
      ];
    } else {
      sections = [...post.sections, section];
    }
    await updatePost(postId, { sections });
  }, [posts, updatePost]);

  const removeSection = useCallback(async (postId: string, sectionId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    await updatePost(postId, {
      sections: post.sections.filter(s => s.id !== sectionId),
    });
  }, [posts, updatePost]);

  const reorderSections = useCallback(async (postId: string, sections: Section[]) => {
    await updatePost(postId, { sections });
  }, [updatePost]);

  const deletePost = useCallback(async (postId: string) => {
    await save(posts.filter(p => p.id !== postId));
  }, [posts, save]);

  const markReady = useCallback(async (postId: string) => {
    await updatePost(postId, { status: 'ready' });
  }, [updatePost]);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    updateSection,
    addSection,
    removeSection,
    reorderSections,
    deletePost,
    markReady,
  };
}
