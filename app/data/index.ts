import type { PortfolioData } from '../types';

import { experienceEntries } from './experience';
import { profileData } from './profile';
import { skillCategories } from './skills';
import { writingPosts } from './writing';

export { experienceEntries } from './experience';
export { profileData } from './profile';
export { skillCategories } from './skills';
export { writingPosts } from './writing';

export const portfolioData: PortfolioData = {
  ...profileData,
  skills: skillCategories,
  experience: experienceEntries,
  writing: writingPosts,
};
