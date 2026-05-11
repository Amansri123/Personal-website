import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**/*']
  },
  ...tseslint.configs.recommended,
  {
    files: ['firestore.rules', 'DRAFT_firestore.rules'],
    plugins: {
      'firebase-security-rules': firebaseRulesPlugin,
    },
    languageOptions: {
      parser: firebaseRulesPlugin.parsers.firestore,
    },
    rules: {
      ...firebaseRulesPlugin.configs['flat/recommended'].rules,
    },
  },
];
