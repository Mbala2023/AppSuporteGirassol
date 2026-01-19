// Uses the Vaadin provided login an logout helper methods
import {
  login as loginImpl,
  type LoginOptions,
  type LoginResult,
  logout as logoutImpl,
  type LogoutOptions,
} from '@vaadin/hilla-frontend';
import type UsuarioInfo from 'Frontend/generated/ao/appsuportegirassol/models/UsuarioInfo';
import { UsuarioInfoService } from 'Frontend/generated/endpoints';

interface Authentication {
  user: UsuarioInfo | undefined;
  timestamp: number;
}

let authentication: Authentication | undefined;

const AUTHENTICATION_KEY = 'authentication';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
/**
 * Forces the session to expire and removes user information stored in
 * `localStorage`.
 */
export function setSessionExpired() {
  authentication = undefined;

  // Delete the authentication from the local storage
  localStorage.removeItem(AUTHENTICATION_KEY);
}


// Get authentication from local storage
const storedAuthenticationJson = localStorage.getItem(AUTHENTICATION_KEY);
if (storedAuthenticationJson !== null) {
  const storedAuthentication = JSON.parse(storedAuthenticationJson) as Authentication;
  // Check that the stored timestamp is not older than 30 days
  const hasRecentAuthenticationTimestamp =
    new Date().getTime() - storedAuthentication.timestamp < THIRTY_DAYS_MS;
  if (hasRecentAuthenticationTimestamp) {
    // Use loaded authentication
    authentication = storedAuthentication;
  } else {
    // Delete expired stored authentication
    setSessionExpired();
  }
}

/**
 * Login wrapper method that retrieves user information.
 *
 * Uses `localStorage` for offline support.
 */
export async function login(
  username: string,
  password: string,
  options: LoginOptions = {}
): Promise<LoginResult> {
  return await loginImpl(username, password, {
    ...options,
    async onSuccess() {
      // Get user info from endpoint
      const user = await UsuarioInfoService.usuarioLogado();
      authentication = {
        user,
        timestamp: new Date().getTime(),
      };

      // Save the authentication to local storage
      localStorage.setItem(AUTHENTICATION_KEY, JSON.stringify(authentication));
    },
  });
}

/**
 * Login wrapper method that retrieves user information.
 *
 * Uses `localStorage` for offline support.
 */
export async function logout(options: LogoutOptions = {}) {
  return await logoutImpl({
    ...options,
    onSuccess() {
      setSessionExpired();
    },
  });
}

/**
 * Checks if the user is logged in.
 */
export function isLoggedIn() {
  return !!authentication;
}

/**
 * Checks if the user has the role.
 */
export function isUserInRole(role: string) {
  if (!authentication) {
    return false;
  }

  return authentication.user?.authorities.includes(`ROLE_${role}`);
}

export function getAuthenticatedUser() {
  return authentication?.user;
}