import { useSyncExternalStore } from "react";

import { clearAuth, getSession, subscribeAuth, type AuthSession } from "./authStore";

function subscribe(listener: () => void) {
  return subscribeAuth(listener);
}

export function useAuth(): {
  session: AuthSession | null;
  isAuthenticated: boolean;
  signOut: () => void;
} {
  const session = useSyncExternalStore(
    subscribe,
    () => getSession(),
    () => null,
  );

  return {
    session,
    isAuthenticated: Boolean(session),
    signOut: clearAuth,
  };
}
