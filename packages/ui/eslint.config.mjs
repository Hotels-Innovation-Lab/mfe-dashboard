import base from '@mfe/config/eslint';

export default [
  ...base,
  {
    // shadcn-generated code: kept as close to upstream as possible so `shadcn add --overwrite`
    // stays painless. Relax the React Compiler rules it doesn't satisfy.
    files: ['src/components/**', 'src/hooks/**'],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
