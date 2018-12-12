import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID, InjectionToken  } from '@angular/core';

import { AuthMethod, IonicNativeAuthVaultConfig, IonicIdentityVaultUser } from '../lib';

import { Events, Platform, App } from 'ionic-angular';
import { DOCUMENT, isPlatformBrowser  } from '@angular/common';

// Uncomment the next line if using mocking in getPlugin()
// import { IonicNativeAuthMock } from './auth-mock';

const isPWA = true;
const lockTime = 1000 * 10; //10 seconds

@Injectable()
export class User extends IonicIdentityVaultUser {
  private readonly documentIsAccessible: boolean;
  
  // The token for the user, used to make authenticated API requests
  token: string;

  // Metadata about the user, application-specific
  userInfo: any;

  // Token to test secure storage vault save / get operations
  testToken: string;
  
  logTimer: any = null

  //authMethod : BiometricOnly, PinFallback, PinOnly
  constructor(public http: HttpClient, public platform: Platform, public app: App,
              public events: Events, @Inject(DOCUMENT) private ckdoc: any,
              @Inject( PLATFORM_ID ) private platformId: InjectionToken<Object>) {
    super(platform, <IonicNativeAuthVaultConfig> {
      authMethod: AuthMethod.PinFallback,
      // Whether to enable biometrics automatically when the user logs in
      enableBiometrics: false,
      // Lock the app if it is terminated and re-opened
      lockOnClose: true,
      // Lock the app after N milliseconds of inactivity
      lockAfter: lockTime, // 30 minutes
      // Obscure the app when the app is backgrounded (most apps will want
      // to set this to false unless sensitive financial data is being displayed)
      hideScreenOnBackground: true,
      
      pwaMode: isPWA
      
    });
    
    //Initialize the testToken to a random value for verification.
    //this.testToken = 'token1234567890-token1234567890';
    
    this.testToken = 'DhkKVeUhket6th_0FZ-AEkj9qFiC8gfftK9jRqhbQmlbTv13zU7CtqetsmAUJdaalNQaCnF-_d3QD9hK5ccZonv4-cMa1PBsoYZiuq968Z9IMMjQP_GSJB_xYG8LasFX3vMRBHrHC7QWiOvC_D4GTymysT2m2afBuThFAvbDeReyt6TxHsfJqQfK8nzlWL34InduKCw5eKqxqvx-4hAm_-p15gTFwaNjGrPyw5PgZK3VoXjrNFCpC4XLp71wPF_fZ';
    
    //while (this.testToken.length < 280) {
    //  this.testToken += Math.random().toString(36);
    //}
    
    this.documentIsAccessible = isPlatformBrowser( this.platformId );
    
  }
  
  onCookieAccess(value: string): string {
    if ( !this.documentIsAccessible ) {
      return "";
    }
    
    if (value != "") {
      this.ckdoc.cookie = "username=" + encodeURIComponent(value);
    }
    
    let v = decodeURIComponent(this.ckdoc.cookie);
    return v;
  }

  onVaultLocked(eventData: any) {
    console.log('Vault locked');
    // Clear our in-memory token
    this.token = null;

    let msg = (eventData.saved) ? 'Token saved.' : 'Token cleared.';
    msg += (eventData.timeout) ? ' You are being securely timed out.' :
         ' You are being securely logged off.';

    alert(msg);
    
    // Vault locked due to inactivity
    //this.clearSession();
    this.events.publish('user:logout');
  }

  async onSessionRestored(token: string) {
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
  
  getCookie(key: string): string {
      key += '=';
      //let store = this.ckdoc.cookie;
      let store = decodeURIComponent(this.ckdoc.cookie);;
      let ck = store.split(/;\s*/);
      for(let i = ck.length - 1; i >= 0; i--) {
        if (!ck[i].indexOf(key))
            return ck[i].replace(key, '');
      }
    return "";
  }

  //Experimental --
  //TODO : clean up!  
  saveToken(email: string, token: string) {
    //TODO: Cookie saved here:
    //const value = email + ';' + "token=" + token + ';' ;
    /*    + expires=" + (new Date(new Date().getTime() + lockTime )).toUTCString() + ';'; */
    
    //this.ckdoc.cookie = "username=" + encodeURIComponent(value);  

    //let w = this.getCookie("token");
    //console.log(w);
  }
  
  
  /**
   * Perform a login request
   * @param email
   * @param password
   */
  async login(email: string, password: string) {
    var token = this.testToken;
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        this.setInfo({
          name: 'Max'
        })
        this.saveSession(email, token);

        resolve(token);
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
        this.saveSession(data.email, this.testToken);
        resolve(this.testToken);
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
    //Verify the token..
    if (this.testToken != this.token) {
      console.log("#Err: token mismatch - please check native auth");
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
  
  /**
   * LogoutTimer / cancelLogout has been added for PWA mode.
   */  
  logoutTimer() { 
    this.logTimer = setTimeout(() => {
      alert("LoggingOut");
      this.logout();
    }, lockTime);
  }

  cancelLogout() {
    clearTimeout( this.logTimer);
  }
  
  isPWA() {
    return isPWA;
  }
}
