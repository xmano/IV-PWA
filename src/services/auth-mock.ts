import {
  IonicNativeAuthConfig,
  IonicNativeAuthVaultConfig,
  IonicNativeAuthService,
  IonicNativeAuthVaultService,
  IonicNativeAuthLoginConfig,
  IonicNativeAuthSignupConfig,
  IonicNativeAuthResetPasswordConfig,
  IonicNativeAuthPlugin
} from '../lib';

class IonicNativeAuthMockImpl implements IonicNativeAuthPlugin {
  _isLocked = false;

  setup(config: IonicNativeAuthConfig): IonicNativeAuthService {
    return this;
  }

  createVault(config: IonicNativeAuthVaultConfig): IonicNativeAuthVaultService {
    this.onLock = config.onLock;
    this.onLogout = config.onLogout;
    return this;
  }

  onLock(eventData: any) {}
  onLogout() {}

  isLocked() {
    return Promise.resolve(!!this._getLocalToken());
  }

  _getLocalToken() {
    return window.localStorage.getItem('local-token');
  }

  clear() {
    this.lock();
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('token');
    return Promise.resolve();
  }

  lock() {
    window.localStorage.removeItem('local-token');
    this.onLock && this.onLock(null);
    return Promise.resolve();
  }

  hasStoredToken(): Promise<boolean> {
    return Promise.resolve(!!window.localStorage.getItem('user'));
  }

  getToken(): Promise<string> {
    return Promise.resolve(window.localStorage.getItem('token'));
  }

  getStoredUsername(): Promise<string> {
    return Promise.resolve(window.localStorage.getItem('user'));
  }

  storeToken(username: string, token: string) {
    window.localStorage.setItem('user', username);
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('local-token', token);
    return Promise.resolve();
  }

  getBiometricType() {
    return Promise.resolve('touchid');
  }

  /**
   * Enable/disable biometric authentication when retrieving tokens
   * from the locked vault.
   * @param isBiometricsEnabled 
   */
  async setBiometricsEnabled(isBiometricsEnabled) {
    window.localStorage.setItem('bio', '' + isBiometricsEnabled);
  }

  async isBiometricsEnabled() {
    return window.localStorage.getItem('bio') === 'true';
  }

  login(options?: IonicNativeAuthLoginConfig) {
    return Promise.resolve();
  }

  signup(options?: IonicNativeAuthSignupConfig) {
    return Promise.resolve();
  }

  resetPassword(options?: IonicNativeAuthResetPasswordConfig) {
    return Promise.resolve();
  }

}

const IonicNativeAuthMock = new IonicNativeAuthMockImpl();
export { IonicNativeAuthMock }