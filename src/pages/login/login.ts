import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../services/user';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string = 'matt@ionic.io';
  password: string = 't';

  displayBiometricOption = false;
  biometricType: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public user: User) {
    
  }

  async init() {
    // Check if the user is logged in already (i.e. has a cached session and the vault is not locked).
    // If so, navigate to the main app page
    await this.user.ready();
    const isLoggedIn = await this.user.isLoggedIn();
    console.log('Is user logged in?', isLoggedIn);
    if (isLoggedIn) {
      this.goToApp();
      return;
    }
  }

  private async goToApp() {
    try {
      await this.user.checkToken();
      this.navCtrl.push(TabsPage);
    } catch {
      // Checking token failed, refuse to log in
      this.password = '';
      alert('Your session has expired. Please log in again');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.init();
  }
  
  async ionViewDidEnter() {
    console.log('ionViewDidEnter LoginPage');

    try {
      this.displayBiometricOption = await this.user.hasStoredToken();
      if (this.displayBiometricOption) {
        this.biometricType = await this.user.getBiometricType();
      }
    } catch (e) {
      console.error('Unable to check token status', e);
    }
  }

  async biometricAuth() {
    const hasToken = await this.user.hasStoredToken();

    if (hasToken) {
      const token = await this.user.getStoredToken();
      if (token) {
        this.goToApp();
        return;
      }
    }

    //Update the biometric 
    this.displayBiometricOption = await this.user.hasStoredToken();
    
    // Otherwise, we were unable to authenticate
    alert('Unable to authenticate. Please log in again');
  }

  async login() {
    console.log('Logging in', this.email, this.password);

    try {
      const token = await this.user.login(this.email, this.password);
      console.log('Logged in!', token, await this.user.getInfo());
      this.navCtrl.push(TabsPage)
    } catch (e) {
      // Capture login errors
      console.error('Unable to log in:', e);
    }
  }

}
