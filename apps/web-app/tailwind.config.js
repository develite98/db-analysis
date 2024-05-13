const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    'libs/core/**/!(*.stories|*.spec).{ts,html,scss}',
    'libs/ui-controls/**/!(*.stories|*.spec).{ts,html,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#0747A6',
          'primary-content': '#ffffff',
          'error-content': '#ffffff',
          orange: '#FFA500',
          neutral: '#e5e7eb',
          'neutral-content': '#000000',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#0747A6',
          'primary-content': '#ffffff',
          'error-content': '#ffffff',
          orange: '#FFA500',
        },
      },
      {
        dracula: {
          ...require('daisyui/src/theming/themes')['dracula'],
          primary: '#0747A6',
          'primary-content': '#ffffff',
          'error-content': '#ffffff',
          orange: '#FFA500',
        },
      },
      {
        lemonade: {
          ...require('daisyui/src/theming/themes')['lemonade'],
          primary: '#0747A6',
          'primary-content': '#ffffff',
          orange: '#FFA500',
        },
      },
    ],
  },
  darkMode: 'class',
};
