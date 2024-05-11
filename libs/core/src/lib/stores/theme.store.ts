import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export const ThemeKey = 'active-theme';
export const AvailableThemes = [
  {
    name: 'Light',
    value: 'light',
  },
  {
    name: 'Dark',
    value: 'dark',
  },
];

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    active: 'light',
  })),
  withMethods((store, document = inject(DOCUMENT)) => ({
    toggleTheme: () => {
      const current = getState(store).active;
      const theme = current === 'light' ? 'dark' : 'light';
      patchState(store, (s) => ({
        ...s,
        active: theme,
      }));

      const localStorage = document.defaultView?.localStorage;

      if (localStorage) {
        localStorage.setItem(ThemeKey, theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
    },
    initTheme: () => {
      const localStorage = document.defaultView?.localStorage;

      if (localStorage) {
        const theme = localStorage.getItem(ThemeKey);
        if (theme && AvailableThemes.some((t) => t.value === theme)) {
          patchState(store, (s) => ({ ...s, active: theme }));
          document.documentElement.setAttribute('data-theme', theme);
        }
      }
    },
  })),
  withHooks({
    onInit: (store) => {
      store.initTheme();
    },
  })
);
