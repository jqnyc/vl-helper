import { travelTopic, travelTemplates } from './travel';
import { foodTopic, foodTemplates } from './food';
import { Topic, Template } from '../types';

export const DEFAULT_TOPICS: Topic[] = [travelTopic, foodTopic];
export const DEFAULT_TEMPLATES: Template[] = [...travelTemplates, ...foodTemplates];
