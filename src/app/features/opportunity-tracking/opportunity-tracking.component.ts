import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opportunity-tracking',
  templateUrl: './opportunity-tracking.component.html',
  styleUrls: ['./opportunity-tracking.component.scss']
})
export class OpportunityTrackingComponent {
  constructor(private route: Router,) {
    
  }
  gotoHome() {
    this.route.navigate(['/home']);
  }
}
