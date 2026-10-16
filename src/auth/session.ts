import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ait.session.tokens";
const EMAIL_KEY = "ait.session.email";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

/** Persist auth tokens. Tokens live only in expo-secure-store, never in plain text. */
export async function saveSession(tokens: StoredTokens): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens));
}

export async function getSession(): Promise<StoredTokens | null> {
  const raw = await SecureStore.getItemAsync(TOKEN_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as StoredTokens;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(EMAIL_KEY);
}

export async function saveEmail(email: string): Promise<void> {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function getEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(EMAIL_KEY);
}
