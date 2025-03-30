import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
	// base JS rules
	js.configs.recommended,

	importPlugin.flatConfigs.recommended,
	importPlugin.flatConfigs.react,
	importPlugin.flatConfigs.typescript,

	// recommended rules for TypeScript that additionally require type information
	...tseslint.configs.recommendedTypeChecked,

	// Custom project-specific overrides
	{
		// all .ts files, including nested
		files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
		ignores: ['eslint.config.ts', 'vite.config.ts'],

		languageOptions: {
			// parse and lint TypeScript files
			// tell our parser how to find the TSConfig for each source file.
			parserOptions: {
				// indicates to ask TypeScript's type checking service for each source file's type information
				projectService: true,

				project: './tsconfig.json',

				// tells our parser the absolute path of your project's root directory
				// ? Requires `@types/node`
				tsconfigRootDir: import.meta.dirname,

				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'no-console': 'warn',
			'no-debugger': 'warn',
			'no-warning-comments': ['warn', { terms: ['!'] }],
			'object-shorthand': 'error',
			'no-param-reassign': [
				'error',
				{
					props: false,
				},
			],

			'no-shadow': 'off',
			'@typescript-eslint/no-shadow': ['error'],

			'no-use-before-define': 'off',
			'@typescript-eslint/no-use-before-define': [
				'error',
				{ functions: false, variables: false },
			],

			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],

			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-floating-promises': [
				'error',
				{ ignoreVoid: true },
			],
			'@typescript-eslint/strict-boolean-expressions': 'warn',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'separate-type-imports',
				},
			],
			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/ban-types': 'off',

			'import/no-unresolved': 'error',
			'import/order': [
				'error',
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					groups: [
						'external',
						'type',
						'internal',
						'builtin',
						['parent', 'sibling', 'index'],
						'unknown',
					],
					pathGroups: [
						{
							pattern: 'encore.dev/**',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@prisma/**',
							group: 'external',
							position: 'before',
						},
						{
							pattern: '@/types/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/interfaces/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/enums/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/models/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/api/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/utilities/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/functions/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/tests/**',
							group: 'type',
							position: 'after',
						},
						{
							pattern: '@/**',
							group: 'type',
							position: 'after',
						},
					],
					'newlines-between': 'always',
					pathGroupsExcludedImportTypes: ['builtin', 'type'],
					named: true,
				},
			],
			'import/extensions': [
				'error',
				'never',
				{
					css: 'always',
					scss: 'always',
					sass: 'always',
				},
			],
			'import/no-default-export': 'off',
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: [
						'**/*.test.{ts,tsx}',
						'**/__tests__/**',
						'**/jest.setup.ts',
						'**/jest.config.ts',
						'**/*.stories.{ts,tsx}',
					],
					optionalDependencies: false,
					peerDependencies: false,
				},
			],
		},
		settings: {
			ecmaVersion: 'latest',
			react: {
				version: 'detect',
			},
			'import/resolver': {
				node: true,
				typescript: {
					project: './tsconfig.json',
					alwaysTryTypes: true,
				},
			},
		},
	},

	{
		files: ['**/*.js', '.encore/**', 'eslint.config.ts', 'vite.config.ts'],
		...tseslint.configs.disableTypeChecked,
	},

	{
		files: ['eslint.config.ts'],
		rules: {
			'import/no-unresolved': 'off',
		},
	},

	// turns off all rules that are unnecessary or might conflict with Prettier
	eslintConfigPrettier,
];
