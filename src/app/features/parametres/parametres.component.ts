import { Component } from '@angular/core';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.scss']
})
export class ParametresComponent {
  screen: number = 1;

  nextScreeen(num: number) {
    this.screen = num;
  }
}
