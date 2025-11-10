module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only
        'style', // Formatting, missing semi colons, etc
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'chore', // Maintain, deps, config, etc
        'revert', // Revert a previous commit
        'ci', // CI/CD changes
        'build', // Build system or dependencies
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'notes',
        'properties',
        'tags',
        'search',
        'sync',
        'reminders',
        'auth',
        'io',
        'ui',
        'storage',
        'web',
        'mobile',
        'desktop',
        'core',
        'types',
        'deps',
        'config',
        'docs',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
