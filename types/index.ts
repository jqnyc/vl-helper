export type SectionType =
  | 'heading'
  | 'paragraph'
  | 'bullet_list'
  | 'numbered_list'
  | 'image'
  | 'quote'
  | 'tip_box'
  | 'divider'
  | 'html_block';

export interface Section {
  id: string;
  type: SectionType;
  label: string;
  content: string;
  mediaUri?: string;   // local file URI for images
  mediaCaption?: string;
  placeholder?: string;
}

export interface Template {
  id: string;
  topicId: string;
  name: string;
  sections: Omit<Section, 'id'>[];
}

export interface Topic {
  id: string;
  name: string;
  color: string;
  icon: string;
  templateIds: string[];
}

export interface Post {
  id: string;
  topicId: string;
  templateId: string;
  title: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready';
}
