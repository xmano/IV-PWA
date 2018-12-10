import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { User } from '../../services/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userName: string;
  storedUsername: string;

  constructor(public navCtrl: NavController, public plt: Platform, public user: User) {
  }

  async ionViewDidEnter() {
    await this.user.ready();
    const info = this.user.getInfo();
    this.userName = info && info['name'] || 'There';
    this.storedUsername = await this.user.getStoredUsername();
  }
}
