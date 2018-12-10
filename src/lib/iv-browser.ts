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

export class IonicIdentityVaultBrowser implements IonicNativeAuthPlugin {
    //authVault : AuthVault;
    vaultConfig: IonicNativeAuthVaultConfig;

    AuthVault(options: IonicNativeAuthVaultConfig) {
        return {
          config: options,
          clear: function() {
            var config = this.config;
            return new Promise<void>(function(resolve, reject) {
              //Clear the local storage of credentails.
              localStorage.setItem("username", "");
              localStorage.setItem("token", "");    
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
              let savedUsername = localStorage.getItem("username");
              resolve(savedUsername != "");
            });
          },
          hasStoredToken: function() {
            return new Promise<boolean>(function(resolve, reject) {
              let credentials = localStorage.getItem("token");
              resolve(credentials != "");
            });
          },
          getToken: function() {
            return new Promise(function(resolve, reject) {
              let credentials = localStorage.getItem("token");
              resolve(credentials);
            });
          },
          storeToken: function(username: any, credential: any) {
            return new Promise<any>(function(resolve, reject) {
              localStorage.setItem("username", username);
              localStorage.setItem("token", credential);
              resolve(true);
            });
          },
          getStoredUsername: function() {
            return new Promise(function(resolve, reject) {
              let username = localStorage.getItem("username");
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

    }

    setup(config: IonicNativeAuthConfig): IonicNativeAuthService {
        return null;
    }

    createVault(config: IonicNativeAuthVaultConfig): IonicNativeAuthVaultService {
        let vault = this.AuthVault(config);
        return vault;
    }

}