const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dosco.live';

export const branding = {
  productName: 'Dosco.live',
  aiName: 'Dosco.live',
  teamName: 'Dosco.live Team',
  fullTitle: 'Dosco.live: Your Autonomous AI Worker',
  description:
    'Built for complex tasks, designed for everything. The ultimate AI assistant that handles it all—from simple requests to mega-complex projects.',
  keywords:
    'Dosco.live, AI Worker, Agentic AI, Autonomous AI Worker, AI Automation, AI Workflow Automation, AI Assistant, Task Automation',
  url: appUrl,
  canonicalUrl: appUrl,
  contactEmail: 'hey@dosco.live',
  social: {
    githubOrg: process.env.NEXT_PUBLIC_GITHUB_ORG || 'kortix-ai',
    githubRepo: process.env.NEXT_PUBLIC_GITHUB_REPO || 'suna',
    xHandle: '@doscolive',
    xUrl: 'https://x.com/doscolive',
    linkedinUrl: 'https://linkedin.com/company/dosco-live',
  },
  iosAppArgument: 'doscolive://',
  assets: {
    logoSymbol: '/kortix-symbol.svg',
    logoMarkWhite: '/logomark-white.svg',
    logoMarkCompactWhite: '/kortix-logomark-white.svg',
  },
} as const;
