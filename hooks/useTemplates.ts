import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Topic, Template } from '../types';
import { DEFAULT_TOPICS, DEFAULT_TEMPLATES } from '../templates';

const TOPICS_KEY = '@vlhelper_topics';
const TEMPLATES_KEY = '@vlhelper_templates';

export function useTemplates() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [topicsRaw, templatesRaw] = await Promise.all([
        AsyncStorage.getItem(TOPICS_KEY),
        AsyncStorage.getItem(TEMPLATES_KEY),
      ]);
      setTopics(topicsRaw ? JSON.parse(topicsRaw) : DEFAULT_TOPICS);
      setTemplates(templatesRaw ? JSON.parse(templatesRaw) : DEFAULT_TEMPLATES);
    } catch {
      setTopics(DEFAULT_TOPICS);
      setTemplates(DEFAULT_TEMPLATES);
    } finally {
      setLoading(false);
    }
  }

  const saveTopics = useCallback(async (next: Topic[]) => {
    setTopics(next);
    await AsyncStorage.setItem(TOPICS_KEY, JSON.stringify(next));
  }, []);

  const saveTemplates = useCallback(async (next: Template[]) => {
    setTemplates(next);
    await AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
  }, []);

  const addTopic = useCallback(async (topic: Topic) => {
    const next = [...topics, topic];
    await saveTopics(next);
  }, [topics, saveTopics]);

  const updateTopic = useCallback(async (updated: Topic) => {
    const next = topics.map(t => t.id === updated.id ? updated : t);
    await saveTopics(next);
  }, [topics, saveTopics]);

  const deleteTopic = useCallback(async (topicId: string) => {
    await saveTopics(topics.filter(t => t.id !== topicId));
    await saveTemplates(templates.filter(t => t.topicId !== topicId));
  }, [topics, templates, saveTopics, saveTemplates]);

  const addTemplate = useCallback(async (template: Template) => {
    const next = [...templates, template];
    await saveTemplates(next);
    const topic = topics.find(t => t.id === template.topicId);
    if (topic) {
      await saveTopics(topics.map(t =>
        t.id === template.topicId
          ? { ...t, templateIds: [...t.templateIds, template.id] }
          : t
      ));
    }
  }, [templates, topics, saveTemplates, saveTopics]);

  const updateTemplate = useCallback(async (updated: Template) => {
    await saveTemplates(templates.map(t => t.id === updated.id ? updated : t));
  }, [templates, saveTemplates]);

  const deleteTemplate = useCallback(async (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId);
    await saveTemplates(templates.filter(t => t.id !== templateId));
    if (tmpl) {
      await saveTopics(topics.map(t =>
        t.id === tmpl.topicId
          ? { ...t, templateIds: t.templateIds.filter(id => id !== templateId) }
          : t
      ));
    }
  }, [templates, topics, saveTemplates, saveTopics]);

  const getTemplatesForTopic = useCallback((topicId: string) =>
    templates.filter(t => t.topicId === topicId),
    [templates]);

  const resetToDefaults = useCallback(async () => {
    await AsyncStorage.multiRemove([TOPICS_KEY, TEMPLATES_KEY]);
    setTopics(DEFAULT_TOPICS);
    setTemplates(DEFAULT_TEMPLATES);
  }, []);

  return {
    topics,
    templates,
    loading,
    addTopic,
    updateTopic,
    deleteTopic,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesForTopic,
    resetToDefaults,
  };
}
