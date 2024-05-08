import { Injectable, inject } from '@angular/core';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public static EXT_ACCESS_TOKEN = 'external_access_token';
  public static ACCESS_TOKEN = 'access_token';
  public static REFRESH_TOKEN = 'refresh_token';
  public static TOKEN_TYPE = 'token_type';
  public static CULTURE = 'culture';
  public static SPECIFIC_CULTURE = 'specificCulture';

  public authStore = inject(AuthStore);

  public login() {
    //
  }

  public renewToken() {
    //
  }

  public checkAuthorize() {
    //
  }
}
