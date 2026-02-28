import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import pluginQuery from '@tanstack/eslint-plugin-query'
import boundaries from 'eslint-plugin-boundaries'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * @type {import('eslint').Linter.Config[]}
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...pluginQuery.configs['flat/recommended'],
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          mode: 'full',
          type: 'shared',
          pattern: [
            'src/components/**/*',
            'src/data/**/*',
            'src/env/**/*',
            'src/hooks/**/*',
            'src/lib/**/*',
            'src/providers/**/*',
            'src/server/!(api)/**/*',
            'src/types/**/*',
          ],
        },
        {
          mode: 'full',
          type: 'api',
          pattern: ['src/rpc/**/*', 'src/server/api/*'],
        },
        {
          mode: 'full',
          type: 'emails',
          pattern: ['src/emails/**/*'],
        },
        {
          mode: 'full',
          type: 'feature',
          capture: ['featureName'],
          pattern: ['src/features/*/**/*'],
        },
        {
          mode: 'full',
          type: 'app',
          capture: ['_', 'fileName'],
          pattern: ['src/app/**/*'],
        },
        {
          mode: 'full',
          type: 'never-import',
          pattern: ['src/*'],
        },
      ],
    },
    rules: {
      /**
       * Boundaries plugin rules
       */
      'boundaries/no-unknown': ['error'],
      'boundaries/no-unknown-files': ['error'],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['shared'],
              allow: ['api', 'emails', 'feature', 'shared'],
            },
            {
              from: ['api'],
              allow: ['api', 'feature', 'shared'],
            },
            {
              from: ['feature'],
              allow: [
                'api',
                'emails',
                'shared',
                ['feature', { featureName: '${from.featureName}' }],
              ],
            },
            {
              from: ['app', 'never-import'],
              allow: ['api', 'shared', 'feature'],
            },
            {
              from: ['app'],
              allow: [['app', { fileName: '*.css' }]],
            },
            {
              from: ['emails'],
              allow: ['emails', 'shared'],
            },
          ],
        },
      ],

      /**
       * Custom overrides
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
