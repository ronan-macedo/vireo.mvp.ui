import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'shared-component-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  version = environment.version;
  year = new Date().getFullYear();
}
