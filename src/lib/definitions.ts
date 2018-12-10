export type AuthCompleteCallback = (data?: any) => void;
export type AuthSaveCallback = (username: string, credential: string) => void;
export type AuthFailCallback = (data?: any) => void;

export enum AuthMethod {
  BiometricOnly = 0,
  PinFallback,
  PinOnly
}

export interface IonicNativeAuthConfig {
  forms: {
    logo?: string;
    backgroundColor?: string;
    textColor?: string;
    inputTextColor?: string;
    inputPlaceholderColor?: string;
    inputBackgroundColor?: string;
    highlightColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
  };
  login: IonicNativeAuthLoginConfig;
  signup: IonicNativeAuthSignupConfig;
  resetPassword: IonicNativeAuthResetPasswordConfig;
  vault: IonicNativeAuthVaultConfig;
  onLogin?(data: any, complete: AuthCompleteCallback, save: AuthSaveCallback, fail: AuthFailCallback): void;
  onAutoLogin?(data: any, complete: AuthCompleteCallback, fail: AuthFailCallback): void;
  onSignup?(data: any, complete: AuthCompleteCallback, save: AuthSaveCallback, fail: AuthFailCallback): void;
  onResetPassword?(data: any, complete: AuthCompleteCallback, fail: AuthFailCallback): void;
  onLogout?(data: AuthLogoutEvent): void;
}

export interface AuthLogoutEvent {
  isTimeout?: boolean;
}

export interface IonicNativeAuthLoginConfig {
  title?: string;
  timeoutTitle?: string;
  showClose?: boolean;
  usernameType?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
}

export interface IonicNativeAuthSignupConfig {
  title?: string;
  enabled?: boolean;
  fields?: { type: string, placeholder: string }[]
}

export interface IonicNativeAuthResetPasswordConfig {
  title?: string;
  enabled?: boolean;
}

export interface IonicNativeAuthVaultConfig {
  authMethod?: AuthMethod;
  lockOnClose? : boolean;
  lockAfter?: number;
  hideScreenOnBackground?: boolean;
  enableBiometrics?: boolean;
  onLock?(data: any): void;
  onLogout?(): void;
}

export interface IonicNativeAuthVaultService {
  // Clear the vault of all tokens
  clear(): Promise<void>;
  // Force the vault to lock, requiring biometrics to access
  // any stored tokens
  lock(): Promise<void>;
  // Check if the vault is currently locked
  isLocked(): Promise<boolean>;
  // Check if the vault has a stored token
  hasStoredToken(): Promise<boolean>;
  // Try to get the token, which will prompt for biometrics
  getToken(): Promise<any>;
  // Get the stored username
  getStoredUsername(): Promise<any>;
  // Save token to the vault with the given username
  storeToken(username: string, token: string): Promise<void>;
  // Get the type of available biometrics
  getBiometricType(): Promise<string>;
  // Set whether biometrics is enabled
  setBiometricsEnabled(isBiometricsEnabled: boolean): Promise<void>;
  // Whether biometrics is enabled
  isBiometricsEnabled(): Promise<boolean>;
}

export interface IonicNativeAuthService extends IonicNativeAuthVaultService {
  login(options?: IonicNativeAuthLoginConfig): Promise<void>;
  signup(options?: IonicNativeAuthSignupConfig): Promise<void>;
  resetPassword(options?: IonicNativeAuthResetPasswordConfig): Promise<void>;
}

export interface IonicNativeAuthPlugin {
  setup(config: IonicNativeAuthConfig): IonicNativeAuthService;
  createVault(config: IonicNativeAuthVaultConfig): IonicNativeAuthVaultService;
}