import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'accessToken';
const ROLE_KEY = 'userRole';

export async function saveSession(token: string, role: 'INSTRUCTOR' | 'CLIENTE') {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(ROLE_KEY, role);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRole() {
  return SecureStore.getItemAsync(ROLE_KEY) as Promise<'INSTRUCTOR' | 'CLIENTE' | null>;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(ROLE_KEY);
}