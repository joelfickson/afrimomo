import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Afrimomo',
  tagline: 'Unified African Payment Integration',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://afrimomo.dev',
  baseUrl: '/',

  organizationName: 'joelfickson',
  projectName: 'afrimomo',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/joelfickson/afrimomo/tree/master/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/afrimomo-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Afrimomo',
      logo: {
        alt: 'Afrimomo Logo',
        src: 'img/logo-light.png',
        srcDark: 'img/logo-dark.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'sdkSidebar',
          position: 'left',
          label: 'SDK',
        },
        {
          type: 'docSidebar',
          sidebarId: 'mcpSidebar',
          position: 'left',
          label: 'MCP Server',
        },
        {
          href: 'https://www.npmjs.com/package/afrimomo-sdk',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/joelfickson/afrimomo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'SDK Guide',
              to: '/docs/sdk/overview',
            },
            {
              label: 'MCP Server',
              to: '/docs/mcp/overview',
            },
          ],
        },
        {
          title: 'Payment Providers',
          items: [
            {
              label: 'PayChangu',
              href: 'https://developer.paychangu.com/',
            },
            {
              label: 'PawaPay',
              href: 'https://docs.pawapay.io/',
            },
            {
              label: 'OneKhusa',
              href: 'https://onekhusa.com/',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/joelfickson/afrimomo',
            },
            {
              label: 'npm - SDK',
              href: 'https://www.npmjs.com/package/afrimomo-sdk',
            },
            {
              label: 'npm - MCP',
              href: 'https://www.npmjs.com/package/afrimomo-mcp',
            },
          ],
        },
      ],
      copyright: `MIT License - Built for African developers`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
