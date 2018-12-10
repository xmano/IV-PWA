import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IonicNativeAuthVaultConfig, IonicIdentityVaultUser } from '../lib';

import { Platform, App } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

// Uncomment the next line if using mocking in getPlugin()
// import { IonicNativeAuthMock } from './auth-mock';

@Injectable()
export class User extends IonicIdentityVaultUser {
  // The token for the user, used to make authenticated API requests
  token: object;

  // Metadata about the user, application-specific
  userInfo: any;

  constructor(public http: HttpClient, public platform: Platform, public app: App) {
    super(platform, <IonicNativeAuthVaultConfig>{
      // Whether to enable biometrics automatically when the user logs in
      enableBiometrics: false,
      // Lock the app if it is terminated and re-opened
      lockOnClose: false,
      // Lock the app after N milliseconds of inactivity
      lockAfter: 5000,
      // Obscure the app when the app is backgrounded (most apps will want
      // to set this to false unless sensitive financial data is being displayed)
      hideScreenOnBackground: true
    })
  }

  onVaultLocked() {
    console.log('Vault locked');
    // Clear our in-memory token
    this.token = null;

    // Vault locked due to inactivity
    //this.clearSession();
    const nav = this.app.getRootNavs()[0];

    alert('You are being securely logged off.');

    if (nav) {
      nav.setRoot(LoginPage);
    }
  }

  async onSessionRestored(token: object) {
    this.token = token;
  }

  // Want to mock the native plugin? Just override getPlugin and provide
  // a mocked version
  // getPlugin() {
  //   return IonicNativeAuthMock;
  // }

  /**
   * User info contains metadata about the user from the server,
   * such as their name, email, or any other important info.
   */
  getInfo() {
    return this.userInfo;
  }

  /**
   * Set metadata for this user
   * @param info
   */
  setInfo(info: any) {
    this.userInfo = info;
  }

  /**
   * Return whether the user is logged in by the presence of
   * a JWT token.
   */
  async isLoggedIn() {
    return !!this.token
  }

  /**
   * Perform a login request
   * @param email
   * @param password
   */
  async login(email: string, password: string) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setInfo({
          name: 'Max'
        })
        const fakeToken = {
          'token1': 'faketoken1',
          'token2': 'faketoken2'
        };
        this.saveSession(email, fakeToken);
        resolve(fakeToken);
      }, 1000);
    })
  }

  /**
   * Perform a signup request
   * @param data
   */
  async signup(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setInfo({
          name: 'Max'
        })
        const fakeToken = {
          'token1': 'faketoken1',
          'token2': 'faketoken2'
        };
        this.saveSession(data.email, fakeToken);
        resolve(fakeToken);
      }, 1000);
    });
  }

  /**
   * Get user info from the server. Also doubles
   * as a way to check if a token is still fresh
   */
  async getUser() {

    // Perform a server request to get the user information
    // This request pulls in a JSON with {name: 'Max'}
    // If you're using IdentityVaultInterceptor, the token header will get added automatically for you
    // const userInfoResult = await this.http.get('https://api.myjson.com/bins/7xoye', { observe: 'response' }).toPromise();

    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          name: 'Max'
        }

        // Save the user info
        this.setInfo(user);

        resolve(user);
      }, 1000);
    });

  }

  async checkToken() {
    // Check the token and get user info
    try {
      await this.getUser();
    } catch {
      // Token is invalid, clear the vault and return null
      const vault = await this.getVault();
      vault.clear();
      return null;
    }
    return this.token;
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
}
