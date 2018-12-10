import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { User } from '../services/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, user: User) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });

    user.ready().then(() => {
      console.log('User service and vault ready');
    })

  }
}
