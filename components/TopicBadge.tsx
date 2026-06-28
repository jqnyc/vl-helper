import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Topic } from '../types';

interface Props {
  topic: Topic;
  size?: 'sm' | 'md';
}

export function TopicBadge({ topic, size = 'md' }: Props) {
  const sm = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: topic.color + '22', borderColor: topic.color }, sm && styles.badgeSm]}>
      <Ionicons name={topic.icon as any} size={sm ? 12 : 14} color={topic.color} />
      <Text style={[styles.label, { color: topic.color }, sm && styles.labelSm]}>{topic.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 11,
  },
});
