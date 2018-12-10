import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = SettingsPage;

  constructor(public events: Events, public navCtrl: NavController) {
    events.subscribe('user:logout', () => {
      this.navCtrl.popToRoot();
    });
  }
}
