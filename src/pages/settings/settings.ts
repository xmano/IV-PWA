import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../services/user';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // The type of biometric sensor available, if any
  _biometricType: string = null;

  enableBiometrics: boolean = false;

  constructor(public navCtrl: NavController, public user: User, public ngZone: NgZone) {
  }

  async ionViewDidEnter() {
    return this.init();
  }

  async init() {
    await this.user.ready();

    this.ngZone.run(async () => {
      this._biometricType = await this.user.getBiometricType();
      console.log('Got biometric type', this._biometricType);

      this.enableBiometrics = await this.user.isBiometricsEnabled();
    });
  }

  onEnableBiometricsChange() {
    console.log('Toggling biometrics', this.enableBiometrics);

    this.user.setBiometricsEnabled(this.enableBiometrics);
  }

  getBiometricType() {
    if (!this._biometricType) { return null; }

    switch (this._biometricType.toLowerCase()) {
      case 'touchid': return 'TouchID';
      case 'faceid': return 'FaceID';
      case 'fingerprint': return 'Fingerprint';
    }

    return '';
  }

  async onLogout() {
    await this.user.logout();
  }

  async onLock() {
    await this.user.lockOut();
  }
}
