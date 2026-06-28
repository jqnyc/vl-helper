import { Post, Section, Topic } from '../types';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function linesToList(content: string, tag: 'ul' | 'ol'): string {
  const items = content
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => `  <li>${escapeHtml(l)}</li>`)
    .join('\n');
  return `<${tag}>\n${items}\n</${tag}>`;
}

function sectionToHtml(section: Section): string {
  const { type, content, mediaUri, mediaCaption } = section;

  switch (type) {
    case 'heading':
      if (!content.trim()) return '';
      return `<h2>${escapeHtml(content.trim())}</h2>`;

    case 'paragraph':
      if (!content.trim()) return '';
      return `<p>${escapeHtml(content.trim()).replace(/\n/g, '<br />')}</p>`;

    case 'bullet_list':
      if (!content.trim()) return '';
      return linesToList(content, 'ul');

    case 'numbered_list':
      if (!content.trim()) return '';
      return linesToList(content, 'ol');

    case 'quote':
      if (!content.trim()) return '';
      return `<blockquote><p>${escapeHtml(content.trim())}</p></blockquote>`;

    case 'tip_box':
      if (!content.trim()) return '';
      return [
        `<div class="wp-block-info-box" style="background:#f0f9ff;border-left:4px solid #2196F3;padding:16px;margin:20px 0;">`,
        `<p style="margin:0;">${escapeHtml(content.trim()).replace(/\n/g, '<br />')}</p>`,
        `</div>`,
      ].join('\n');

    case 'image':
      if (!mediaUri) return '';
      return [
        `<figure class="wp-block-image size-large">`,
        `  <img src="${escapeHtml(mediaUri)}" alt="${escapeHtml(mediaCaption ?? '')}" />`,
        mediaCaption?.trim()
          ? `  <figcaption>${escapeHtml(mediaCaption.trim())}</figcaption>`
          : '',
        `</figure>`,
      ].filter(Boolean).join('\n');

    case 'divider':
      return `<hr class="wp-block-separator" />`;

    case 'html_block':
      // Raw HTML — not escaped intentionally
      return content;

    default:
      return '';
  }
}

export function postToHtml(post: Post, topic?: Topic): string {
  const parts: string[] = [];

  // Find the first heading section as the post title (skip it in body if it matches post.title)
  const bodySections = post.sections.filter(
    s => !(s.type === 'heading' && s.content.trim() === post.title.trim())
  );

  for (const section of bodySections) {
    const html = sectionToHtml(section);
    if (html) parts.push(html);
  }

  return parts.join('\n\n');
}

export function postToWordPressBlock(post: Post, topic?: Topic): string {
  const bodyHtml = postToHtml(post, topic);
  // Wrap in a WordPress classic block comment for safe paste
  return `<!-- wp:html -->\n${bodyHtml}\n<!-- /wp:html -->`;
}

export function buildClipboardContent(post: Post, topic?: Topic): string {
  return postToHtml(post, topic);
}
