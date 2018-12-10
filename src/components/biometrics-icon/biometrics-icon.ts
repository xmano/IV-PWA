import { Component, Input } from '@angular/core';

/**
 * Generated class for the BiometricsIconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'biometrics-icon',
  templateUrl: 'biometrics-icon.html',
  host: {
    '[class]': 'type'
  }
})
export class BiometricsIconComponent {
  @Input() type: string = 'fingerprint';

  constructor() {
  }
}
