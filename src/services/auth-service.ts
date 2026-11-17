import { useAuthStore, type AuthUser } from '../store/use-auth-store';
import { usePetStore } from '../store/use-pet-store';
import { apiFetch } from './api';

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type LogoutResponse = {
  success: boolean;
};

function saveSession(session: AuthSession): AuthSession {
  usePetStore.getState().clearPets();
  useAuthStore.getState().setSession(session.token, session.user);
  return session;
}

export async function signupUser(name: string, email: string, password: string): Promise<AuthSession> {
  const session = await apiFetch<AuthSession>('/api/auth/signup', {
    method: 'POST',
    body: { name, email, password },
  });

  return saveSession(session);
}

export async function loginUser(email: string, password: string): Promise<AuthSession> {
  const session = await apiFetch<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  return saveSession(session);
}

export async function logoutUser(): Promise<void> {
  try {
    await apiFetch<LogoutResponse>('/api/auth/logout', { method: 'POST' });
  } finally {
    useAuthStore.getState().clearSession();
    usePetStore.getState().clearPets();
  }
}
