import { Template, Topic } from '../types';

export const foodTopic: Topic = {
  id: 'food',
  name: 'Food & Recipe',
  color: '#E91E63',
  icon: 'restaurant',
  templateIds: ['food-recipe', 'food-restaurant-review'],
};

export const foodTemplates: Template[] = [
  {
    id: 'food-recipe',
    topicId: 'food',
    name: 'Recipe Post',
    sections: [
      {
        type: 'heading',
        label: 'Recipe Title',
        content: '',
        placeholder: 'e.g. Crispy Garlic Butter Chicken Thighs',
      },
      {
        type: 'image',
        label: 'Hero Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
        placeholder: 'The money shot — finished dish photo',
      },
      {
        type: 'paragraph',
        label: 'Introduction',
        content: '',
        placeholder: 'Tell the story behind this recipe. Why do you love it? Where did it come from?',
      },
      {
        type: 'tip_box',
        label: 'Quick Info',
        content: '',
        placeholder: 'Prep time: \nCook time: \nServings: \nDifficulty: ',
      },
      {
        type: 'heading',
        label: 'Ingredients',
        content: 'Ingredients',
      },
      {
        type: 'bullet_list',
        label: 'Ingredients List',
        content: '',
        placeholder: 'Add each ingredient on a new line\ne.g. 4 chicken thighs, bone-in',
      },
      {
        type: 'heading',
        label: 'Instructions',
        content: 'Instructions',
      },
      {
        type: 'numbered_list',
        label: 'Steps',
        content: '',
        placeholder: 'Add each step on a new line\ne.g. Preheat oven to 425°F...',
      },
      {
        type: 'image',
        label: 'Process Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
        placeholder: 'A step-by-step or in-progress photo',
      },
      {
        type: 'heading',
        label: 'Tips & Variations',
        content: 'Tips & Variations',
      },
      {
        type: 'bullet_list',
        label: 'Tips',
        content: '',
        placeholder: 'Substitutions, storage notes, make-ahead tips...',
      },
      {
        type: 'paragraph',
        label: 'Closing Note',
        content: '',
        placeholder: 'Call to action — encourage readers to try it and share!',
      },
    ],
  },
  {
    id: 'food-restaurant-review',
    topicId: 'food',
    name: 'Restaurant Review',
    sections: [
      {
        type: 'heading',
        label: 'Review Title',
        content: '',
        placeholder: 'e.g. Review: The Best Ramen in Chicago?',
      },
      {
        type: 'image',
        label: 'Hero Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
        placeholder: 'Best dish photo or restaurant exterior',
      },
      {
        type: 'tip_box',
        label: 'At a Glance',
        content: '',
        placeholder: 'Restaurant: \nLocation: \nPrice range: \nBest for: \nRating: /10',
      },
      {
        type: 'paragraph',
        label: 'Overview',
        content: '',
        placeholder: 'Intro — what is this place and why did you go?',
      },
      {
        type: 'heading',
        label: 'What We Ordered',
        content: 'What We Ordered',
      },
      {
        type: 'paragraph',
        label: 'Dishes',
        content: '',
        placeholder: 'Describe each dish you tried...',
      },
      {
        type: 'image',
        label: 'Dish Photo',
        content: '',
        mediaUri: undefined,
        mediaCaption: '',
      },
      {
        type: 'heading',
        label: 'The Verdict',
        content: 'The Verdict',
      },
      {
        type: 'bullet_list',
        label: 'Pros & Cons',
        content: '',
        placeholder: '✓ Great atmosphere\n✓ Generous portions\n✗ Long wait times\n✗ Pricey cocktails',
      },
      {
        type: 'paragraph',
        label: 'Final Thoughts',
        content: '',
        placeholder: 'Who should go? Would you return?',
      },
    ],
  },
];
