export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/hashed simulation for client-side demo
  targetRole: string;
  createdAt: string;
  lastLoginAt?: string;
}

const STORAGE_KEY = 'careernova_accounts_registry_v1';

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Chen',
    email: 'candidate@careernova.ai',
    passwordHash: 'demo123',
    targetRole: 'Full Stack AI Engineer',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-demo-2',
    name: 'Sarah Connor',
    email: 'sarah.c@placement.edu',
    passwordHash: 'placement2026',
    targetRole: 'Software Development Engineer (SDE)',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'user-demo-3',
    name: 'Dev Candidate',
    email: '25ec203@kpriet.ac.in',
    passwordHash: 'kpriet2026',
    targetRole: 'Full Stack AI Engineer',
    createdAt: new Date().toISOString(),
  },
];

export function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  } catch (err) {
    console.warn('Failed to load accounts registry, using defaults', err);
    return DEFAULT_ACCOUNTS;
  }
}

export function registerNewAccount(account: {
  name: string;
  email: string;
  password: string;
  targetRole: string;
}): { success: boolean; error?: string; account?: RegisteredAccount } {
  const emailClean = account.email.trim().toLowerCase();
  const nameClean = account.name.trim();

  if (!nameClean || nameClean.length < 2) {
    return { success: false, error: 'Full name must be at least 2 characters.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailClean)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!account.password || account.password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const accounts = getRegisteredAccounts();
  const existing = accounts.find((a) => a.email.toLowerCase() === emailClean);

  if (existing) {
    return {
      success: false,
      error: `An account with ${emailClean} already exists. Please Sign In with your password.`,
    };
  }

  const newAcc: RegisteredAccount = {
    id: `acc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: nameClean,
    email: emailClean,
    passwordHash: account.password,
    targetRole: account.targetRole || 'Full Stack AI Engineer',
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAcc);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Storage write failure', err);
  }

  return { success: true, account: newAcc };
}

export function verifyCredentials(
  email: string,
  password: string
): { success: boolean; error?: string; account?: RegisteredAccount } {
  const emailClean = email.trim().toLowerCase();
  const accounts = getRegisteredAccounts();

  const found = accounts.find((a) => a.email.toLowerCase() === emailClean);

  if (!found) {
    return {
      success: false,
      error: `No account registered with ${emailClean}. Please create an account via Sign Up.`,
    };
  }

  if (found.passwordHash !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your credentials or use Quick Demo.',
    };
  }

  // Update lastLoginAt
  found.lastLoginAt = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    // Ignore storage error
  }

  return { success: true, account: found };
}
