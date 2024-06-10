import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeasibilityPhaseComponent } from './feasibility-phase.component';

describe('FeasibilityPhaseComponent', () => {
  let component: FeasibilityPhaseComponent;
  let fixture: ComponentFixture<FeasibilityPhaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeasibilityPhaseComponent]
    });
    fixture = TestBed.createComponent(FeasibilityPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
