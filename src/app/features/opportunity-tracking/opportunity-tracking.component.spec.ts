import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityTrackingComponent } from './opportunity-tracking.component';

describe('OpportunityTrackingComponent', () => {
  let component: OpportunityTrackingComponent;
  let fixture: ComponentFixture<OpportunityTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunityTrackingComponent]
    });
    fixture = TestBed.createComponent(OpportunityTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
