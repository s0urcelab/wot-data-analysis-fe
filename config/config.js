// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV, API_PREFIX, CURR_VERSION } = process.env;

export default defineConfig({
  hash: true,
  antd: {
    // dark: true,
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/marks-of-excellence',
      name: 'moe',
      icon: 'profile',
      component: './moe',
    },
    {
      path: '/changelogs',
      name: 'changelogs',
      hideInMenu: true,
      component: './changelogs',
    },
    {
      path: '/message',
      name: 'message',
      hideInMenu: true,
      component: './msg',
    },
    {
      path: '/box-ce-mod',
      name: 'box-ce-mod',
      icon: 'tool',
      component: './boxce',
    },
    {
      path: '/athena',
      name: 'athena',
      icon: 'experiment',
      component: './athena',
    },
    {
      path: '/',
      redirect: '/marks-of-excellence',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  define: {
    API_PREFIX: API_PREFIX || '',
    CURR_VERSION: CURR_VERSION || '未知',
  },
  // analyze: {
  //   analyzerMode: 'server',
  //   analyzerPort: 8888,
  //   openAnalyzer: true,
  //   // generate stats file while ANALYZE_DUMP exist
  //   generateStatsFile: false,
  //   statsFilename: 'stats.json',
  //   logLevel: 'info',
  //   defaultSizes: 'parsed', // stat  // gzip
  // },
});
