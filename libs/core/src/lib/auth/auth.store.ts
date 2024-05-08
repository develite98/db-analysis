import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export interface UserInfo {
  id: number;
  username: string;
  full_name: string;
  full_name_display: string;
  color: string;
  bio: string;
  lang: string;
  theme: string;
  timezone: string;
  is_active: boolean;
  photo: string;
  big_photo: string;
  gravatar_id: string;
  roles: string[];
  total_private_projects: number;
  total_public_projects: number;
  email: string;
  uuid: string;
  date_joined: string;
  read_new_terms: boolean;
  accepted_terms: boolean;
  max_private_projects: number;
  max_public_projects: number;
  max_memberships_private_projects: number;
  max_memberships_public_projects: number;
  verified_email: boolean;
  refresh: string;
  auth_token: string;
}

export const USER_INFO_KEY = 'user_info';

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    userInfo: <UserInfo | undefined>undefined,
  })),
  withMethods((store) => ({
    setUserInfo: (info: UserInfo) => {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
      patchState(store, (s) => ({ userInfo: info }));
    },
  })),
  withHooks((store) => ({
    onInit: () => {
      const state = localStorage.getItem(USER_INFO_KEY);
      if (state) patchState(store, (s) => ({ userInfo: JSON.parse(state) }));
    },
  }))
);
