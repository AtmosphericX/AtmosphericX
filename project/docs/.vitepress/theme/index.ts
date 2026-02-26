import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';

import './style.css'

export default {
  ...DefaultTheme,
  async enhanceApp({ app, router, siteData }) {},
} satisfies Theme;
