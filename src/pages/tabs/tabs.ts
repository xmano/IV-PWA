import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { User } from '../../services/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = SettingsPage;

  constructor(public events: Events, public navCtrl: NavController, public user: User) {
    events.subscribe('user:logout', () => {
      this.user.cancelLogout();
      this.navCtrl.popToRoot();
    });
    
    if (this.user.isPWA()) {
      this.user.logoutTimer();
    }    
  }
}
