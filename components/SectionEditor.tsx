import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Section, SectionType } from '../types';

const SECTION_TYPE_OPTIONS: { type: SectionType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'text' },
  { type: 'paragraph', label: 'Paragraph', icon: 'document-text' },
  { type: 'bullet_list', label: 'Bullet List', icon: 'list' },
  { type: 'numbered_list', label: 'Numbered List', icon: 'list-circle' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'quote', label: 'Quote', icon: 'chatbubble-ellipses' },
  { type: 'tip_box', label: 'Tip Box', icon: 'information-circle' },
  { type: 'divider', label: 'Divider', icon: 'remove' },
  { type: 'html_block', label: 'HTML Block', icon: 'code' },
];

interface Props {
  section: Section;
  onChange: (section: Section) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddBelow: () => void;
  onPickImage: (sectionId: string) => void;
  topicColor: string;
}

export function SectionEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBelow,
  onPickImage,
  topicColor,
}: Props) {
  const [typePickerVisible, setTypePickerVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const update = (fields: Partial<Section>) => onChange({ ...section, ...fields });

  const currentTypeInfo = SECTION_TYPE_OPTIONS.find(o => o.type === section.type);

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { borderLeftColor: topicColor }]}>
        <TouchableOpacity onPress={() => setTypePickerVisible(true)} style={styles.typeBtn}>
          <Ionicons name={currentTypeInfo?.icon as any} size={16} color={topicColor} />
          <Text style={[styles.typeLabel, { color: topicColor }]}>{section.label || currentTypeInfo?.label}</Text>
          <Ionicons name="chevron-down" size={14} color={topicColor} />
        </TouchableOpacity>

        <View style={styles.actions}>
          {onMoveUp && (
            <TouchableOpacity onPress={onMoveUp} style={styles.iconBtn}>
              <Ionicons name="arrow-up" size={18} color="#666" />
            </TouchableOpacity>
          )}
          {onMoveDown && (
            <TouchableOpacity onPress={onMoveDown} style={styles.iconBtn}>
              <Ionicons name="arrow-down" size={18} color="#666" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={styles.iconBtn}>
            <Ionicons name={collapsed ? 'chevron-down' : 'chevron-up'} size={18} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      {!collapsed && (
        <View style={styles.body}>
          {section.type === 'heading' && (
            <TextInput
              style={styles.headingInput}
              value={section.content}
              onChangeText={text => update({ content: text })}
              placeholder={section.placeholder ?? 'Heading text...'}
              placeholderTextColor="#aaa"
            />
          )}

          {(section.type === 'paragraph' || section.type === 'quote' || section.type === 'tip_box' || section.type === 'html_block') && (
            <TextInput
              style={styles.textInput}
              value={section.content}
              onChangeText={text => update({ content: text })}
              placeholder={section.placeholder ?? 'Write here...'}
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
            />
          )}

          {(section.type === 'bullet_list' || section.type === 'numbered_list') && (
            <>
              <Text style={styles.listHint}>
                {section.type === 'bullet_list' ? '• One item per line' : '1. One item per line'}
              </Text>
              <TextInput
                style={styles.textInput}
                value={section.content}
                onChangeText={text => update({ content: text })}
                placeholder={section.placeholder ?? 'Item 1\nItem 2\nItem 3'}
                placeholderTextColor="#aaa"
                multiline
                textAlignVertical="top"
              />
            </>
          )}

          {section.type === 'image' && (
            <View style={styles.imageBlock}>
              {section.mediaUri ? (
                <>
                  <Image source={{ uri: section.mediaUri }} style={styles.imagePreview} resizeMode="cover" />
                  <TextInput
                    style={styles.captionInput}
                    value={section.mediaCaption ?? ''}
                    onChangeText={text => update({ mediaCaption: text })}
                    placeholder="Caption (optional)"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity style={styles.changeImageBtn} onPress={() => onPickImage(section.id)}>
                    <Ionicons name="camera" size={16} color="#555" />
                    <Text style={styles.changeImageText}>Change image</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.imagePlaceholder, { borderColor: topicColor }]} onPress={() => onPickImage(section.id)}>
                  <Ionicons name="image-outline" size={36} color={topicColor} />
                  <Text style={[styles.imagePlaceholderText, { color: topicColor }]}>
                    {section.placeholder ?? 'Tap to add image'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {section.type === 'divider' && (
            <View style={styles.dividerPreview}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerHint}>— horizontal rule —</Text>
              <View style={styles.dividerLine} />
            </View>
          )}
        </View>
      )}

      {/* Add section below */}
      <TouchableOpacity style={styles.addBelowBtn} onPress={onAddBelow}>
        <Ionicons name="add-circle-outline" size={18} color="#999" />
        <Text style={styles.addBelowText}>Add section below</Text>
      </TouchableOpacity>

      {/* Type picker modal */}
      <Modal visible={typePickerVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => setTypePickerVisible(false)}>
          <View style={styles.typePicker}>
            <Text style={styles.typePickerTitle}>Change section type</Text>
            <FlatList
              data={SECTION_TYPE_OPTIONS}
              keyExtractor={item => item.type}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.typeOption, item.type === section.type && styles.typeOptionActive]}
                  onPress={() => {
                    update({ type: item.type, label: item.label });
                    setTypePickerVisible(false);
                  }}
                >
                  <Ionicons name={item.icon as any} size={18} color={item.type === section.type ? topicColor : '#555'} />
                  <Text style={[styles.typeOptionText, item.type === section.type && { color: topicColor }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
      android: { elevation: 2 },
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } as any,
    }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  typeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 6,
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  headingInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textInput: {
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    paddingVertical: 8,
    lineHeight: 22,
  },
  listHint: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
    marginBottom: 2,
  },
  imageBlock: {
    gap: 8,
    paddingVertical: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  captionInput: {
    fontSize: 13,
    color: '#555',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 4,
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  changeImageText: {
    fontSize: 13,
    color: '#555',
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dividerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerHint: {
    fontSize: 11,
    color: '#bbb',
  },
  addBelowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  addBelowText: {
    fontSize: 12,
    color: '#999',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typePicker: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 280,
    maxHeight: 440,
  },
  typePickerTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  typeOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  typeOptionText: {
    fontSize: 14,
    color: '#333',
  },
});
