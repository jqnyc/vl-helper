import { Template, Topic } from '../types';

export const travelTopic: Topic = {
  id: 'travel',
  name: 'Travel',
  color: '#2196F3',
  icon: 'airplane',
  templateIds: ['travel-destination-guide', 'travel-trip-recap'],
};

export const travelTemplates: Template[] = [
  {
    id: 'travel-destination-guide',
    topicId: 'travel',
    name: 'Destination Guide',
    sections: [
      {
        type: 'heading',
        label: 'Post Title',
        content: '',
        placeholder: 'e.g. The Ultimate Guide to Kyoto, Japan',
      },
      {
        type: 'image',
        label: 'Hero Image',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
        placeholder: 'Add a stunning cover photo',
      },
      {
        type: 'paragraph',
        label: 'Introduction',
        content: '',
        placeholder: 'Hook readers with why this destination is worth visiting...',
      },
      {
        type: 'heading',
        label: 'Getting There',
        content: 'Getting There',
      },
      {
        type: 'paragraph',
        label: 'Transport Details',
        content: '',
        placeholder: 'Flights, trains, local transport options and tips...',
      },
      {
        type: 'heading',
        label: 'Where to Stay',
        content: 'Where to Stay',
      },
      {
        type: 'paragraph',
        label: 'Accommodation',
        content: '',
        placeholder: 'Budget, mid-range, and luxury options...',
      },
      {
        type: 'heading',
        label: 'Top Things to Do',
        content: 'Top Things to Do',
      },
      {
        type: 'numbered_list',
        label: 'Activities List',
        content: '',
        placeholder: 'Add each activity on a new line',
      },
      {
        type: 'image',
        label: 'Activity Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
      },
      {
        type: 'heading',
        label: 'Where to Eat',
        content: 'Where to Eat',
      },
      {
        type: 'paragraph',
        label: 'Food & Restaurants',
        content: '',
        placeholder: 'Must-try dishes and restaurant recommendations...',
      },
      {
        type: 'tip_box',
        label: 'Insider Tips',
        content: '',
        placeholder: 'Share your insider knowledge...',
      },
      {
        type: 'heading',
        label: 'Practical Info',
        content: 'Practical Info',
      },
      {
        type: 'bullet_list',
        label: 'Quick Facts',
        content: '',
        placeholder: 'Best time to visit\nCurrency\nLanguage\nVisa requirements',
      },
      {
        type: 'paragraph',
        label: 'Final Thoughts',
        content: '',
        placeholder: 'Wrap up with your overall impression...',
      },
    ],
  },
  {
    id: 'travel-trip-recap',
    topicId: 'travel',
    name: 'Trip Recap',
    sections: [
      {
        type: 'heading',
        label: 'Post Title',
        content: '',
        placeholder: 'e.g. 10 Days in Portugal: What I Loved (and Didn\'t)',
      },
      {
        type: 'image',
        label: 'Hero Image',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
      },
      {
        type: 'paragraph',
        label: 'Introduction',
        content: '',
        placeholder: 'Set the scene — when did you go, and why?',
      },
      {
        type: 'heading',
        label: 'Day-by-Day Highlights',
        content: 'Day-by-Day Highlights',
      },
      {
        type: 'paragraph',
        label: 'Day 1',
        content: 'Day 1 — ',
        placeholder: 'What happened on day 1?',
      },
      {
        type: 'image',
        label: 'Day Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
      },
      {
        type: 'paragraph',
        label: 'Day 2',
        content: 'Day 2 — ',
        placeholder: 'What happened on day 2?',
      },
      {
        type: 'heading',
        label: 'Highlights & Lowlights',
        content: 'Highlights & Lowlights',
      },
      {
        type: 'bullet_list',
        label: 'Best Parts',
        content: '',
        placeholder: 'What were the best moments?',
      },
      {
        type: 'bullet_list',
        label: 'What I\'d Do Differently',
        content: '',
        placeholder: 'Honest reflection for future travelers...',
      },
      {
        type: 'tip_box',
        label: 'Pro Tips',
        content: '',
        placeholder: 'Key tips you wish you\'d known before going...',
      },
      {
        type: 'paragraph',
        label: 'Final Verdict',
        content: '',
        placeholder: 'Would you recommend it? Who is this destination for?',
      },
    ],
  },
];
