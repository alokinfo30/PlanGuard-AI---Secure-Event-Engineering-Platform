import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  role: 'Host' | 'Guest' | 'Administrator';
  avatar: string;
  verified: boolean;
  tenantId: string;
  isLiveGoogleAccount?: boolean;
}

export const GOOGLE_CLIENT_ID = firebaseConfig.oAuthClientId || '739840860715-imppiqnuf0mbudhfc4i96dtbcnlpdm5o.apps.googleusercontent.com';
export const GOOGLE_PROJECT_ID = firebaseConfig.projectId || 'gen-lang-client-0496466038';

export const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Initialize Firebase safely
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// In-memory token cache (Do NOT store in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const createGoogleProvider = (forceAccountSelection: boolean = false) => {
  const provider = new GoogleAuthProvider();
  SCOPES.forEach((scope) => provider.addScope(scope));
  if (forceAccountSelection) {
    provider.setCustomParameters({
      prompt: 'select_account',
    });
  }
  return provider;
};

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const googleUser: GoogleUser = {
        id: user.uid,
        email: user.email || 'user@gmail.com',
        name: user.displayName || user.email?.split('@')[0] || 'Google User',
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'guest')}`,
        role: user.email?.includes('guest') ? 'Guest' : 'Host',
        verified: user.emailVerified || true,
        tenantId: `tenant_${user.uid.slice(0, 8)}`,
        isLiveGoogleAccount: true,
      };

      if (onAuthSuccess) {
        onAuthSuccess(googleUser, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure && !isSigningIn) {
        onAuthFailure();
      }
    }
  });
};

// Sign in with Google Popup (supports forcing the account selection screen)
export const signInWithGoogle = async (
  forceAccountSelect: boolean = false
): Promise<{ user: GoogleUser; accessToken: string | null }> => {
  try {
    isSigningIn = true;
    const provider = createGoogleProvider(forceAccountSelect);
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    cachedAccessToken = credential?.accessToken || null;
    
    const user = result.user;
    const googleUser: GoogleUser = {
      id: user.uid,
      email: user.email || 'user@gmail.com',
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'user')}`,
      role: 'Host',
      verified: user.emailVerified || true,
      tenantId: `tenant_${user.uid.slice(0, 8)}`,
      isLiveGoogleAccount: true,
    };

    return { user: googleUser, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Pre-configured test accounts for instant development testing
export const PRECONFIGURED_TEST_ACCOUNTS: GoogleUser[] = [
  {
    id: 'user_alokinfo30',
    email: 'alokinfo30@gmail.com',
    name: 'Alok (Primary Account)',
    role: 'Host',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_alokinfo30',
    isLiveGoogleAccount: false,
  },
  {
    id: 'user_alokinfo_proict',
    email: 'alokinfo.proict@gmail.com',
    name: 'Alok ProICT (Secondary Account)',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_alokinfo_proict',
    isLiveGoogleAccount: false,
  },
  {
    id: 'user_secure_alice',
    email: 'alice.organizer@gmail.com',
    name: 'Alice (Wedding Lead Organizer)',
    role: 'Host',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_secure_alice',
    isLiveGoogleAccount: false,
  },
  {
    id: 'user_greenwood_guest',
    email: 'david.guest@gmail.com',
    name: 'David (Community Coordinator)',
    role: 'Guest',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    verified: true,
    tenantId: 'user_greenwood_guest',
    isLiveGoogleAccount: false,
  },
];

export const AUTHORIZED_ORIGINS = [
  'https://ais-dev-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
  'https://ais-pre-usnjl7mubvv4watcmkhmvf-440468285390.asia-east1.run.app',
  'http://localhost:3000',
];
