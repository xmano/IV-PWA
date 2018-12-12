import { IonicNativeAuthConfig, IonicNativeAuthVaultConfig, 
        IonicNativeAuthPlugin, IonicNativeAuthService, IonicNativeAuthVaultService } from './definitions';

export var IonicNativeAuth:IonicNativeAuthPlugin = {
  setup: function(config: IonicNativeAuthConfig): IonicNativeAuthService {
    return null;
  },
  createVault: function(config: IonicNativeAuthVaultConfig) : IonicNativeAuthVaultService {
    return null;  
  }
};

/**
 * Available types of storage driver for storing credentials in vault.
 * Notes: Add any new driver enum after this and the setter/getters.
 */
enum StorageDriver {
  LocalStore = 0,
  CookieStore
}

export class IonicIdentityVaultBrowser implements IonicNativeAuthPlugin {
    cookieLock: Date;
    storageType: StorageDriver;
    vaultConfig: IonicNativeAuthVaultConfig;

    AuthVault(options: IonicNativeAuthVaultConfig, vault?: IonicIdentityVaultBrowser) {
      
      return {
        config: options,
        clear: function() {
          var config = this.config;
          return new Promise<void>(function(resolve, reject) {
            //Clear the local storage of credentails.
            vault.clear();
            setTimeout(()=> {
              let event: any = {};
              event.saved = false;
              event.timeout = false;
              //Call the lock handler here..
              config.onLock && config.onLock(event);
            }, 500);              
            resolve(null);
          });
        },
        isLocked: function() {
          return new Promise<boolean>(function(resolve, reject) {
            //check if username exists.
            let savedUsername = vault.get("username");
            resolve(savedUsername != "");
          });
        },
        hasStoredToken: function() {
          return new Promise<boolean>(function(resolve, reject) {
            let credentials = vault.get("token");
            resolve(credentials != "");
          });
        },
        getToken: function() {
          return new Promise(function(resolve, reject) {
            let credentials = vault.get("token");
            resolve(credentials);
          });
        },
        storeToken: function(username: any, credential: any) {
          return new Promise<any>(function(resolve, reject) {
            //vault.set("username", username);
            //vault.set("token", credential);
            let key = "username="
            let value = username + ';' + "token=" + credential + ';' ;
            vault.set(key, value);
            resolve(true);
          });
        },
        getStoredUsername: function() {
          return new Promise(function(resolve, reject) {
            let username = vault.get("username");
            resolve(username);
          });
        },
        lock: function() {
          var config = this.config;
          return new Promise<void>(function(resolve, reject) {
            setTimeout(()=> {
              let event: any = {};
              event.saved = true;
              event.timeout = false;                
              //Call the lock handler here..
              config.onLock && config.onLock(event);
            }, 500)
            resolve(null);
          });
        },
        getBiometricType: function() {
          return new Promise<string>(function(resolve, reject) {
            resolve("PIN");
          });
        },
        setBiometricsEnabled: function(isBiometricsEnabled: boolean) {
          return new Promise<void>(function(resolve, reject) {
            resolve(null);
          });
        },
        isBiometricsEnabled: function() {
          return new Promise<boolean>(function(resolve, reject) {
            let isEnabled = false;
            resolve(isEnabled);
          });
        }
      }
    }
      
    constructor() {
      this.storageType = StorageDriver.CookieStore;
    }

    setCookie(key: string, value: string, expires: Date) {
      let data = value + ';';
      data += 'expires=' + expires.toUTCString() + ';';
      
      this.vaultConfig.accessCookie(data);
    }
    
    getCookie(key: string) : string {
      key += '=';
      let data = this.vaultConfig.accessCookie("");
      let ck = data.split(/;\s*/);
      for(let i = ck.length - 1; i >= 0; i--) {
        if (!ck[i].indexOf(key))
            return ck[i].replace(key, '');
      }
      return "";      
    }
    
    /**
     * Clear all the entries in the vault.
     * @param none
     */
    clear(): void {
      if (this.storageType == StorageDriver.LocalStore) {
        localStorage.setItem("username", "");
        localStorage.setItem("token", "");
      } else {
        let expiredDate = new Date('Thu, 01 Jan 1970 00:00:01 GMT');
        this.setCookie("username", "", expiredDate);
        //this.setCookie("token", "", expiredDate);
      }
    }

    set(key: string, value: string): void {
      if (this.storageType == StorageDriver.LocalStore) {
        localStorage.setItem(key, value);
      } else {
        this.setCookie(key, value, this.cookieLock);        
      }      
    }

    get(key: string): string {
      if (this.storageType == StorageDriver.LocalStore) {
        return localStorage.getItem(key);
      } else {
        return this.getCookie(key);        
      }      
    }
    
    setup(config: IonicNativeAuthConfig): IonicNativeAuthService {
      return null;
    }

    createVault(config: IonicNativeAuthVaultConfig): IonicNativeAuthVaultService {
      this.vaultConfig = config;
      let vault = this.AuthVault(config, this);
      if (this.storageType == StorageDriver.CookieStore) {
        this.cookieLock = new Date(new Date().getTime() + config.lockAfter );
      }
      return vault;
    }
}