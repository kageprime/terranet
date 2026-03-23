/**
 * Site metadata configuration - SIMPLE AND WORKING
 */

import { branding } from '@/lib/branding';

export const siteMetadata = {
  name: branding.productName,
  title: branding.fullTitle,
  description: branding.description,
  url: branding.url,
  keywords: branding.keywords,
};
