import { IonicNativeAuthVaultConfig, IonicNativeAuthVaultService, IonicNativeAuthPlugin } from './definitions';
import { IonicIdentityVaultBrowser, IonicNativeAuth } from './iv-browser';

//IonicIdentityVaultBrowser member
var vIonicNativeAuth: IonicNativeAuthPlugin = null;

export class IonicIdentityVaultUser {
  // The instance of the Ionic Enterprise Identity Vault
  vault: IonicNativeAuthVaultService;

  // The token for the user, used to make authenticated API requests
  token: any;

  _readyPromise: Promise<any>;

  _isReady = false;

  _isWeb = false;

  constructor(public platform: { ready: () => Promise<any> }, 
              private vaultConfig: IonicNativeAuthVaultConfig) {
    // Store the promise returned from loading the vault. Once the vault is ready,
    // any cached credentials, such as a JWT token that is not locked, will
    // be loaded.
    this._readyPromise = this.getVault().then(this.restoreSession.bind(this));
    //this._isWeb = vaultConfig.isWeb;

    //vIonicNativeAuth = IonicNativeAuth;
  }

  // Will be overridden by children
  /**
   * Called when the vault has been locked
   */
  onVaultLocked(_eventData: any) {}
  
  /**
   * Called when an unlocked session has been found in the vault on
   * initialization
   * @param token
   */
  onSessionRestored(_token: any) {}

  getPlugin(): IonicNativeAuthPlugin {
    if (vIonicNativeAuth == null) {
      //instantiate a new object of IonicNativeBrowser & return it
      vIonicNativeAuth = new IonicIdentityVaultBrowser();
    }
    return vIonicNativeAuth;
  }

  serializeMultiToken(_token: any) {
    if (_token !== null && typeof _token === 'object') {
      return JSON.stringify(_token);
    }
    return _token;
  }

  deserializeMultiToken (_token: any) {
    try {
      return JSON.parse(_token);
    } catch (err) {
      return _token;
    }
  }

  /**
   * ready should be called by users of the User service that need to
   * access user info. Once the vault is loaded, the promise resolves.
   */
  async ready() {
    if (this._isReady) {
      return Promise.resolve();
    }
    await this._readyPromise;
    this._isReady = true;
  }

  /**
   * Get the vault instance by setting up the IonicNativeAuth vault
   * and setting our desired configuration.
   */
  async getVault() {
    await this.platform.ready();

    // If the vault is already constructed, return it
    if (this.vault != null) {
      return this.vault;
    }

    // Otherwise, create and configure the vault
    this.vault = this.getPlugin().createVault({
      ...this.vaultConfig,
      onLock: (eventData: any) => {
        this.onVaultLocked(eventData);
      }
    });


    return this.vault;
  }

  /**
   * Restore a cached user session. A cached session is
   * one that is available without requiring biometric authentication.
   * For example, if your app allows long-lived sessions, you can
   * store a JWT token in memory or insecure storage
   */
  async restoreSession() {
    try {
      // Check if the vault is unlocked and has a token
      if (!(await this.vault.isLocked())) {
        // You might want to check and verify the session is still active here
        const _token = await this.vault.getToken();
        this.token = this.deserializeMultiToken(_token);
        this.onSessionRestored(this.token);
      }
    } catch (e) {
      console.error('Unable to restore session', e);
    }
  }

  /**
   * Save a user session in the vault.
   * @param email
   * @param token
   */
  async saveSession(email: string, token: any) {
    // Store the token for HTTP requests later
    this.token = token;

    // Store the credentials to the secure vault
    const vault = await this.getVault();
    vault.storeToken(email, this.serializeMultiToken(token));
  }


  /**
   * Return the email associated with any stored credentials
   * in the vault.
   */
  async getStoredUsername() {
    const vault = await this.getVault();
    return vault.getStoredUsername();
  }

  /**
   * Return the saved token in the vault. This will trigger
   * biometric authentication if the vault is locked
   */
  async getStoredToken() {
    const vault = await this.getVault();
    let _token = await vault.getToken();
    _token = this.deserializeMultiToken(_token);
    this.token = _token;
    return this.token;
  }

  /**
   * Check if there is a stored token in the vault.
   */
  async hasStoredToken() {
    const vault = await this.getVault();
    return vault.hasStoredToken();
  }

  /**
   * Log the user out entirely, and forget any stored
   * authentication tokens
   */
  async logout() {
    const vault = await this.getVault();
    return vault.clear();
  }

  /**
   * Lock the user out without clearing their secure session
   * information from the vault
   */
  async lockOut() {
    const vault = await this.getVault();
    return vault.lock();
  }

  /**
   * Return the type of biometric sensor the device has, if any.
   * This returns a descriptive string, such as 'touchid', 'faceid', or
   * 'fingerprint' (for android devices w/ fingerprint sensors)
   */
  async getBiometricType() {
    const vault = await this.getVault();
    const type = await vault.getBiometricType();
    if (type) {
      return type.toLowerCase();
    }
    return '';
  }

  /**
   * Enable/disable biometric authentication when retrieving tokens
   * from the locked vault.
   * @param isBiometricsEnabled
   */
  async setBiometricsEnabled(isBiometricsEnabled: boolean) {
    const vault = await this.getVault();
    return vault.setBiometricsEnabled(isBiometricsEnabled);
  }

  /**
   * Get whether biometrics is enabled
   * @param isBiometricsEnabled
   */
  async isBiometricsEnabled() {
    const vault = await this.getVault();
    return vault.isBiometricsEnabled();
  }
}
