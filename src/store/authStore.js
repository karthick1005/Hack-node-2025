import { create } from "zustand";
import { persist } from "zustand/middleware";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      isDemo: false, // Track if user is using demo credentials
      setUser: (user, isDemo = false) => set({ user, loading: false, isDemo }),
      logout: () => set({ user: null, loading: false, isDemo: false }),
      initializeAuth: () => {
        const currentState = get();
        
        // If user is already logged in with demo credentials, don't override
        if (currentState.user && currentState.isDemo) {
          set({ loading: false });
          return;
        }

        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            set({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              },
              loading: false,
              isDemo: false,
            });
          } else {
            // Only clear user if they're not using demo credentials
            const state = get();
            if (!state.isDemo) {
              set({ user: null, loading: false, isDemo: false });
            } else {
              set({ loading: false });
            }
          }
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
